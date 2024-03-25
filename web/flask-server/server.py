import calendar
import os
from uuid import uuid4
import stat

from flask import Flask, request, redirect, url_for, session, flash, jsonify, Blueprint, abort, send_file
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_session import Session
import pymysql

import io
import base64

from sqlalchemy import extract, asc, or_, desc
from sqlalchemy.exc import IntegrityError

from config import ApplicationConfig
from models import db, User, videoInfo, videoLog, socialNetwork

from datetime import datetime, timedelta
# import pandas as pd

import paramiko
from config import SSH_HOST, SSH_PORT, SSH_USERNAME, SSH_PASSWORD 

app = Flask(__name__)
app.config.from_object(ApplicationConfig)

CORS(app, supports_credentials=True)
bcrypt = Bcrypt(app)
server_session = Session(app)
db.init_app(app)

with app.app_context():
    db.create_all()


# SCP 연결 설정
ssh_client = paramiko.SSHClient()
ssh_client.load_system_host_keys()
ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

# SSH 서버 정보
ssh_host = SSH_HOST
ssh_port = SSH_PORT
ssh_username = SSH_USERNAME
ssh_password = SSH_PASSWORD




class SSHManager:
   def __init__(self):
      self.host = SSH_HOST
      self.port = SSH_PORT
      self.username = SSH_USERNAME
      self.password = SSH_PASSWORD
      self.ssh_client = paramiko.SSHClient()
      self.ssh_client.load_system_host_keys()
      self.ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
      self.sftp = None
      
   def open(self):
      self.ssh_client.connect(self.host, port=self.port, username=self.username, password=self.password)
      self.sftp = self.ssh_client.open_sftp()
      
   def close(self):
      if self.sftp:
         self.sftp.close()
      self.ssh_client.close()
      
   def create_remote_folder(self, folder_path):
      if self.sftp:
         self.sftp.mkdir(folder_path)

   def remove_folder_contents(self, folder_path):
      if self.sftp:
         # 원격 폴더 내의 파일 및 폴더 목록 가져오기
         remote_items = self.sftp.listdir(folder_path)

         # 각 항목을 반복하면서 삭제 또는 재귀적으로 다시 호출
         for item in remote_items:
            remote_item_path = os.path.join(folder_path, item)
            
                # 원격 항목의 속성 가져오기
            remote_item_attr = self.sftp.stat(remote_item_path)
            
            if stat.S_ISDIR(remote_item_attr.st_mode):
               self.remove_folder_contents(remote_item_path)
            else:
               self.sftp.remove(remote_item_path)


   def delete_folder(self, folder_path):
      if self.sftp:
         self.remove_folder_contents(folder_path)
         self.sftp.rmdir(folder_path)
         
   def get_remote_folder(self, remote_folder_path, local_folder_path):
      if self.sftp:
            # self.sftp.get(remotepath=remote_folder_path, localpath=local_folder_path)
         # 원격 폴더 내의 파일 및 폴더 목록 가져오기
         remote_items = self.sftp.listdir(remote_folder_path)

         # 로컬 폴더가 없으면 생성
         if not os.path.exists(local_folder_path):
            os.makedirs(local_folder_path)

         # 각 항목을 반복하면서 처리
         for item in remote_items:
            remote_item_path = os.path.join(remote_folder_path, item)
            local_item_path = os.path.join(local_folder_path, item)

            # 원격 항목의 속성 가져오기
            remote_item_attr = self.sftp.stat(remote_item_path)

            # 만약 폴더라면 재귀적으로 다시 호출
            if stat.S_ISDIR(remote_item_attr.st_mode):
               self.get_remote_folder(self.sftp, remote_item_path, local_item_path)
            else:
               # 파일이라면 복사
               self.sftp.get(remote_item_path, local_item_path)
               
   def save_file(self, local_path, remote_path):
      if self.sftp:
         print('저장완')
         self.sftp.put(local_path, remote_path)

   def get_remote_file(self, remote_file_path, local_file_path):
      if self.sftp:
         # 로컬 폴더가 없으면 생성
         local_folder_path = os.path.dirname(local_file_path)
         if not os.path.exists(local_folder_path):
            os.makedirs(local_folder_path)

            # 파일 복사
         self.sftp.get(remote_file_path, local_file_path)

   def get_images(self, image_list, image_type):
      images = []
      
      try:
         for img in image_list:
            with self.sftp.file(img, 'rb') as file:
               image_data = base64.b64encode(file.read()).decode('utf-8')
               image_data = 'data:image/' + image_type + ';base64,' + image_data
               images.append(image_data)
      except Exception as e:
         print(f"Error getting images: {e}")
         
      return images
   
   def get_profile_image(self, profile_img):
      try:
         with self.sftp.file(profile_img, 'rb') as file:
            image_data = base64.b64encode(file.read()).decode('utf-8')
            image_data = 'data:image/jpg;base64,' + image_data
            return image_data, 200
      except Exception as e:
         print(f"Error getting profile image: {e}")
         return 'Error setting profile image', 500

