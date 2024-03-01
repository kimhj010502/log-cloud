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
import base64

from sqlalchemy import extract, asc, or_, desc
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


def analysisReport(request, session):
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
	print(hashtag)
	for tag in hashtag:
		hashtag_list += tag[0][1:]
	
	if len(set(hashtag_list)) >= 5:
		top5_tag = pd.Series(hashtag_list).value_counts()[:5].index.to_list()
	else:
		top5_tag = pd.Series(hashtag_list).value_counts().index.to_list()
	
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



def searchResult(request, session):
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

	if (posts.count() == 0):
		return jsonify("No records meet the conditions.")

	date_list = []
	for i in posts.with_entities(videoInfo.date).all():
		date_list.append(i[0])

	coverImg_list = []
	for i in posts.with_entities(videoInfo.cover_image).all():
		coverImg_list.append(i[0])

	if not user_id or len(coverImg_list) == 0:
		return jsonify({"error": "Image not found"}), 404
	
	image_data_list = []
	
	ssh_client.connect(ssh_host, port=ssh_port, username=ssh_username, password=ssh_password)
	with ssh_client.open_sftp() as sftp:
		for coverImg in coverImg_list:
			with sftp.file(coverImg, 'rb') as file:
				image_data = base64.b64encode(file.read()).decode('utf-8')
				image_data_list.append(image_data)

	sftp.close()
	ssh_client.close()


	data = [{ 'date': date, 'coverImg': coverImg} for date, coverImg in zip(date_list, image_data_list)]

	return jsonify(data)




def social(request, session):
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	
	friends_list = []
	friends1 = socialNetwork.query.filter(socialNetwork.username1 == user_id, socialNetwork.state == 1).with_entities(socialNetwork.username2).all()
	friends2 = socialNetwork.query.filter(socialNetwork.username2 == user_id, socialNetwork.state == 1).with_entities(socialNetwork.username1).all()

	for i in friends1:
		friends_list.append(i[0])
	for j in friends2:
		friends_list.append(j[0])

	end_date = datetime.now()
	start_date = (end_date - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)

	week_videos = videoInfo.query.filter(videoInfo.username.in_(friends_list), videoInfo.date >= start_date, videoInfo.date <= end_date, videoInfo.share == 1).order_by(desc(videoInfo.date))

	if (week_videos.count() == 0):
		return jsonify("No one has shared their memories.")
	
	date_list = []
	
	for i in week_videos.with_entities(videoInfo.date).all():
		date_list.append(i[0])

	coverImg_list = []
	for i in week_videos.with_entities(videoInfo.cover_image).all():
		coverImg_list.append(i[0])

	profileusername_list = []
	for i in week_videos.with_entities(videoInfo.username).all():
		profileusername_list.append(i[0])

	profile_list = []
	join_table = videoInfo.query.join(User, videoInfo.username == User.username).filter(videoInfo.username.in_(friends_list), videoInfo.date >= start_date, videoInfo.date <= end_date).order_by(desc(videoInfo.date))
	for i in join_table.with_entities(User.profile_img).all():
		profile_list.append(i[0])


	cover_image = []
	profile_image = []

	ssh_client.connect(ssh_host, port=ssh_port, username=ssh_username, password=ssh_password)
	with ssh_client.open_sftp() as sftp:
		for coverImg in coverImg_list:
			with sftp.file(coverImg, 'rb') as file:
				image_data = base64.b64encode(file.read()).decode('utf-8')
				cover_image.append(image_data)
		for profile in profile_list:
			with sftp.file(profile, 'rb') as file:
				image_data = base64.b64encode(file.read()).decode('utf-8')
				profile_image.append(image_data)

	sftp.close()
	ssh_client.close()
	
	data = [{ 'date': date, 'coverImg': coverImg, 'profileUsername':username, 'profileImg':profile} for date, coverImg, username, profile in zip(date_list, cover_image, profileusername_list, profile_image)]

	return jsonify(data)



def socialDetail(request, session):
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401

	date = request.json['date']
	date = datetime.strptime(date, '%a, %d %b %Y %H:%M:%S %Z')
	post_user = request.json['id']
	
	video_detail = videoInfo.query.filter(videoInfo.username == post_user, videoInfo.date == date)
	summary = video_detail.with_entities(videoInfo.summary).all()[0][0]
	hashtags = video_detail.with_entities(videoInfo.hashtag).all()[0][0]
	emotion = video_detail.with_entities(videoInfo.emotion).all()[0][0]
	video_url = video_detail.with_entities(videoInfo.video_url).all()[0][0]
	video_id = video_detail.with_entities(videoInfo.video_id).all()[0][0]
	print(video_id)
	
	ssh_client.connect(ssh_host, port=ssh_port, username=ssh_username, password=ssh_password)
	with ssh_client.open_sftp() as sftp:
		with sftp.file(video_url, 'rb') as file:
			video_file = base64.b64encode(file.read()).decode('utf-8')
	sftp.close()
	ssh_client.close()
	
	data = {"hashtags": hashtags,
			"summary": summary,
			"emotion": emotion,
			"video": video_file}
	
	return jsonify(data)