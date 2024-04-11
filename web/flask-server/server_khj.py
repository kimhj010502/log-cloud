import calendar
import os
import stat

from flask import Flask, request, redirect, url_for, session, flash, jsonify, Blueprint, abort, send_file
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
import pymysql

from PIL import Image
import io
import base64

from sqlalchemy import extract, asc, or_
from sqlalchemy.exc import IntegrityError

import cv2
import re
import random

from config import ApplicationConfig
from models import db, User, videoInfo, videoLog, socialNetwork

from datetime import datetime, timedelta
import cv2
# import moviepy.editor as mp
from pyffmpeg import FFmpeg
import subprocess
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


# class SSHManager:
# 	def __init__(self):
# 		self.host = SSH_HOST
# 		self.port = SSH_PORT
# 		self.username = SSH_USERNAME
# 		self.password = SSH_PASSWORD
# 		self.ssh_client = paramiko.SSHClient()
# 		self.ssh_client.load_system_host_keys()
# 		self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
# 		self.sftp = None
		
# 	def open(self):
# 		self.ssh_client.connect(self.host, port=self.port, username=self.username, password=self.password)
# 		self.sftp = self.ssh_client.open_sftp()
		
# 	def close(self):
# 		if self.sftp:
# 			self.sftp.close()
# 		self.ssh_client.close()
		
# 	def create_remote_folder(self, folder_path):
# 		if self.sftp:
# 			self.sftp.mkdir(folder_path)

# 	def remove_folder_contents(self, folder_path):
# 		if self.sftp:
# 			# 원격 폴더 내의 파일 및 폴더 목록 가져오기
# 			remote_items = self.sftp.listdir(folder_path)

# 			# 각 항목을 반복하면서 삭제 또는 재귀적으로 다시 호출
# 			for item in remote_items:
# 				remote_item_path = os.path.join(folder_path, item)
				
#                 # 원격 항목의 속성 가져오기
# 				remote_item_attr = self.sftp.stat(remote_item_path)
				
# 				if stat.S_ISDIR(remote_item_attr.st_mode):
# 					self.remove_folder_contents(remote_item_path)
# 				else:
# 					self.sftp.remove(remote_item_path)


# 	def delete_folder(self, folder_path):
# 		if self.sftp:
# 			self.remove_folder_contents(folder_path)
# 			self.sftp.rmdir(folder_path)
			
# 	def get_remote_folder(self, remote_folder_path, local_folder_path):
# 		if self.sftp:
#             # self.sftp.get(remotepath=remote_folder_path, localpath=local_folder_path)
# 			# 원격 폴더 내의 파일 및 폴더 목록 가져오기
# 			remote_items = self.sftp.listdir(remote_folder_path)

# 			# 로컬 폴더가 없으면 생성
# 			if not os.path.exists(local_folder_path):
# 				os.makedirs(local_folder_path)

# 			# 각 항목을 반복하면서 처리
# 			for item in remote_items:
# 				remote_item_path = os.path.join(remote_folder_path, item)
# 				local_item_path = os.path.join(local_folder_path, item)

# 				# 원격 항목의 속성 가져오기
# 				remote_item_attr = self.sftp.stat(remote_item_path)

# 				# 만약 폴더라면 재귀적으로 다시 호출
# 				if stat.S_ISDIR(remote_item_attr.st_mode):
# 					self.get_remote_folder(self.sftp, remote_item_path, local_item_path)
# 				else:
# 					# 파일이라면 복사
# 					self.sftp.get(remote_item_path, local_item_path)
					
# 	def save_file(self, local_path, remote_path):
# 		if self.sftp:
# 			self.sftp.put(local_path, remote_path)

# 	def get_remote_file(self, remote_file_path, local_file_path):
# 		if self.sftp:
# 			# 로컬 폴더가 없으면 생성
# 			local_folder_path = os.path.dirname(local_file_path)
# 			if not os.path.exists(local_folder_path):
# 				os.makedirs(local_folder_path)