ssh_manager = SSHManager()


from server_khj import record_video, select_option, add_log, save_log, \
    register_user, remove_registered_user, login_user, logout_user

@app.route('/add_log', methods=['POST'])
def add_log_route():
    return add_log(request, session, ssh_manager)

@app.route('/record', methods=['POST'])
def record_video_route():
    return record_video(request, session, ssh_manager)

@app.route('/upload', methods=['POST'])
def select_option_route():
    return select_option(request, session, ssh_manager)

@app.route('/save', methods=['POST'])
def save_log_route():
    return save_log(request, session, ssh_manager)


from server_jjh import analysisReport, searchResult, social, socialDetail, comments, hearts, get_log_overview_of_month, log_detail

@app.route("/analysisReport", methods=['POST', 'GET'])
def analysisReport_route():
   return analysisReport(request, session, ssh_manager)


@app.route('/searchresult', methods=['POST','GET'])
def searchResult_route():
   return searchResult(request, session, ssh_manager)


@app.route("/social")
def social_route():
    return social(request, session, ssh_manager)


@app.route("/socialdetail", methods=['POST','GET'])
def socialDetail_route():
    return socialDetail(request, session, ssh_manager)


@app.route("/comments", methods=['POST','GET'])
def comments_route():
    return comments(request, session, ssh_manager)


@app.route("/hearts", methods=['POST','GET'])
def hearts_route():
    return hearts(request, session, ssh_manager)


@app.route("/month-overview", methods=['POST'])
def get_log_overview_of_month_route():
    return get_log_overview_of_month(request, ssh_manager)


@app.route("/logdetail", methods=['POST','GET'])
def log_detail_route():
    return log_detail(request, session, ssh_manager)





from server_jyb import check_authentication, check_username_availability, change_user_password, \
    get_current_user, get_user_profile_image, set_profile_image, \
    send_friend_request, search_user, get_friend_list, unsend_friend_request, \
    reject_friend_request, accept_friend_request, remove_friend

@app.route("/generateDetails")
def generate_details():
    return {"date": "Friday, December 9, 2023",
            "coverImg": "/route/to/image",
            "hashtags": ["😍", "이탈리아이탈리아이탈리아이탈리아", "여행", "해변", "수영"],
            "summary": "이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 가족 여행으로 시칠리아에 왔어요. 여름의 이탈리아는 매우 더워요. 해변에서 하루종일 수영했어요.",
            "privacy": "전체 공개",
            "location": "Sicily, Italy",
            "emotion": "happy"}


@app.route('/authentication', methods=['GET'])
def check_authentication_route():
    return check_authentication(request, session)


@app.route('/username_availability', methods=['GET'])
def check_username_availability_route():
    return check_username_availability(request)


@app.route('/registration', methods=['POST'])
def register_user_route():
    return register_user(request, bcrypt, ssh_manager)


@app.route('/change_password', methods=['POST'])
def change_user_password_route():
    return change_user_password(request, session, bcrypt)


@app.route('/delete_account', methods=['POST'])
def remove_registered_user_route():
    return remove_registered_user(request, session, ssh_manager)


@app.route('/login', methods=['POST'])
def login_user_route():
    return login_user(request, bcrypt, ssh_manager)


@app.route('/logout', methods=['GET'])
def logout_user_route():
    return logout_user(request, session, ssh_manager)
    

@app.route("/@me")
def get_current_user_route():
    return get_current_user(request, session)
    

@app.route("/get_profile_image", methods=['POST'])
def get_user_profile_image_route():
    return get_user_profile_image(request, ssh_manager)


@app.route("/set_profile_image", methods=['POST'])
def set_profile_image_route():
    return set_profile_image(request, session, ssh_manager)


@app.route('/get_friend_list', methods=['POST'])
def friend_information_route():
    return get_friend_list(request, session)


@app.route('/search_user', methods=['POST'])
def search_user_route():
    return search_user(request, session)


@app.route('/send_friend_request', methods=['POST'])
def send_friend_request_route():
    return send_friend_request(request, session)


@app.route('/unsend_friend_request', methods=['POST'])
def unsend_friend_request_route():
    return unsend_friend_request(request, session)

@app.route('/reject_friend_request', methods=['POST'])
def reject_friend_request_route():
    return reject_friend_request(request, session)


@app.route('/accept_friend_request', methods=['POST'])
def accept_friend_request_route():
    return accept_friend_request(request, session)


@app.route('/remove_friend', methods=['POST'])
def remove_friend_route():
    return remove_friend(request, session)



if __name__ == "__main__":
    app.run(debug=True)
