import calendar
import os

from flask import Flask, request, redirect, url_for, session, flash, jsonify, Blueprint, abort, send_file

from datetime import datetime, timedelta
import pandas as pd

import io

from sqlalchemy import extract, asc, or_, not_, and_
from sqlalchemy.exc import IntegrityError

from config import ApplicationConfig
from models import db, User, videoInfo, videoLog, socialNetwork

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


def check_authentication(request, session):
	user_id = session.get("user_id")
	if user_id:
		return jsonify({'authenticated': True})
	else:
		return jsonify({'authenticated': False})


def check_username_availability(request):
	username = request.args.get('username')
	
	if not username:
		return jsonify({'error': 'Username parameter is missing'}), 400
	
	if User.query.filter_by(username=username).first():
		return jsonify({'available': False})
	else:
		return jsonify({'available': True})


def register_user(request, bcrypt):
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


def change_user_password(request, session, bcrypt):
	user_id = session.get("user_id")
	try:
		current_password = request.json['currentPassword']
		new_password = request.json['newPassword']
		
		user = User.query.filter_by(username=user_id).first()
		
		if not user:
			return jsonify({"error": "User not found"}), 404
		
		# Check if the current password matches
		if not bcrypt.check_password_hash(user.password, current_password):
			return jsonify({"error": "Current password is incorrect"}), 401
		
		hashed_password = bcrypt.generate_password_hash(new_password)
		
		# Update user's password in the database
		user.password = hashed_password
		db.session.commit()
		
		return jsonify({"message": "Password updated successfully"}), 200
	
	except Exception as e:
		print(f"Error in changing password: {str(e)}")
		return jsonify({"message": "Unauthorized"}), 401


def remove_registered_user(request, session):
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
		session.clear()
		return jsonify({"message": "Account deleted successfully"}), 200
	
	except IntegrityError:
		db.session.rollback()  # Rollback in case of an error
		return jsonify({"error": "Database error"}), 500


def login_user(request, bcrypt):
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
	
	return jsonify({'username': user.username, 'email': user.email, 'createdAt': user.created_at})


def logout_user(request, session):
	user_id = session.get("user_id")
	if user_id:
		session.clear()
		return jsonify({"msg": "Successful user logout"}), 200
	else:
		return jsonify({"error": "Unauthorized"}), 401


def get_current_user(request, session):
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


def get_user_profile_image(request):
	try:
		username = request.json['username']
		
		if not username:
			return jsonify({"error": "Username not provided"}), 400
		
		# fetch user data by username(from session) from user_info_db : user_account table
		user = User.query.filter_by(username=username).first()
		
		if not user or not user.profile_img:
			return jsonify({"error": "Image not found"}), 404
		
		ssh_client.connect(ssh_host, port=ssh_port, username=ssh_username, password=ssh_password)
		with ssh_client.open_sftp() as sftp:
			with sftp.file(user.profile_img, 'rb') as file:
				image_data = file.read()
				return send_file(io.BytesIO(image_data), mimetype='image/png')
	
	except Exception as e:
		print(str(e))
		return jsonify({"error": "Internal server error"}), 500


def set_profile_image(request, session):
	user_id = session.get("user_id")
	
	# fetch user data by username(from session) from user_info_db : user_account table
	user = User.query.filter_by(username=user_id).first()
	print(request.files['image'])
	
	if (user and ('image' in request.files)):
		try:
			image_file = request.files['image']
			# Save image locally (temporarily)
			local_image_path = 'temp/image.jpg'
			image_file.save(local_image_path)
			
			remote_image_path = 'D:/log/user/' + user_id + '.jpg'
			
			ssh_client.connect(ssh_host, port=ssh_port, username=ssh_username, password=ssh_password)
			
			with ssh_client.open_sftp() as sftp:
				sftp.put(local_image_path, remote_image_path)
			
			os.remove(local_image_path)
			
			ssh_client.close()
			
			user.profile_img = remote_image_path
			db.session.commit()
			
			return 'Successfully added profile image!', 200
		
		except Exception as e:
			print(f"Error in record: {str(e)}")
			return 'Error setting profile image', 500
	else:
		return 'Unauthorized', 401


def get_log_overview_of_month(request):
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


def get_friend_list(request, session):
	username = session.get("user_id")
	
	friend_list = []
	pending_received_request_list = []
	pending_sent_request_list = []
	
	# pending requests: status 0 means request sent from username1 to username2
	#				    status 1 means friends
	friends = socialNetwork.query.filter(socialNetwork.username1 == username, socialNetwork.state == 1).all()
	for entry in friends:
		friend_list.append(entry.username2)
	
	friends = socialNetwork.query.filter(socialNetwork.username2 == username, socialNetwork.state == 1).all()
	for entry in friends:
		friend_list.append(entry.username1)
	
	pending = socialNetwork.query.filter(socialNetwork.username2 == username, socialNetwork.state == 0).all()
	for entry in pending:
		pending_received_request_list.append(entry.username1)
	
	pending = socialNetwork.query.filter(socialNetwork.username1 == username, socialNetwork.state == 0).all()
	for entry in pending:
		pending_sent_request_list.append(entry.username2)
	
	print("friend list:", friend_list)
	print("pending_received request_list:", pending_received_request_list)
	print("pending_sent request_list:", pending_sent_request_list)
	
	if friend_list or pending_received_request_list or pending_sent_request_list:
		return jsonify({"friends": friend_list,
						"pending_received_requests": pending_received_request_list,
						"pending_sent_requests": pending_sent_request_list}), 200
	else:
		return jsonify("Nothing to send"), 404


