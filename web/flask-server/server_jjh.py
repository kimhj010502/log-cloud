import calendar
import os
from uuid import uuid4
import io

from flask import Flask, request, redirect, url_for, session, flash, jsonify, Blueprint, abort, send_file
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
from datetime import datetime, timedelta
import pandas as pd

from sqlalchemy import extract, asc, or_
from sqlalchemy.exc import IntegrityError

from config import ApplicationConfig
from models import db, User, videoInfo, videoLog, socialNetwork

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

with app.app_context():
	db.create_all()


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


def analysisReport():
	user_id = session.get('user_id')
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	user = User.query.filter_by(username=user_id).first()
	
	if not user:
		return jsonify({"error": "User not found"}), 404
	year = request.json['currentYear']
	month = request.json['currentMonth']

	start_date = datetime(year, month+1, 1)
	end_date = (datetime(year, month+2, 1) if (month != 11) else datetime(year, 1, 1))

	num = videoInfo.query.filter(videoInfo.username == user_id, videoInfo.date >= start_date, videoInfo.date < end_date).count()
	hashtag = videoLog.query.filter(videoInfo.username == user_id, videoInfo.date >= start_date, videoInfo.date < end_date).with_entities(videoInfo.hashtag).all()
	emotion = videoLog.query.filter(videoInfo.username == user_id, videoInfo.date >= start_date, videoInfo.date < end_date).with_entities(videoInfo.emotion).all()

	# Top5 Hashtag
	hashtag_list = []
	for tag in hashtag:
		tag_pre = tag[0].replace(' ','').split("#")
		hashtag_list += [x for x in tag_pre if x]

	top5_tag = pd.Series(hashtag_list).value_counts()[:5].index.to_list()
	
	# count emotions
	emotion_list = []
	for i in emotion:
		emotion_list.append(i[0])

	count_emotion = pd.Series(emotion_list).value_counts()
	
	def get_emotion_counts(x):
		try:
			return count_emotion[x]
		except:
			return 0
	
	loved = int(get_emotion_counts(0))
	excited = int(get_emotion_counts(1))
	good = int(get_emotion_counts(2))
	neutral = int(get_emotion_counts(3))
	unhappy = int(get_emotion_counts(4))
	angry = int(get_emotion_counts(5))
	tired = int(get_emotion_counts(6))
	
	data = {"num": num,
		"hashtags": top5_tag,
		"loved": loved,
		"excited": excited,
		"good": good,
		"neutral": neutral,
		"unhappy": unhappy,
		"angry": angry,
		"tired": tired}
	
	return jsonify(data)



def searchResult():
	user_id = session.get("user_id")
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	data = request.json['selectedValue']
	
	selectedWhat = data['selectedWhat']
	selectedScope = data['selectedScope']
	dateRange = data['dateRange']
	keyword = data['keyword']

	start_date = datetime.strptime(dateRange[0], '%Y-%m-%dT%H:%M:%S.%fZ') + timedelta(hours=9)
	end_date = datetime.strptime(dateRange[1], '%Y-%m-%dT%H:%M:%S.%fZ') + timedelta(hours=9) + timedelta(days = 1)

	all_posts = videoInfo.query.filter(videoInfo.username == user_id, videoInfo.date >= start_date, videoInfo.date < end_date)

	# 키워드를 포함하는 글들 추출
	if type(keyword) == type(None): # 키워드를 입력하지 않았을 경우
		key_posts = all_posts
	elif selectedWhat == 'log전문':
		key_posts = all_posts.filter(videoInfo.original_text.contains(keyword))
	elif selectedWhat == '요약본':
		key_posts = all_posts.filter(videoInfo.summary.contains(keyword))
	elif selectedWhat == '해시태그':
		key_posts = all_posts.filter(videoInfo.hashtag.contains(keyword))
	elif selectedWhat == '전체':
		key_posts = all_posts.filter(or_(videoInfo.hashtag.contains(keyword), videoInfo.summary.contains(keyword), videoInfo.original_text.contains(keyword)))

	# 공유 범위에 따른 글 추출
	posts = key_posts
	if selectedScope == '개인기록':
		posts = key_posts.filter(videoInfo.share == 0)
	elif selectedScope == '친구공유':
		posts = key_posts.filter(videoInfo.share == 1)

	date_list = []
	for i in posts.with_entities(videoInfo.date).all():
		date_list.append(i[0])

	coverImg_list = []
	for i in posts.with_entities(videoInfo.cover_image).all():
		coverImg_list.append(i[0])

	image_data_list = []
	ssh_client.connect(ssh_host, port=ssh_port, username=ssh_username, password=ssh_password)
	with ssh_client.open_sftp() as sftp:
		for coverImg in coverImg_list:
			with sftp.file(coverImg, 'rb') as file:
				image_data = file.read()
				image_data_list.append(image_data)

	sftp.close()
	ssh_client.close()

	data = [{ 'date': date, 'coverImg': send_file(io.BytesIO(coverImg), mimetype='image/png') } for date, coverImg in zip(date_list, image_data_list)]
	return data
