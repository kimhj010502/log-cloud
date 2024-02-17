import calendar
import os
from uuid import uuid4

from flask import Flask, request, redirect, url_for, session, flash, jsonify, Blueprint, abort
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
import pymysql
from datetime import datetime

from sqlalchemy import extract, asc
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


@app.route('/check_authentication', methods=['GET'])
def check_authentication():
	user_id = session.get("user_id")
	if user_id:
		return jsonify({'authenticated': True})
	else:
		return jsonify({'authenticated': False})
	

@app.route('/check_username_availability', methods=['GET'])
def check_username_availability():
	username = request.args.get('username')
	
	if not username:
		return jsonify({'error': 'Username parameter is missing'}), 400
	
	if User.query.filter_by(username=username).first():
		return jsonify({'available': False})
	else:
		return jsonify({'available': True})


@app.route('/signup', methods=['POST'])
def register_user():
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
		
		return jsonify({
			'username': new_user.username,
			'email': new_user.email
		})
	except Exception as e:
		print(f"Error in signup: {str(e)}")


@app.route('/change_password', methods=['POST'])
def change_user_password():
	user_id = session.get("user_id")
	try:
		old_password = request.json['oldPassword']
		new_password = request.json['newPassword']
		
		user = User.query.filter_by(username=user_id).first()
		
		if not user:
			return jsonify({"error": "User not found"}), 404
		
		# Check if the old password matches the current password
		if not bcrypt.check_password_hash(user.password, old_password):
			return jsonify({"error": "Old password is incorrect"}), 401
		
		hashed_password = bcrypt.generate_password_hash(new_password)
		
		# Update user's password in the database
		user.password = hashed_password
		db.session.commit()
		
		return jsonify({"message": "Password updated successfully"}), 200
	
	except Exception as e:
		print(f"Error in changing password: {str(e)}")
		return jsonify({"message": "Unauthorized"}), 401

@app.route('/delete_account', methods=['POST'])
def remove_registered_user():
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
			social_network_to_delete = socialNetwork.query.filter((socialNetwork.username1 == user.username) | (socialNetwork.username2 == user.username)).delete()
		
			# + additional deletion operation: remove all comments associated with the account
			# + additional deletion operation: remove all likes associated with the account
			
			# Delete user from user_account table
			db.session.delete(user)
			
		db.session.commit()
		session.clear()
		return jsonify({"message": "Account deleted successfully"}), 200
			
	except IntegrityError:
		db.session.rollback()  # Rollback in case of an error
		return jsonify({"error": "Database error"}), 500


@app.route('/login', methods=['POST'])
def login_user():
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
	
	return jsonify({'username': user.username, 'email': user.email})


@app.route('/logout', methods=['GET'])
def logout_user():
	user_id = session.get("user_id")
	if user_id:
		session.clear()
		return jsonify({"msg": "Successful user logout"}), 200
	else:
		return jsonify({"error": "Unauthorized"}), 401
	

@app.route("/@me")
def get_current_user():
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	# fetch user data by username(from session) from user_info_db : user_account table
	user = User.query.filter_by(username=user_id).first()
	
	return jsonify({
		"username": user.username,
		"email": user.email,
		"createdAt": user.created_at
	})

@app.route("/month-overview", methods=['POST'])
def get_log_overview_of_month():
	username = request.json['username']
	month = request.json['month']
	year = request.json['year']
	
	start_date = datetime(year, month + 1, 1)
	end_date = datetime(year, month + 1, calendar.monthrange(year, month + 1)[1]) if month < 12 else datetime(year + 1, 1, calendar.monthrange(year, month + 1)[1])
	
	# print(start_date, end_date)
	
	videos = videoInfo.query.filter(
		videoInfo.username == username,
		videoInfo.date >= start_date,
		videoInfo.date < end_date
	).order_by(asc(videoInfo.date)).all()
	
	# print(videos)
	if videos:
		video_info_list = []
		for video in videos:
			day_of_month = video.date.day
			# print(video.date.day)
	
			video_info_list.append({
				'date': day_of_month,
				'coverImage': video.cover_image,
				'videoId': video.video_id,
			})
		# print(video_info_list)
		return jsonify(video_info_list)
	else:
		return jsonify({"error": "No videos found for the specified username"}), 404



@app.route("/logdetail", methods=['POST'])
def logDetail():
	video_id = request.json['videoId']
	
	video_detail = videoInfo.query.filter(videoInfo.video_id == video_id).first()

	# error handling needed in case summary/emotion/hashtag doesn't exist
	if video_detail:
		print("Video URL:", video_detail.video_url)
		print("Summary:", video_detail.summary)
		print("Emotion:", video_detail.emotion)
		print("Hashtag:", video_detail.hashtag.split(', '))
		print("Date:", video_detail.date)
	else:
		print("Video detail not found.")
	
	return {"date": datetime.strptime(str(video_detail.date), '%Y-%m-%d %H:%M:%S').strftime('%A, %B %d, %Y'),
			"coverImg": video_detail.cover_image,
			"hashtags": video_detail.hashtag.split(', '),
			"summary": video_detail.summary,
			"privacy": video_detail.share,
			"emotion": video_detail.emotion}


@app.route("/generateDetails")
def generateDetails():
	return {"date": "Friday, December 9, 2023",
			"coverImg": "/route/to/image",
			"hashtags": ["😍", "이탈리아이탈리아이탈리아이탈리아", "여행", "해변", "수영"],
			"summary": "이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 가족 여행으로 시칠리아에 왔어요. 여름의 이탈리아는 매우 더워요. 해변에서 하루종일 수영했어요.",
			"privacy": "전체 공개",
			"location": "Sicily, Italy",
			"emotion": "happy"}


@app.route("/socialdetail")
def socialDetail():
	return {"date": "December 9, 2023",
			"coverImg": "/route/to/image",
			"profileImg": "/route/to/profile_image",
			"profileUsername": "username"}


@app.route("/analysisReport")
def analysisReport():
	return {"year": 2023,
			"month": 12,
			"logCount": 20,
			"hashtags": ["여행", "네덜란드", "벨기에", "해변", "고양이"],
			"emotion": {"happy": 6,
						"love": 5,
						"gratitude": 2,
						"sad": 3,
						"worry": 4,
						"angry": 0}}


if __name__ == "__main__":
	app.run(debug=True)