#             # 파일 복사
# 			self.sftp.get(remote_file_path, local_file_path)

import shutil

def delete_local_folder(folder_path):
    try:
        shutil.rmtree(folder_path)
    except Exception as e:
        print(f"Error deleting folder {folder_path}: {e}")


'''server.jyb 수정 시작'''
#회원가입 - 개인 폴더 생성
def register_user(request, bcrypt, ssh_manager):
	try:
		username = request.json['username']
		email = request.json['email']
		password = request.json['password']
		
		# Check if user already exists with username
		user_exists = User.query.filter_by(email=email).first() is not None
		
		if user_exists:
			return jsonify({'message': 'User already exists'}), 409
		
		hashed_password = bcrypt.generate_password_hash(password)
		
		# Insert user into the database
		new_user = User(username=username, email=email, password=hashed_password)
		db.session.add(new_user)
		db.session.commit()

		ssh_manager.open()

		# 원격 서버에 폴더 생성
		remote_folder_path = f'D:/log/{username}'
		ssh_manager.create_remote_folder(remote_folder_path)
		ssh_manager.save_file('web/client/public/bin.txt', f'D:/log/{username}/bin.txt')

		# SFTP 세션 닫기
		ssh_manager.close()
		
		return jsonify({
			'username': new_user.username,
			'email': new_user.email
		})
	except Exception as e:
		print(f"Error in signup: {str(e)}")

#탈퇴 - 개인 폴더 삭제
def remove_registered_user(request, session, ssh_manager):
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	user = User.query.filter_by(username=user_id).first()
	
	if not user:
		return jsonify({"error": "User not found"}), 404
	
	try:
		with db.session.begin_nested():
			# Delete user's videos from video_info table
			video_info_to_delete = videoInfo.query.filter_by(username=user.username).delete()
			
			# Delete user's video logs from video_log table
			video_logs_to_delete = videoLog.query.filter_by(username=user.username).delete()
			
			# Delete user from social_network table (both username1 and username2)
			social_network_to_delete = socialNetwork.query.filter(
				(socialNetwork.username1 == user.username) | (socialNetwork.username2 == user.username)).delete()
			
			# + additional deletion operation: remove all comments associated with the account
			# + additional deletion operation: remove all likes associated with the account
			
			# Delete user from user_account table
			db.session.delete(user)
		
		db.session.commit()
		


		# 로컬 폴더 경로
		local_folder_path = f'web/temp/{user_id}'

		delete_local_folder(local_folder_path)
		print('로컬 폴더 삭제 완료')

		# 삭제할 폴더 경로
		remote_folder_path = f'D:/log/{user_id}'
		ssh_manager.delete_folder(remote_folder_path)

		# SFTP 세션 닫기
		ssh_manager.close()

		session.clear()

		return jsonify({"message": "Account deleted successfully"}), 200
	
	except IntegrityError:
		db.session.rollback()  # Rollback in case of an error
		return jsonify({"error": "Database error"}), 500

#로그인 - 임시 개인 폴더 생성
def login_user(request, bcrypt, ssh_manager):
	username = request.json['username']
	password = request.json['password']
	
	# if not username:
	# 	return jsonify({"msg": "Missing username parameter"}), 400
	# if not password:
	# 	return jsonify({"msg": "Missing password parameter"}), 400
	
	# fetch user data by username from user_info_db : user_account table
	user = User.query.filter_by(username=username).first()
	
	if user is None:
		return jsonify({"error": "Unauthorized"}), 401
	
	if not bcrypt.check_password_hash(user.password, password):
		return jsonify({"error": "Unauthorized: Wrong password"}), 401
	
	# set client-side session cookie
	session["user_id"] = username
	print("session id:", session["user_id"])

	# 개인 폴더 복사하기
	ssh_manager.open()

	# 복사할 원격 폴더 경로
	remote_folder_path = f'D:/log/{username}'

	# 로컬 폴더 경로
	local_folder_path = f'web/temp/{username}'

	# 원격 폴더 내용을 로컬로 복사
	ssh_manager.get_remote_folder(remote_folder_path, local_folder_path)
	
	return jsonify({'username': user.username, 'email': user.email, 'createdAt': user.created_at})


