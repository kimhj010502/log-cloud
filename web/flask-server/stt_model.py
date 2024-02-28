import speech_recognition as sr
# import sys #-- 텍스트 저장시 사용
import moviepy.editor as mp
from imageio.plugins import ffmpeg

video_clip = mp.VideoFileClip(r"test_file.mov")
video_clip.audio.write_audiofile(r"test_audio.wav")

r = sr.Recognizer()
kr_audio = sr.AudioFile('./test_audio.wav')

with kr_audio as source:
    audio = r.record(source)

#sys.stdout = open('news_out.txt', 'w') #-- 텍스트 저장시 사용
print(r.recognize_google(audio, language='ko-KR')) #-- 한글 언어 사용

#sys.stdout.close() #-- 텍스트 저장시 사용