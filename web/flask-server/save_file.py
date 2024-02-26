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
# file_name = 'olduser20240225034229650906'
# local_image_path = f'web/client/public/temp/{file_name}.png'
# local_video_path = f'web/client/public/temp/{file_name}.mp4'

# # 저장 경로 (원하는 경로와 파일명으로 변경)
# remote_image_path = f'D:/log/{file_name}.png'
# remote_video_path = f'D:/log/{file_name}.mp4'

# # SCP 연결
# ssh_client.connect(ssh_host, port=ssh_port, username=ssh_username, password=ssh_password)

# # 파일을 SCP로 원격 서버에 업로드
# with ssh_client.open_sftp() as sftp:
#     sftp.put(local_image_path, remote_image_path)
#     sftp.put(local_video_path, remote_video_path)

# # SSH 연결 종료
# ssh_client.close()

from datetime import datetime

now = datetime.now()
upload_date = [now.year, now.month, now.day]
remote_video_date = str(now.strftime("%Y%m%d")).replace('-','')
local_video_date = str(now).replace('-','').replace(' ','').replace(':','').replace('.','')
print(remote_video_date, local_video_date)