#로그아웃 - 임시 개인 폴더 삭제
def logout_user(request, session, ssh_manager):
	user_id = session.get("user_id")
	if user_id:
		session.clear()

		# 로컬 폴더 경로
		local_folder_path = f'web/temp/{user_id}'

		delete_local_folder(local_folder_path)
		print('로컬 폴더 삭제 완료')
		
		return jsonify({"msg": "Successful user logout"}), 200
	else:
		return jsonify({"error": "Unauthorized"}), 401



'''server.jyb 수정 끝'''


def add_log(request, session, ssh_manager):
	try:
		upload_date = request.json['upload_date']
		session["upload_date"] = upload_date

		return_data = { 'upload_date': upload_date }
		return jsonify(return_data)

	except Exception as e:
		print(f"Error in add log: {str(e)}")

def get_local_image(img_path, image_type):
	with open(img_path, 'rb') as file:
		image_data = base64.b64encode(file.read()).decode('utf-8')
		image_data = 'data:image/' + image_type + ';base64,' + image_data
		return image_data
	
def get_local_video(video_path):
	video_path = 'web/temp/' + "/".join(video_path.split('/')[-2:])
	with open(video_path, 'rb') as file:
		video_file = 'data:video/mp4;base64,' + base64.b64encode(file.read()).decode('utf-8')
		return video_file

def get_date():
	now = datetime.now()
	remote_video_date = str(now.strftime("%Y%m%d")).replace('-','')
	local_video_date = str(now).replace('-','').replace(' ','').replace(':','').replace('.','')
	return [remote_video_date, local_video_date]


# def change_codec(video_origin_path, local_video_path):
# 	try:
# 		# FFmpeg 명령어 생성
# 		command = f'ffmpeg -i "{video_origin_path}" -c:v libx264 -c:a aac "{local_video_path}"'

# 		# FFmpeg 명령어 실행
# 		subprocess.run(command, shell=True)
# 		print("코덱 변경이 완료되었습니다.")
# 	except subprocess.CalledProcessError as e:
# 		print("오류 발생:", e)


# def mp4_to_mp3(local_video_path, local_audio_path):
# 	try:
# 		ff = FFmpeg()
# 		ff.convert(local_video_path, local_audio_path)
# 	except Exception:
# 		pass
# 		#mp.ffmpeg_tools.ffmpeg_extract_audio(local_video_path, local_audio_path)

def mp4_to_wav(local_video_path, local_audio_path):
	try:
		command = f'ffmpeg -i "{local_video_path}" -vn -acodec pcm_s16le -ar 44100 -ac 2 "{local_audio_path}"'
		subprocess.run(command, shell=True)
	except Exception:
		pass
		#mp.ffmpeg_tools.ffmpeg_extract_audio(local_video_path, local_audio_path)



