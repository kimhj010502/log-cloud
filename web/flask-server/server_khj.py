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
import cv2
from moviepy.editor import VideoFileClip

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
		print(upload_date)

		return_data = { 'upload_date': upload_date }
		return jsonify(return_data)

	except Exception as e:
		print(f"Error in add log: {str(e)}")


def get_date():
	now = datetime.now()
	remote_video_date = str(now.strftime("%Y%m%d")).replace('-','')
	local_video_date = str(now).replace('-','').replace(' ','').replace(':','').replace('.','')
	return [remote_video_date, local_video_date]


def record_video(request, session):
	print('동영상 저장')
	user_id = session.get("user_id")
	print(user_id)

	try:
		if 'video' in request.files:
			# 파일 경로
			video_file = request.files['video']

			upload_date = session.get("upload_date")

			[remote_video_date, local_video_date] = get_date()
			local_file_name = user_id + local_video_date
			remote_file_name = user_id + remote_video_date
			print(f'upload_date: {upload_date}, remote_video_date: {remote_video_date}, local_video_date: {local_video_date}')

			# 임시 저장 경로 (원하는 경로와 파일명으로 변경)
			local_image_path = f'web/client/public/temp/{local_file_name}.png'
			local_video_path = f'web/client/public/temp/{local_file_name}.mp4'
			local_audio_path = f'web/client/public/temp/{local_file_name}.mp3'

			# 최종 저장 경로 (원하는 경로와 파일명으로 변경)
			remote_image_path = f'D:/log/video/{remote_file_name}.png'
			remote_video_path = f'D:/log/video/{remote_file_name}.mp4'

			# 파일 저장
			video_file.save(local_video_path)

			# 음원 추출
			clip = VideoFileClip(local_video_path)
			clip.audio.write_audiofile(local_audio_path)

			# video = VideoFileClip(local_video_path)
			# codec = video.fps
			# print(f"Codec: {codec}")

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
			response_data = {'upload_date': upload_date, 'video_file_path': video_file_path}
			session["video_info"] = response_data

			# #임시 파일 삭제
			# os.remove(f'web/temp/{file_name}.png')
			# os.remove(f'web/temp/{file_name}.mp4')

			return_data = {'video_info': {'upload_date': upload_date, 'video_file_path': video_file_path}}
			return jsonify(return_data)
		
		else:
			print('비디오 파일 없음')
			return 'No video file provided', 400

	except Exception as e:
		print(f"Error in record: {str(e)}")


def select_option(request, session):
	user_id = session.get("user_id")
	print('request', request.json)

	emotion_list = ['🥰', '😆', '🙂', '😐', '🙁', '😠', '😵']

	try:
		emotion = request.json['emotion']
		switches = request.json['switches']

		session["emotion"] = emotion
		session["switches"] = switches

		return_data = {'video_info': session["video_info"], 'is_public': switches["public"]}

		# if switches["bgm"]:
		# 	#함수 실행
		# if switches["summary"]:
		# 	#요약
		# if switches["hashtag"]:
		# 	#

		# return jsonify(return_data)
		
		return

	except Exception as e:
		print(f"Error in record: {str(e)}")