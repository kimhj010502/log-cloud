import calendar
import os

from flask import Flask, request, redirect, url_for, session, flash, jsonify, Blueprint, abort, send_file
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
import pymysql

from PIL import Image
import io

from sqlalchemy import extract, asc, or_
from sqlalchemy.exc import IntegrityError

from config import ApplicationConfig
from models import db, User, videoInfo, videoLog, socialNetwork

from datetime import datetime, timedelta
import moviepy.editor as mp
import speech_recognition as sr

import paramiko
from config import SSH_HOST, SSH_PORT, SSH_USERNAME, SSH_PASSWORD 

# SCP 연결 설정
ssh_client = paramiko.SSHClient()
ssh_client.load_system_host_keys()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

# SSH 서버 정보
ssh_host = SSH_HOST
ssh_port = SSH_PORT
ssh_username = SSH_USERNAME
ssh_password = SSH_PASSWORD

def add_log(request, session):
	try:
		upload_date = request.json['upload_date']
		session["upload_date"] = upload_date

		return_data = { 'upload_date': upload_date }
		return jsonify(return_data)

	except Exception as e:
		print(f"Error in add log: {str(e)}")


def get_date():
	now = datetime.now()
	remote_video_date = str(now.strftime("%Y%m%d")).replace('-','')
	local_video_date = str(now).replace('-','').replace(' ','').replace(':','').replace('.','')
	return [remote_video_date, local_video_date]




# from transformers import (
#     AutoTokenizer,
#     BartForConditionalGeneration,
#     Seq2SeqTrainingArguments,
#     Seq2SeqTrainer,
#     DataCollatorForSeq2Seq,
#     EarlyStoppingCallback
# )
from tokenizers import Tokenizer
from typing import Dict, List, Optional
from torch.utils.data import Dataset

import pandas as pd
import numpy as np
# import matplotlib.pyplot as plt

# from IPython.display import display
from typing import Dict


def record_video(request, session):
	print('동영상 저장')
	user_id = session.get("user_id")
	try:
		if 'video' in request.files:
			# 파일 경로
			video_file = request.files['video']

			upload_date = session.get("upload_date")

			[remote_video_date, local_video_date] = get_date()
			local_file_name = user_id + local_video_date
			remote_file_name = user_id + remote_video_date

			# 임시 저장 경로 (원하는 경로와 파일명으로 변경)
			local_image_path = f'web/client/public/temp/{local_file_name}.png'
			local_video_path = f'web/client/public/temp/{local_file_name}.mp4'
			local_audio_path = f'web/client/public/temp/{local_file_name}.wav'
			session['local_path'] = [local_image_path, local_video_path, local_audio_path]

			# 최종 저장 경로 (원하는 경로와 파일명으로 변경)
			remote_image_path = f'D:/log/video/{remote_file_name}.png'
			remote_video_path = f'D:/log/video/{remote_file_name}.mp4'

			# 파일 저장
			video_file.save(local_video_path)

			# 음원 추출
			mp.ffmpeg_tools.ffmpeg_extract_audio(local_video_path, local_audio_path)

			#이미지 캡처
			cap = cv2.VideoCapture(local_video_path)
			ret, frame = cap.read()

			if ret:
				cv2.imwrite(local_image_path, frame)
				print('썸네일 저장')
			cap.release()

			# SCP 연결
			ssh_client.connect(ssh_host, port=ssh_port, username=ssh_username, password=ssh_password)

			# 파일을 SCP로 원격 서버에 업로드
			with ssh_client.open_sftp() as sftp:
				sftp.put(local_image_path, remote_image_path)
				sftp.put(local_video_path, remote_video_path)

			# SSH 연결 종료
			ssh_client.close()
			print('SSH 연결 종료')

			# 세션값 추가
			video_file_path = f'temp/{local_file_name}.mp4'
			response_data = {'username':user_id, 'date': remote_video_date, 'video_id': remote_file_name, 'video_url': remote_video_path, 'cover_image': remote_image_path}
			session["video_info"] = response_data
			session["local_audio_path"] = local_audio_path


			return_data = {'video_info': {'upload_date': upload_date, 'video_file_path': video_file_path }}
			print("반환 데이터", return_data)
			return jsonify(return_data)
		
		else:
			print('비디오 파일 없음')
			return 'No video file provided', 400

	except Exception as e:
		print(f"Error in record: {str(e)}")



import torch
device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
print('device:', device)

from transformers import PreTrainedTokenizerFast, BartForConditionalGeneration

# 요약 모델
SUMMARY_DIR_PATH = 'modelling/summary'
summary_model = BartForConditionalGeneration.from_pretrained(SUMMARY_DIR_PATH)
summary_tokenizer = PreTrainedTokenizerFast.from_pretrained(SUMMARY_DIR_PATH)
summary_model = summary_model.to(device)

