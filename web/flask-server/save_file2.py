# import paramiko
# from config import SSH_HOST, SSH_PORT, SSH_USERNAME, SSH_PASSWORD 

# # SCP 연결 설정
# ssh_client = paramiko.SSHClient()
# ssh_client.load_system_host_keys()
# ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

# # SSH 서버 정보
# ssh_host = SSH_HOST
# ssh_port = SSH_PORT
# ssh_username = SSH_USERNAME
# ssh_password = SSH_PASSWORD

# # 파일 경로
# file_name1 = 'test_image'
# file_name2 = 'test_video'
# local_image_path = f'C:/Git/log/web/flask-server/{file_name1}.jpg'
# local_video_path = f'C:/Git/log/web/flask-server/{file_name2}.mp4'
# # 저장 경로 (원하는 경로와 파일명으로 변경)
# remote_image_path = f'D:/log/h/h20240305.jpg'
# remote_video_path = f'D:/log/h/h20240305.mp4'


# # SCP 연결
# ssh_client.connect(ssh_host, port=ssh_port, username=ssh_username, password=ssh_password)

# # 파일을 SCP로 원격 서버에 업로드
# with ssh_client.open_sftp() as sftp:
#     sftp.put(local_image_path, remote_image_path)
#     sftp.put(local_video_path, remote_video_path)

# # SSH 연결 종료
# ssh_client.close()

import subprocess

local_video_path = 'web/temp/temp/user120240407162006265953.mp4'
output_video_path = 'web/temp/temp/output_code.mp4'
# FFmpeg 명령어 생성
command = f'ffmpeg -i "{local_video_path}" -c:v libx264 -c:a aac "{output_video_path}"'

# FFmpeg 명령어 실행
subprocess.run(command, shell=True)