import os
import redis

class ApplicationConfig:
	SECRET_KEY = "djklf;dljskafowjiefoj;djskl;fajjdfoiw9023849rhueknslk"
	
	# db_config = {
	# 	'host': '222.107.147.71',
	# 	'user': 'jyb',
	# 	'password': 'everysecondcounts',
	# 	'database': 'user_info_db',
	# 	'charset': 'utf8mb4',
	# }
	
	SQLALCHEMY_TRACK_MODIFICATIONS = False
	SQLALCHEMY_ECHO = True

	SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://jyb:everysecondcounts@222.107.147.71:3306/user_info_db'

	SQLALCHEMY_BINDS = {
		# URI FORMAT = 'mysql+pymysql://user:password@host:port/database'
		'db2': 'mysql+pymysql://jyb:everysecondcounts@222.107.147.71:3306/user_log_db'
	}
	
	SESSION_TYPE = "redis"
	SESSION_PERMANENT = False
	SESSION_USE_SIGNER = True
	SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")