def diary_summary(text):
	# Encode input text
	input_ids = summary_tokenizer.encode(text, return_tensors = 'pt').to(device)
	# Generate summary text ids
	summary_text_ids = summary_model.generate(input_ids = input_ids,
									bos_token_id = summary_model.config.bos_token_id,
									eos_token_id = summary_model.config.eos_token_id,
									length_penalty = 2.0,
									max_length = min(len(text), 150),
									num_beams = 2)
	return summary_tokenizer.decode(summary_text_ids[0], skip_special_tokens = True)


# 해시태그 모델
HASHTAG_DIR_PATH = 'modelling/hashtag'
hashtag_model = BartForConditionalGeneration.from_pretrained(HASHTAG_DIR_PATH)
hashtag_tokenizer = PreTrainedTokenizerFast.from_pretrained(HASHTAG_DIR_PATH)
hashtag_model = hashtag_model.to(device)

emotion_list = ['🥰', '😆', '🙂', '😐', '🙁', '😠', '😵']

def make_tag(text, emotion):
	# 입력 문장을 토큰화하여 인코딩
	input_ids = hashtag_tokenizer.encode(text, return_tensors="pt").to(device)
	# 모델에 입력 전달하여 디코딩
	output = hashtag_model.generate(input_ids = input_ids, bos_token_id = hashtag_model.config.bos_token_id,
							eos_token_id = hashtag_model.config.eos_token_id, length_penalty = 2.0, max_length = 50, num_beams = 2)
	# 디코딩된 출력을 토크나이저를 사용하여 텍스트로 변환
	decoded_output = hashtag_tokenizer.decode(output[0], skip_special_tokens=True)

	hashtag_list = list(decoded_output.split("#"))[:5]
	hashtag_list.remove('')
	hashtag_list = [s.strip() for s in hashtag_list]
	hashtag_list.insert(0, emotion_list[emotion])
	return hashtag_list


def select_option(request, session):
	user_id = session.get("user_id")
	print('request', request.json)

	try:
		video_info = request.json['video_info']
		emotion = int(request.json['emotion'])
		session['emotion'] = emotion
		switches = request.json['switches']
		summary = ''
		hashtags = []

		session["emotion"] = emotion
		# session["switches"] = switches

		if switches["bgm"]:
			print('bgm 함수 실행')

		# 텍스트 추출 (STT)
		if switches["summary"] | switches["hashtag"]:
			local_audio_path = session.get("local_audio_path")

			r = sr.Recognizer()
			kr_audio = sr.AudioFile(local_audio_path)

			with kr_audio as source:
				audio = r.record(source)

			try:
				text = r.recognize_google(audio, language='ko-KR') #-- 한글 언어 사용

			except:
				try:
					text = r.recognize_sphinx(audio, language='ko-KR')
				except:
					text = ''  # 빈 문자열로 설정

			session['original_text'] = text
			print('text: ', text)

		if switches["summary"]:
			# 요약 모델
			summary = diary_summary(text)
			print('summary: ', summary)
			
		if switches["hashtag"]:
			# 해시태그 모델
			if summary == '':
				hashtags = make_tag(diary_summary(text), emotion)
			else:
				hashtags = make_tag(summary, emotion)
			print('hashtag: ', hashtags)
			

		# return jsonify(return_data)
		return_data = {'video_info': video_info, 'switches': switches, 'summary': summary, 'hashtags': hashtags }
		print('반환 데이터: ', return_data)
		return jsonify(return_data)

	except Exception as e:
		print(f"Error in record: {str(e)}")


def save_log(request, session):
	user_id = session.get("user_id")
	print('request', request.json)

	try:
		print('저장 시작')
		video_info = session["video_info"]
		video_date = f"{video_info['date'][:4]}-{video_info['date'][4:6]}-{video_info['date'][6:]}"
		switches = request.json['switches']
		summary = request.json['summary']
		hashtags = request.json['hashtags']

		prev_log = videoInfo.query.filter_by(video_id=video_info['video_id']).first()
	
		if prev_log:
			db.session.delete(prev_log)
			db.session.commit()
			print('이전 로그 삭제')

		new_log = videoInfo(username=user_id, video_id=video_info['video_id'], video_date=video_date, video_url=video_info['video_url'], cover_image=video_info['cover_image'], original_text=session['original_text'], summary=summary, emotion=session['emotion'], hashtag=hashtags, share=int(switches['public']))
		db.session.add(new_log)
		db.session.commit()

		print('저장 끝')

		#임시 파일 삭제
		for path in session['local_path']:
			os.remove(path)
		# os.remove(f'web/temp/{file_name}.mp4')

		return jsonify({'Finish': 'SAVE'})

	except Exception as e:
		print(f"Error in save: {str(e)}")
