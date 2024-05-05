from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
	__tablename__ = "user_account"
	username = db.Column(db.String(32), primary_key=True, unique=True)
	email = db.Column(db.String(345), unique=True)
	password = db.Column(db.Text, nullable=False)
	created_at = db.Column(db.TIMESTAMP, server_default=db.func.now())
	profile_img = db.Column(db.String(255), nullable=True)


class videoInfo(db.Model):
	__tablename__ = "video_info"
	username = db.Column(db.String(32), nullable=False)
	date = db.Column(db.TIMESTAMP, server_default=db.func.now())
	video_id = db.Column(db.String(45), nullable=False, unique=True, primary_key=True)
	video_date = db.Column(db.String(20), nullable=False)
	video_url = db.Column(db.String(45), nullable=False, unique=True)
	cover_image = db.Column(db.String(50), nullable=True)
	original_text = db.Column(db.Text, nullable=True)
	summary = db.Column(db.Text, nullable=True)
	emotion = db.Column(db.Integer, nullable=True)
	hashtag = db.Column(db.JSON, nullable=True)
	share = db.Column(db.Integer, nullable=False)


class socialNetwork(db.Model):
	__tablename__ = "social_network"
	username1 = db.Column(db.String(32), nullable=False, primary_key = True)
	username2 = db.Column(db.String(32), nullable=False, primary_key = True)
	state = db.Column(db.Integer, nullable=False, primary_key = True)


class likeLog(db.Model):
	__tablename__ = "like_log"
	video_id = db.Column(db.String(45), nullable=False, primary_key = True)
	username = db.Column(db.String(45), nullable=False, primary_key = True)


class commentLog(db.Model):
	__tablename__ = "comment_log"
	video_id = db.Column(db.String(45), nullable=False, primary_key = True)
	username = db.Column(db.String(45), nullable=False, primary_key = True)
	comment = db.Column(db.Text, nullable=False, primary_key = True)
	date = db.Column(db.TIMESTAMP, server_default=db.func.now())