def record_video(request, session, ssh_manager):
	print('동영상 저장')
	user_id = session.get("user_id")
	try:
		if 'video' in request.files:
			print('video 받음')
			# 파일 경로
			video_file = request.files['video']

			upload_date = session.get("upload_date")

			[remote_video_date, local_video_date] = get_date()
			local_file_name = user_id + local_video_date
			remote_file_name = user_id + remote_video_date

			# 임시 저장 경로 (원하는 경로와 파일명으로 변경) -> 배포 시 임시 저장 안함
			local_image_path = f'web/temp/temp/{local_file_name}.png'
			local_video_path = f'web/temp/temp/{local_file_name}.mp4'
			local_audio_path = f'web/temp/temp/{local_file_name}.wav'
			
			session['local_path'] = [local_image_path, local_video_path, local_audio_path]
			session['local_file_name'] = local_file_name

			# 최종 저장 경로 (원하는 경로와 파일명으로 변경)
			remote_image_path = f'D:/log/{user_id}/{remote_file_name}.png'
			remote_video_path = f'D:/log/{user_id}/{remote_file_name}.mp4'

			# 파일 저장
			# video_origin_path = f'web/temp/temp/origin_{local_file_name}.mp4'
			video_file.save(local_video_path)
			# change_codec(video_origin_path, local_video_path)

			# 음원 추출
			# mp4_to_mp3(local_video_path, local_audio_path)
			mp4_to_wav(local_video_path, local_audio_path)

			

			# 세션값 추가
			video_file_path = get_local_video(f'web/temp/temp/{local_file_name}.mp4')
			response_data = {'username':user_id, 'date': remote_video_date, 'video_id': remote_file_name, 'video_url': remote_video_path, 'cover_image': remote_image_path}
			session["video_info"] = response_data
			#session["local_audio_path"] = local_audio_path


			return_data = {'video_info': {'upload_date': upload_date, 'video_file_path': video_file_path }}
			# print("반환 데이터", return_data)
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
	try:
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
	
	except Exception  as e: #음성이 없는 경우
		print(f"Error during Summary: {e}")
		return ''


# 해시태그 모델
HASHTAG_DIR_PATH = 'modelling/hashtag'
hashtag_model = BartForConditionalGeneration.from_pretrained(HASHTAG_DIR_PATH)
hashtag_tokenizer = PreTrainedTokenizerFast.from_pretrained(HASHTAG_DIR_PATH)
hashtag_model = hashtag_model.to(device)

emotion_list = ['🥰', '😆', '🙂', '😐', '🙁', '😠', '😵']

def reduce_repeated_word(input_word):
    return ''.join(sorted(set(input_word), key=input_word.index))

def make_tag(text, emotion):
	# 입력 문장을 토큰화하여 인코딩
	input_ids = hashtag_tokenizer.encode(text, return_tensors="pt").to(device)
	# 모델에 입력 전달하여 디코딩
	output = hashtag_model.generate(input_ids = input_ids, bos_token_id = hashtag_model.config.bos_token_id,
							eos_token_id = hashtag_model.config.eos_token_id, length_penalty = 2.0, max_length = 50, num_beams = 2)
	# 디코딩된 출력을 토크나이저를 사용하여 텍스트로 변환
	decoded_output = hashtag_tokenizer.decode(output[0], skip_special_tokens=True)

	hashtag_list = list(decoded_output.split("#"))[:5]
	if '' in hashtag_list:
		hashtag_list.remove('')

	print('모델 후:', hashtag_list)
	
	#중복된 해시태그 제거
	hashtag_list = list(set([s.strip() for s in hashtag_list]))
	print('중복 해시태그 제거 후:', hashtag_list)

	hashtag_list = list(map(reduce_repeated_word, hashtag_list))

	if '' in hashtag_list:
		hashtag_list.remove('')

	hashtag_list.insert(0, emotion_list[emotion])
	return hashtag_list




#BGM 추가 함수
def add_bgm(video_path, result_path, emotion):
	folder_path = f"web/flask-server/bgm/{emotion}"
	files = os.listdir(folder_path)
	random_num = random.randint(0, len(files)-1)

	audio_path = f"web/flask-server/bgm/{emotion}/{files[random_num]}"
	print('오디오 파일 path',audio_path)

	# 비디오와 음악을 합치는 FFmpeg 명령어 생성
	command = f'ffmpeg -i {video_path} -i {audio_path} -filter_complex "[0:a]aformat=fltp:44100:stereo,apad[aud1];[1:a]aformat=fltp:44100:stereo[aud2];[aud1][aud2]amix=inputs=2:duration=first[out]" -c:v copy -map 0:v:0 -map "[out]" -shortest {result_path}'

	# FFmpeg 명령어 실행
	subprocess.run(command, shell=True)


