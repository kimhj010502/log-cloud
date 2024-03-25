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
from models import db, User, videoInfo, videoLog, socialNetwork, likeLog, commentLog

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


# API
def get_list(db_data):
	list_tmp = []
	for i in db_data:
		list_tmp.append(i[0])
	return list_tmp


def get_local_images(image_list, image_type):
   images = []

   for img in image_list:
      img = 'web/temp/' + "/".join(img.split('/')[-2:])
      with open(img, 'rb') as file:
         image_data = base64.b64encode(file.read()).decode('utf-8')
         image_data = 'data:image/' + image_type + ';base64,' + image_data
         images.append(image_data)
         
   return images


def get_video(video_url):
	ssh_client.connect(ssh_host, port=ssh_port, username=ssh_username, password=ssh_password)
	with ssh_client.open_sftp() as sftp:
		with sftp.file(video_url, 'rb') as file:
			video_file = 'data:video/mp4;base64,' + base64.b64encode(file.read()).decode('utf-8')
	sftp.close()
	ssh_client.close()
	return video_file


def get_local_video(video_path):
   video_path = 'web/temp/' + "/".join(video_path.split('/')[-2:])
   with open(video_path, 'rb') as file:
      video_file = 'data:video/mp4;base64,' + base64.b64encode(file.read()).decode('utf-8')
      return video_file


def get_likes(videoId):
	print('get_likes 실행', videoId)
	like_ids = likeLog.query.filter(likeLog.video_id == videoId).with_entities(likeLog.username).all()
	print('like-ids', like_ids)
	likes_list = []
	for i in like_ids:
		likes_list.append(i[0])
	
	return likes_list


def get_comments(videoId):
	comment_ids = commentLog.query.filter(commentLog.video_id == videoId).order_by(commentLog.date).with_entities(
		commentLog.username).all()
	comments = commentLog.query.filter(commentLog.video_id == videoId).order_by(commentLog.date).with_entities(
		commentLog.comment).all()
	
	commentId_list = get_list(comment_ids)
	comments_list = get_list(comments)
	
	data = [{'id': id, 'comments': comment} for id, comment in zip(commentId_list, comments_list)]
	
	return data


def did_u_like(username, likeList):
	if username in likeList:
		return True
	else:
		return False


# PAGE FUNCTION
def analysisReport(request, session, ssh_manager):
	user_id = session.get('user_id')
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	user = User.query.filter_by(username=user_id).first()
	
	if not user:
		return jsonify({"error": "User not found"}), 404
	year = request.json['currentYear']
	month = request.json['currentMonth']
	
	start_date = datetime(year, month + 1, 1)
	end_date = (datetime(year, month + 2, 1) if (month != 11) else datetime(year, 1, 1))
	
	num = videoInfo.query.filter(videoInfo.username == user_id, videoInfo.date >= start_date,
								 videoInfo.date < end_date).count()
	hashtag = videoLog.query.filter(videoInfo.username == user_id, videoInfo.date >= start_date,
									videoInfo.date < end_date).with_entities(videoInfo.hashtag).all()
	emotion = videoLog.query.filter(videoInfo.username == user_id, videoInfo.date >= start_date,
									videoInfo.date < end_date).with_entities(videoInfo.emotion).all()
	
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
	emotion_list = get_list(emotion)
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


def searchResult(request, session, ssh_manager):
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	data = request.json['selectedValue']
	
	selectedWhat = data['selectedWhat']
	selectedScope = data['selectedScope']
	dateRange = data['dateRange']
	keyword = data['keyword']
	
	start_date = datetime.strptime(dateRange[0], '%Y-%m-%dT%H:%M:%S.%fZ') + timedelta(hours=9)
	end_date = datetime.strptime(dateRange[1], '%Y-%m-%dT%H:%M:%S.%fZ') + timedelta(hours=9) + timedelta(days=1)
	
	all_posts = videoInfo.query.filter(videoInfo.username == user_id, videoInfo.date >= start_date,
									   videoInfo.date < end_date)
	
	# 키워드를 포함하는 글들 추출
	if type(keyword) == type(None):  # 키워드를 입력하지 않았을 경우
		key_posts = all_posts
	elif selectedWhat == 'log전문':
		key_posts = all_posts.filter(videoInfo.original_text.contains(keyword))
	elif selectedWhat == '요약본':
		key_posts = all_posts.filter(videoInfo.summary.contains(keyword))
	elif selectedWhat == '해시태그':
		key_posts = all_posts.filter(videoInfo.hashtag.contains(keyword))
	elif selectedWhat == '전체':
		key_posts = all_posts.filter(or_(videoInfo.hashtag.contains(keyword), videoInfo.summary.contains(keyword),
										 videoInfo.original_text.contains(keyword)))
	
	# 공유 범위에 따른 글 추출
	posts = key_posts
	if selectedScope == '개인기록':
		posts = key_posts.filter(videoInfo.share == 0)
	elif selectedScope == '친구공유':
		posts = key_posts.filter(videoInfo.share == 1)
	
	if (posts.count() == 0):
		return jsonify("No records meet the conditions.")
	
	date_list = get_list(posts.with_entities(videoInfo.date).all())
	coverImg_list = get_list(posts.with_entities(videoInfo.cover_image).all())
	
	if not user_id or len(coverImg_list) == 0:
		return jsonify({"error": "Image not found"}), 404
	
	image_data_list = get_local_images(coverImg_list, 'png')
	
	data = [{'date': date, 'coverImg': coverImg} for date, coverImg in zip(date_list, image_data_list)]
	
	return jsonify(data)


