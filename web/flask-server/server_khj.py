import os
import cv2
import random
from datetime import datetime
import subprocess
import speech_recognition as sr

from flask import session, jsonify

from sqlalchemy.exc import IntegrityError
from models import db, User, videoInfo, videoLog, socialNetwork
from functions import create_folder, delete_folder, get_video, save_file

import torch
from transformers import PreTrainedTokenizerFast, BartForConditionalGeneration

device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
print('device:', device)

# 요약 모델
SUMMARY_DIR_PATH = 'log/modelling/summary'
summary_model = BartForConditionalGeneration.from_pretrained(SUMMARY_DIR_PATH)
summary_tokenizer = PreTrainedTokenizerFast.from_pretrained(SUMMARY_DIR_PATH)
summary_model = summary_model.to(device)

# 해시태그 모델
HASHTAG_DIR_PATH = 'log/modelling/hashtag'
hashtag_model = BartForConditionalGeneration.from_pretrained(HASHTAG_DIR_PATH)
hashtag_tokenizer = PreTrainedTokenizerFast.from_pretrained(HASHTAG_DIR_PATH)
hashtag_model = hashtag_model.to(device)

emotion_list = ['🥰', '😆', '🙂', '😐', '🙁', '😠', '😵']


#회원가입 - 개인 폴더 생성
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

		# 사용자 개인 폴더 생성
		create_folder(username)
		
		return jsonify({
			'username': new_user.username,
			'email': new_user.email
		})
	except Exception as e:
		print(f"Error in signup: {str(e)}")


#탈퇴 - 개인 폴더 삭제
def remove_registered_user(request, session):
	user_id = session.get("user_id")
	
	if not user_id:
		return jsonify({"error": "Unauthorized"}), 401
	
	user = User.query.filter_by(username=user_id).first()
	
	if not user:
		return jsonify({"error": "User not found"}), 404
	
	try:
		with db.session.begin_nested():
			# Delete user from user_account table
			db.session.delete(user)
		
		db.session.commit()
		
		# 사용자 개인 폴더 삭제
		delete_folder(user_id)
		print(f'{user_id} 탈퇴 완료')

		return jsonify({"message": "Account deleted successfully"}), 200
	
	except IntegrityError:
		db.session.rollback()  # Rollback in case of an error
		return jsonify({"error": "Database error"}), 500


#로그인
def login_user(request, bcrypt):
	username = request.json['username']
	password = request.json['password']
	
	# fetch user data by username from user_info_db : user_account table
	user = User.query.filter_by(username=username).first()
	
	if user is None:
		return jsonify({"error": "Unauthorized"}), 401
	
	if not bcrypt.check_password_hash(user.password, password):
		return jsonify({"error": "Unauthorized: Wrong password"}), 401
	
	# set client-side session cookie
	session["user_id"] = username
	print("session id:", session["user_id"])

	return jsonify({'username': user.username, 'email': user.email, 'createdAt': user.created_at})


#로그아웃
def logout_user(request, session):
	user_id = session.get("user_id")
	if user_id:
		session.clear()
		return jsonify({"msg": "Successful user logout"}), 200
	else:
		return jsonify({"error": "Unauthorized"}), 401


def add_log(request, session):
	try:
		upload_date = request.json['upload_date']
		session["upload_date"] = upload_date
		
		user_id = session.get("user_id")
		now = datetime.now()
		today = str(now.strftime("%Y-%m-%d"))
		print("===================")
		print(today)
		video_exists = bool(videoInfo.query.filter(videoInfo.username == user_id, videoInfo.video_date == today).first())

		return_data = { 'upload_date': upload_date, 'video_exists': video_exists}
		return jsonify(return_data)

	except Exception as e:
		print(f"Error in add log: {str(e)}")


def get_date():
	now = datetime.now()
	remote_video_date = str(now.strftime("%Y%m%d")).replace('-','')
	local_video_date = str(now).replace('-','').replace(' ','').replace(':','').replace('.','')
	return [remote_video_date, local_video_date]


def mp4_to_wav(local_video_path, local_audio_path):
	try:
		command = f'ffmpeg -i "{local_video_path}" -vn -acodec pcm_s16le -ar 44100 -ac 2 "{local_audio_path}"'
		subprocess.run(command, shell=True)
	except Exception:
		pass