def select_option(request, session, ssh_manager):
	user_id = session.get("user_id")
	#print('request', request.json)

	try:
		video_info = request.json['video_info']
		emotion = int(request.json['emotion'])
		session['emotion'] = emotion
		switches = request.json['switches']
		summary = ''
		hashtags = []

		local_path = session.get("local_path")
		local_file_name = session.get('local_file_name')

		session["emotion"] = emotion
		print("emotion값!!!!", emotion)
		# session["switches"] = switches

		if switches["bgm"]:
			print('bgm 함수 실행')
			local_video_path = local_path[1]
			local_result_path = f'web/temp/temp/{local_file_name}_bgm.mp4' #bgm 추가한 영상
			add_bgm(local_video_path, local_result_path, emotion)
			session['local_path'] = [local_path[0], local_result_path, local_path[2], local_path[1]] #세선 업데이트
			video_file_path = get_local_video(f'web/temp/temp/{local_file_name}_bgm.mp4')
			video_info['video_file_path'] = video_file_path

		# 텍스트 추출 (STT)
		local_audio_path = local_path[2]

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

		if switches["summary"] | switches["hashtag"]:
			# 요약 모델
			summary = diary_summary(text)
			print('summary: ', summary)
			
		if switches["hashtag"]:
			# 해시태그 모델
			if summary == '':
				hashtags = [emotion_list[emotion]]

			else:
				hashtags = make_tag(summary, emotion)
		else:
			hashtags = [emotion_list[emotion]]

		print('hashtag: ', hashtags)
			

		# return jsonify(return_data)
		return_data = {'video_info': video_info, 'switches': switches, 'summary': summary, 'hashtags': hashtags } # 'video_file_path': video_file_path, 
		#print('반환 데이터: ', return_data)
		return jsonify(return_data)

	except Exception as e:
		print(f"Error in record: {str(e)}")


def save_log(request, session, ssh_manager):
	user_id = session.get("user_id")
	#print('request', request.json)

	try:
		print('저장 시작')
		video_info = session.get("video_info")
		video_date = f"{video_info['date'][:4]}-{video_info['date'][4:6]}-{video_info['date'][6:]}"
		switches = request.json['switches']
		summary = request.json['summary']
		hashtags = request.json['hashtags']
		local_path = session.get('local_path')

		#이미지 캡처
		print('----------', local_path)
		cap = cv2.VideoCapture(local_path[1])
		ret, frame = cap.read()

		if ret:
			cv2.imwrite(local_path[0], frame)
			print('썸네일 저장')
		cap.release()

		ssh_manager.open()
		print('ssh_manager',ssh_manager)

		#파일을 SCP로 원격 서버에 업로드
		print('원격 서버에 업로드',local_path[0], video_info['cover_image'])
		ssh_manager.save_file(local_path[0], video_info['cover_image'])
		ssh_manager.save_file(local_path[1], video_info['video_url'])

		# # SCP 연결
		# ssh_client.connect(ssh_host, port=ssh_port, username=ssh_username, password=ssh_password)

		# print("로컬 저장 경로", local_path)
		# print("원격 저장 경로", video_info['cover_image'], video_info['video_url'])

		# # 파일을 SCP로 원격 서버에 업로드
		# with ssh_client.open_sftp() as sftp:
		# 	sftp.put(local_path[0], video_info['cover_image'])
		# 	sftp.put(local_path[1], video_info['video_url'])

		# # SSH 연결 종료
		# ssh_client.close()
		# print('SSH 연결 종료')

		print("원격 저장 경로", video_info['cover_image'], video_info['video_url'])

		local_file_path = [f"web/temp/{user_id}/{video_info['video_id']}.png", f"web/temp/{user_id}/{video_info['video_id']}.mp4"]

		shutil.move(local_path[0], local_file_path[0])
		shutil.move(local_path[1], local_file_path[1])
		
		#SQL 저장
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
			print(path, '삭제')
			if os.path.isfile(path):
				os.remove(path)
		# os.remove(f'web/temp/{file_name}.mp4')

		return jsonify({'Finish': 'SAVE'})

	except Exception as e:
		print(f"Error in save: {str(e)}")
