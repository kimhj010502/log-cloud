from flask import Flask, request, redirect, url_for, session, flash, jsonify
import pymysql
from datetime import datetime
from config import db_config

app = Flask(__name__)

def get_db():
	return pymysql.connect(**db_config)


@app.route('/api/signup', methods=['POST'])
def signup():
	try:
		data = request.json
		username = data.get('username')
		email = data.get('email')
		password = data.get('password')
		
		# Insert user into the database
		with get_db() as conn, conn.cursor() as cursor:
			sql = "INSERT INTO user_account (username, email, password, created_at) VALUES (%s, %s, %s, %s)"
			cursor.execute(sql, (username, email, hash_password(password), datetime.utcnow()))
			conn.commit()
			
		return jsonify({'message': 'Signup successful'})
	except Exception as e:
		print(f"Error in signup: {str(e)}")

@app.route('/api/check_username_availability', methods=['GET'])
def check_username_availability():
    username = request.args.get('username')

    if not username:
        return jsonify({'error': 'Username parameter is missing'}), 400

    with get_db() as conn, conn.cursor() as cursor:
        sql = "SELECT * FROM user_account WHERE username = %s"
        cursor.execute(sql, (username,))
        user = cursor.fetchone()

    if user:
        return jsonify({'available': False})
    else:
        return jsonify({'available': True})

@app.route('/api/login', methods=['POST'])
def login():
	data = request.json
	username = data.get('username')
	password = data.get('password')
		
	# Check user credentials
	with get_db() as conn, conn.cursor() as cursor:
		sql = "SELECT * FROM user_account WHERE username = %s AND password = %s"
		cursor.execute(sql, (username, hash_password(password)))
		user = cursor.fetchone()
		
	if user:
		# set up user sessions here
		return jsonify({'message': 'Login successful'})
	else:
		return jsonify({'message': 'Invalid username or password'}), 401
		

def hash_password(password):
	return password


@app.route("/socialdetail")
def socialDetail():
	return {"date": "December 9, 2023",
			"coverImg": "/route/to/image",
			"profileImg": "/route/to/profile_image",
			"profileUsername": "username"}


@app.route("/logdetail")
def logDetail():
	return {"date": "Friday, December 9, 2023",
			"coverImg": "/route/to/image",
			"hashtags": ["이탈리아이탈리아이탈리아이탈리아", "여행", "해변", "수영"],
			"summary": "이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 가족 여행으로 시칠리아에 왔어요. 여름의 이탈리아는 매우 더워요. 해변에서 하루종일 수영했어요.",
			"privacy": "private",
			"location": "Sicily, Italy",
			"emotion": "happy"}


@app.route("/generateDetails")
def generateDetails():
	return {"date": "Friday, December 9, 2023",
			"coverImg": "/route/to/image",
			"hashtags": ["이탈리아이탈리아이탈리아이탈리아", "여행", "해변", "수영"],
			"summary": "이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 이탈리아 가족 여행으로 시칠리아에 왔어요. 여름의 이탈리아는 매우 더워요. 해변에서 하루종일 수영했어요.",
			"privacy": "전체 공개",
			"location": "Sicily, Italy",
			"emotion": "happy"}

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