def record_video(request, session):
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
			local_image_path = f'log/web/temp/{local_file_name}.png'
			local_video_path = f'log/web/temp/{local_file_name}.mp4'
			local_audio_path = f'log/web/temp/{local_file_name}.wav'
			
			session['local_path'] = [local_image_path, local_video_path, local_audio_path]
			session['local_file_name'] = local_file_name

			# 최종 저장 경로 (원하는 경로와 파일명으로 변경)
			remote_image_path = f'data/{user_id}/{remote_file_name}.png'
			remote_video_path = f'data/{user_id}/{remote_file_name}.mp4'

			# 파일 저장
			video_file.save(local_video_path)

			# 음원 추출
			mp4_to_wav(local_video_path, local_audio_path)

			# 세션값 추가
			video_file_path = get_video(f'log/web/temp/{local_file_name}.mp4')
			response_data = {'username':user_id, 'date': remote_video_date, 'video_id': remote_file_name, 'video_url': remote_video_path, 'cover_image': remote_image_path}
			session["video_info"] = response_data

			return_data = {'video_info': {'upload_date': upload_date, 'video_file_path': video_file_path }}
			return jsonify(return_data)
		
		else:
			print('비디오 파일 없음')
			return 'No video file provided', 400

	except Exception as e:
		print(f"Error in record: {str(e)}")


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

	for i in range(len(hashtag_list)):
		if '.' in hashtag_list[i]:
			hashtag_list[i] = hashtag_list[i].replace('.', '')
		if ' ' in hashtag_list[i]:
			hashtag_list[i] = hashtag_list[i].replace(' ', '') 

	if '' in hashtag_list:
		hashtag_list.remove('')

	hashtag_list.insert(0, emotion_list[emotion])
	return hashtag_list



#BGM 추가 함수
def add_bgm(video_path, result_path, emotion):
	folder_path = f"log/web/flask-server/bgm/{emotion}"
	files = os.listdir(folder_path)
	random_num = random.randint(0, len(files)-1)

	audio_path = f"log/web/flask-server/bgm/{emotion}/{files[random_num]}"

	# 비디오와 음악을 합치는 FFmpeg 명령어 생성
	command = f'ffmpeg -i {video_path} -i {audio_path} -filter_complex "[0:a]aformat=fltp:44100:stereo,apad[aud1];[1:a]aformat=fltp:44100:stereo,volume=0.3[aud2];[aud1][aud2]amix=inputs=2:duration=first[out]" -c:v copy -map 0:v:0 -map "[out]" -shortest {result_path}'
	
	# FFmpeg 명령어 실행
	subprocess.run(command, shell=True)


def select_option(request, session):
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

		if switches["bgm"]:
			print('bgm 함수 실행')
			local_video_path = local_path[1]
			local_result_path = f'log/web/temp/{local_file_name}_bgm.mp4' #bgm 추가한 영상
			add_bgm(local_video_path, local_result_path, emotion)

			session['local_path'] = [local_path[0], local_result_path, local_path[2], local_path[1]] #세선 업데이트
			video_file_path = get_video(f'log/web/temp/{local_file_name}_bgm.mp4')
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
			if len(text) <= 20:
				summary = text

			else:
				summary = diary_summary(text)
			print('summary: ', summary)
			
		if switches["hashtag"]:
			# 해시태그 모델
			if summary == '':
				hashtags = [emotion_list[emotion]]

			#원본 텍스트가 너무 짧을 경우
			elif len(text) <= 50:
				hashtags = make_tag(text, emotion)

			else:
				hashtags = make_tag(summary, emotion)
		else:
			hashtags = [emotion_list[emotion]]

		print('hashtag: ', hashtags)
			
		return_data = {'video_info': video_info, 'switches': switches, 'summary': summary, 'hashtags': hashtags } # 'video_file_path': video_file_path, 
		return jsonify(return_data)

	except Exception as e:
		print(f"Error in record: {str(e)}")


def save_log(request, session):
	user_id = session.get("user_id")

	try:
		print('저장 시작')
		video_info = session.get("video_info")
		video_date = f"{video_info['date'][:4]}-{video_info['date'][4:6]}-{video_info['date'][6:]}"
		switches = request.json['switches']
		summary = request.json['summary']
		hashtags = request.json['hashtags']
		local_path = session.get('local_path')

		#이미지 캡처
		cap = cv2.VideoCapture(local_path[1])
		ret, frame = cap.read()

		if ret:
			cv2.imwrite(local_path[0], frame)
		cap.release()

		# 이미지 및 동영상 저장
		save_file(local_path[0], video_info['cover_image'])
		save_file(local_path[1], video_info['video_url'])

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

		return jsonify({'Finish': 'SAVE'})

	except Exception as e:
		print(f"Error in save: {str(e)}")
