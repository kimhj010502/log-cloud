import os

from flask import jsonify

from sqlalchemy import not_, and_
from models import db, User, socialNetwork

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


def get_user_profile_image(request, ssh_manager):
	try:
		username = request.json['username']
		print(username)
		
		if not username:
			return jsonify({"error": "Username not provided"}), 400
		
		# fetch user data by username(from session) from user_info_db : user_account table
		user = User.query.filter_by(username=username).first()
		
		if not user or not user.profile_img:
			return jsonify({"error": "Image not found"}), 404
		
		ssh_manager.open()
		img, status_code = ssh_manager.get_profile_image(user.profile_img)
		if img:
			return img, status_code
		else:
			return "error in server", 500
	
	except Exception as e:
		print(str(e))
		return jsonify({"error": "Internal server error"}), 500


def set_profile_image(request, session, ssh_manager):
	user_id = session.get("user_id")
	
	# fetch user data by username(from session) from user_info_db : user_account table
	user = User.query.filter_by(username=user_id).first()
	print(request.files['image'])
	
	if (user and ('image' in request.files)):
		try:
			image_file = request.files['image']
			# Save image locally (temporarily)
			local_image_path = f'web/temp/temp/{user_id}.jpg'
			remote_image_path = f'D:/log/user/{user_id}.jpg'
		
			image_file.save(local_image_path)
			
			ssh_manager.open()
			ssh_manager.save_file(local_image_path, remote_image_path)
			
			os.remove(local_image_path)
			
			user.profile_img = remote_image_path
			db.session.commit()
			
			return 'Successfully added profile image!', 200
		
		except Exception as e:
			print(f"Error in record: {str(e)}")
			return 'Error setting profile image', 500
	else:
		return 'Unauthorized', 401


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
	
	# if friend_list or pending_received_request_list or pending_sent_request_list:
	return jsonify({"friends": friend_list,
					"pending_received_requests": pending_received_request_list,
					"pending_sent_requests": pending_sent_request_list}), 200


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
