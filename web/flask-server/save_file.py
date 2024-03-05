import os
import stat
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


ssh_manager = SSHManager()

ssh_manager.open()

# 삭제할 폴더 경로
remote_folder_path = f'D:/log/loguser'
ssh_manager.delete_folder(remote_folder_path)

# SFTP 세션 닫기
ssh_manager.close()