def search_user(request, session):
	username = session.get("user_id")
	search_string = request.json['searchString']
	
	friend_list = []
	friends = socialNetwork.query.filter(socialNetwork.username1 == username, socialNetwork.state == 1).all()
	for entry in friends:
		friend_list.append(entry.username2)
	
	friends = socialNetwork.query.filter(socialNetwork.username2 == username, socialNetwork.state == 1).all()
	for entry in friends:
		friend_list.append(entry.username1)
	
	# search for users with username containing search_string
	users = User.query.filter(and_(
		User.username.like(f"%{search_string}%"),
		not_(User.username.in_(friend_list)),
		User.username != username)).all()
	
	if not users:
		return jsonify({"users": []}), 204
	
	user_list = [user.username for user in users]
	
	return jsonify({"users": user_list}), 200


def send_friend_request(request, session):
	username = session.get("user_id")
	friend_username = request.json['friend_username']
	
	if username == friend_username:
		return jsonify({"error": "cannot send request to self"}), 404
	
	user = User.query.filter_by(username=username).first()
	if not user:
		return jsonify({"error": "unauthorized"}), 404
	
	# check if username exists in database
	friend = User.query.filter_by(username=friend_username).first()
	if not friend:
		return jsonify({"error": "friend_username not found"}), 404
	
	# check if friend already sent a request to me
	already_friends = 1 if (socialNetwork.query.filter(
		(socialNetwork.username1 == username) & (socialNetwork.username2 == friend_username) & (
				socialNetwork.state == 1)).all()
							or socialNetwork.query.filter(
				(socialNetwork.username1 == friend_username) & (socialNetwork.username2 == username) & (
						socialNetwork.state == 1)).all()) else None
	
	existing_request = 1 if (socialNetwork.query.filter(
		(socialNetwork.username1 == username) & (socialNetwork.username2 == friend_username) & (
				socialNetwork.state == 0)).all()) else None
	
	request_sent_by_friend = 1 if (socialNetwork.query.filter(
		(socialNetwork.username1 == friend_username) & (socialNetwork.username2 == username) & (
				socialNetwork.state == 0)).all()) else None
	
	if already_friends:
		return jsonify({"error": "Already friends"}), 403
	if existing_request:
		return jsonify({"error": "Request exists"}), 403
	if request_sent_by_friend:
		return jsonify({"error": "Pending request from friend"}), 403
	
	new_friend_request = socialNetwork(username1=username, username2=friend_username, state=0)
	db.session.add(new_friend_request)
	db.session.commit()
	
	return jsonify({"message": "Successfully sent friend request"}), 201


def unsend_friend_request(request, session):
	username = session.get("user_id")
	friend_username = request.json['friend_username']
	
	friend_request = socialNetwork.query.filter(
		(socialNetwork.username1 == username) & (socialNetwork.username2 == friend_username) & (
				socialNetwork.state == 0)).first()
	
	if not friend_request:
		return jsonify({"Friend request not found"}), 402
	
	socialNetwork.query.filter((socialNetwork.username1 == username) & (socialNetwork.username2 == friend_username) & (
			socialNetwork.state == 0)).delete()
	db.session.commit()
	
	return jsonify({"message": "Successfully unsent friend request"}), 200


def reject_friend_request(request, session):
	username = session.get("user_id")
	friend_username = request.json['friend_username']
	
	friend_request = socialNetwork.query.filter(
		(socialNetwork.username1 == friend_username) & (socialNetwork.username2 == username) & (
				socialNetwork.state == 0)).all()
	
	if not friend_request:
		return jsonify({"error": "Error finding request"}), 400
	
	socialNetwork.query.filter((socialNetwork.username1 == friend_username) & (socialNetwork.username2 == username) & (
			socialNetwork.state == 0)).delete()
	db.session.commit()
	
	return jsonify({"message": "Successfully rejected friend request"}), 200


def accept_friend_request(request, session):
	username = session.get("user_id")
	friend_username = request.json['friend_username']
	
	friend_request = socialNetwork.query.filter(
		(socialNetwork.username1 == friend_username) & (socialNetwork.username2 == username) & (
				socialNetwork.state == 0)).first()
	
	if not friend_request:
		return jsonify({"error": "Error finding request"}), 400
	
	friend_request.state = 1
	db.session.commit()
	
	return jsonify({"message": "Successfully accepted friend request"}), 200


def remove_friend(request, session):
	username = session.get("user_id")
	friend_username = request.json['friend_username']
	print(username, friend_username)
	
	friend = socialNetwork.query.filter(
		(((socialNetwork.username1 == friend_username) & (socialNetwork.username2 == username))
		 | ((socialNetwork.username1 == username) & (socialNetwork.username2 == friend_username)))
		& (socialNetwork.state == 1)).all()
	print(friend)
	
	if not friend:
		return jsonify({"error": "Error finding request"}), 400
	
	# delete friend from socialNetwork db
	# in case multiple records exist: use .all() and iterate over the list
	for f in friend:
		db.session.delete(f)
	db.session.commit()
	
	return jsonify({"message": "Successfully removed friend"}), 200