def social(request, session, ssh_manager):
	print(ssh_manager)
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	friends1 = socialNetwork.query.filter(socialNetwork.username1 == user_id, socialNetwork.state == 1).with_entities(
		socialNetwork.username2).all()
	friends2 = socialNetwork.query.filter(socialNetwork.username2 == user_id, socialNetwork.state == 1).with_entities(
		socialNetwork.username1).all()
	friends_list = get_list(friends1) + get_list(friends2)
	
	end_date = datetime.now()
	start_date = (end_date - timedelta(days=7)).replace(hour=0, minute=0, second=0, microsecond=0)
	
	week_videos = videoInfo.query.filter(videoInfo.username.in_(friends_list), videoInfo.date >= start_date,
										 videoInfo.date <= end_date, videoInfo.share == 1).order_by(
		desc(videoInfo.date))
	
	if (week_videos.count() == 0):
		return jsonify("No one has shared their memories.")
	
	date_list = get_list(week_videos.with_entities(videoInfo.date).all())
	coverImg_list = get_list(week_videos.with_entities(videoInfo.cover_image).all())
	profileusername_list = get_list(week_videos.with_entities(videoInfo.username).all())
	
	join_table = videoInfo.query.join(User, videoInfo.username == User.username).filter(
		videoInfo.username.in_(friends_list), videoInfo.date >= start_date, videoInfo.date <= end_date).order_by(
		desc(videoInfo.date))
	
	ssh_manager.open()
	cover_image = ssh_manager.get_images(coverImg_list, 'png')
	
	data = [{'date': date, 'coverImg': coverImg, 'profileUsername': username} for
			date, coverImg, username in zip(date_list, cover_image, profileusername_list)]
	
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
	
	video_file = get_video(video_url)
	
	data = {"hashtags": hashtags,
			"summary": summary,
			"emotion": emotion,
			"video": video_file,
			"videoId": video_id}
	
	return jsonify(data)


def comments(request, session):
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	video_id = request.json.get('videoId')
	commentsList = get_comments(video_id)

	return commentsList


def sendComments(request, session):
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	video_id = request.json.get('videoId')
	newComment = request.json.get('newComment')
	
	# Insert comment into the database
	new_comment = commentLog(video_id=video_id, username=user_id, comment=newComment)
	db.session.add(new_comment)
	db.session.commit()

	return ""


def hearts(request, session):
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	date = request.json['date']
	date = datetime.strptime(date, '%a, %d %b %Y %H:%M:%S %Z')
	post_user = request.json['id']

	video_detail = videoInfo.query.filter(videoInfo.username == post_user, videoInfo.date == date)
	video_id = video_detail.with_entities(videoInfo.video_id).all()[0][0]
	print("Heart------------")
	print(video_id)

	likeList = get_likes(video_id)
	print("---------------------------")
	is_like = did_u_like(user_id, likeList)
	

	data = {"likeList": likeList,
			"isLike": is_like}
	
	print(data)

	return data



def sendHearts(request, session):
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	video_id = request.json.get('videoId')
	like = request.json.get('liked')
	
	# Insert comment into the database
	if like:
		new_like = likeLog(video_id=video_id, username=user_id)
		db.session.add(new_like)
	else:
		delete_like = likeLog.query.filter_by(video_id=video_id, username=user_id).one()
		db.session.delete(delete_like)
	db.session.commit()
	
	return ""

def get_local_video(video_path):
   video_path = 'web/temp/' + "/".join(video_path.split('/')[-2:])
   print('video_path', video_path)
   with open(video_path, 'rb') as file:
      video_file = 'data:video/mp4;base64,' + base64.b64encode(file.read()).decode('utf-8')
      return video_file

def log_detail(request, session, ssh_manager):
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	video_id = request.json['videoId']
	
	video_detail = videoInfo.query.filter(videoInfo.video_id == video_id).first()
	video_file = get_local_video(video_detail.video_url)
	
	return {"date": datetime.strptime(str(video_detail.date), '%Y-%m-%d %H:%M:%S').strftime('%A, %B %d, %Y'),
			"video": video_file,
			"hashtags": video_detail.hashtag,
			"summary": video_detail.summary,
			"privacy": video_detail.share,
			"emotion": video_detail.emotion,
			"videoId": video_id}



def get_log_overview_of_month(request, ssh_manager):
	username = request.json['username']
	month = request.json['month']
	year = request.json['year']
	
	start_date = datetime(year, month + 1, 1)
	end_date = datetime(year, month + 1, calendar.monthrange(year, month + 1)[1]) if month < 12 else datetime(year + 1,
																											  1,
																											  calendar.monthrange(
																												  year,
																												  month + 1)[
																												  1])
	videos = videoInfo.query.filter(videoInfo.username == username, 
								 videoInfo.date >= start_date, 
								 videoInfo.date < end_date
	).order_by(asc(videoInfo.date)).all()
	
	if videos:
		date_list = []
		coverImg_list = []
		videoId_list = []
		for video in videos:
			date_list.append(video.date.day)
			coverImg_list.append(video.cover_image)
			videoId_list.append(video.video_id)

		coverImage = get_local_images(coverImg_list, 'png')

		video_info_list = [{ 'date': date, 'coverImage': img, 'videoId': videoId } for date, img, videoId in zip(date_list, coverImage, videoId_list)]

		# print(video_info_list)
		return jsonify(video_info_list)
	else:
		return jsonify({"error": "No videos found for the specified username"}), 404



	
