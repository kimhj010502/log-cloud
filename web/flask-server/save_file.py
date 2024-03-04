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

# from datetime import datetime

# now = datetime.now()
# upload_date = [now.year, now.month, now.day]
# remote_video_date = str(now.strftime("%Y%m%d")).replace('-','')
# local_video_date = str(now).replace('-','').replace(' ','').replace(':','').replace('.','')
# print(remote_video_date, local_video_date)


# local_video_path = "C:/Users/user/Desktop/log/log/web/client/public/temp/olduser20240228014729041799.mp4"
# local_audio_path = "C:/Users/user/Desktop/log/log/web/client/public/temp/olduser20240228014729041799.wav"

# import moviepy.editor as mp

# ffmpeg_path = '/usr/bin/ffmpeg'

# input_file = "input.mp4"
# output_file = "C:/Users/user/Desktop/log/log/web/client/public/temp/output.mp4"

# mp.ffmpeg_tools.ffmpeg_extract_audio(local_video_path,  local_audio_path)

# import moviepy.editor as mp

# local_video_path = "C:/Users/user/Desktop/log/log/web/client/public/temp/olduser20240228185941477681.mp4"
# local_audio_path = "C:/Users/user/Desktop/log/log/web/client/public/temp/olduser20240228185941477681.mp3"

# mp.ffmpeg_tools.ffmpeg_extract_audio(local_video_path, local_audio_path)

# from models import db, User, videoInfo, videoLog, socialNetwork

# new_log = videoInfo(username='user', video_id='olduser', video_date=video_date, video_url=video_info['video_url'], cover_image=video_info['cover_image'], original_text=session['original_text'], summary=summary, emotion=session['emotion'], hashtag=hashtags, share=int(switches['public']))
# db.session.add(new_log)
# db.session.commit()

# from moviepy.editor import VideoFileClip, AudioFileClip

# filename = "web/client/public/temp/olduser20240303205144515697.mp4"
# clip = VideoFileClip(filename)
# clip.audio.write_audiofile(filename[:-4] + ".wav")
# clip.close()


from pyffmpeg import FFmpeg

# 원본 동영상 파일과 배경음악 파일 경로
video_path = "web/client/public/temp/olduser20240303205144515697.mp4"
audio_path = "web/client/public/sample_bgm.mp3"

result_path = "web/client/public/temp/result.mp4"


# FFmpeg 객체 생성
import subprocess

# 비디오와 음악을 합치는 FFmpeg 명령어 생성
command = f'ffmpeg -i {video_path} -i {audio_path} -filter_complex "[0:a]aformat=fltp:44100:stereo,apad[aud1];[1:a]aformat=fltp:44100:stereo[aud2];[aud1][aud2]amix=inputs=2:duration=first[out]" -c:v copy -map 0:v:0 -map "[out]" -shortest {result_path}'

# FFmpeg 명령어 실행
subprocess.run(command, shell=True)
# 새로운 동영상 저장
# output_path = "web/client/public/temp/output.mp4"
# video_clip.write_videofile(output_path, codec='libx264', audio_codec='aac')

# ffmpeg -i web/client/public/temp/olduser20240303205144515697.mp4 -i web/client/public/example_bgm.mp3 -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 -shortest web/client/public/temp/result.mp4

# ffmpeg -i web/client/public/temp/olduser20240303205144515697.mp4 -i web/client/public/example_bgm.mp3 -filter_complex "[0:a]aformat=fltp:44100:stereo,apad[0a];[1:a]aformat=fltp:44100:stereo[1a];[0a][1a]amix=inputs=2:duration=first" -c:v copy -map 0:v:0 -map "[0a]" -shortest web/client/public/temp/result.mp4

# ffmpeg -i web/client/public/temp/olduser20240303205144515697.mp4 -i web/client/public/example_bgm.mp3 -filter_complex "[0:a]aformat=fltp:44100:stereo,apad[aud1];[1:a]aformat=fltp:44100:stereo[aud2];[aud1][aud2]amix=inputs=2:duration=first[out]" -c:v copy -map 0:v:0 -map "[out]" -shortest web/client/public/temp/result.mp4
