# NLP를 활용한 영상 일기 플랫폼 log
AI로 간단하게 기록하는 하루의 영상일기, 글보다도 쉽고 생생해요. <br>
log가 일기 요약본, 해시태그, 배경음악을 만들어줍니다. <br>


<a href='https://logyourmemory.xyz' target='_blank'>
    <img src='https://ifh.cc/g/BJFDwy.png' border='0' width='70'>
</a>
→ 𝑙𝑜𝑔 𝑦𝑜𝑢𝑟 𝑚𝑒𝑚𝑜𝑟𝑦 바로가기
<br>

---

### 배포 및 실행 환경
> **Server OS**: Ubuntu Server 20.04 LTS 64bit <br>
**Browser**: Chrome, Safari, Microsoft Edge <br>
**Device**: iOS, Andriod, Windows, macOS 지원 기기<br>

<br>

### 디렉토리 구조 및 소스코드 설명
    📦ubuntu
    ┣ 📂data: MySQL data 저장 폴더
    ┃ ┗  📂user: 사용자 프로필 이미지 저장 폴더
    ┣ 📂log
    ┃ ┣ 📂modelling: 해시태그와 요약본 생성 모델 관련 파일
    ┃ ┃ ┣ 📂hashtag
    ┃ ┃ ┗ 📂summary
    ┃ ┣ 📂web: 웹 서버와 클라이언트 관련 코드
    ┃ ┃ ┣ 📂client: React 프론트엔드 코드
    ┃ ┃ ┃ ┣ 📂public: 이미지 파일
    ┃ ┃ ┃ ┗ 📂src
    ┃ ┃ ┃ ┃ ┣ 📜 AppPage: 홈페이지
    ┃ ┃ ┃ ┃ ┣ 📜 LoginPage: 로그인 페이지
    ┃ ┃ ┃ ┃ ┣ 📜 SignupPage: 회원가입 페이지
    ┃ ┃ ┃ ┃ ┣ 📜 RecordPage, UploadPage, EditPage, SavePage: 일기 녹화 페이지
    ┃ ┃ ┃ ┃ ┣ 📜 MyFeedPage: 내 일기 페이지
    ┃ ┃ ┃ ┃ ┣ 📜 SocialFeedPage, SocialPage: 소셜 페이지 (친구 일기 확인)
    ┃ ┃ ┃ ┃ ┣ 📜 SearchPage, SearchResultPage: 일기 검색 페이지
    ┃ ┃ ┃ ┃ ┣ 📜 AnalysisPage: 통계 페이지
    ┃ ┃ ┃ ┃ ┣ 📜 ProfilePage, ManageFriendsPage, ChangePasswordPage: 프로필, 친구 관리, 비밀번호 변경 페이지
    ┃ ┃ ┃ ┃ ┗ 📜 Routing: 페이지별 라우팅
    ┃ ┃ ┣ 📂flask-server: Flask 백엔드 코드
    ┃ ┃ ┃ ┣ 📂bgm: 감정별 배경음악 파일
    ┃ ┃ ┃ ┣ 📜 server.py, server_jjh.py, server_jyb.py, server_khj.py: 백엔드 서버 파일
    ┃ ┃ ┣ 📂temp: 사용자 영상 일기 임시 저장 폴더
    ┃ ┃ ┗ 📜 requirements.txt: Python 라이브러리 목록

<br>

## HOW TO BUILD
1. log 프로그램을 설치할 root directory를 만든다. <br>
    ```bash
    mkdir ubuntu # root 폴더 생성
    cd ubuntu # ubuntu 폴더로 이동
    ```
<br>

2. ubuntu 폴더 내에서 `log-cloud` 레포지토리를 clone한다. <br>
    ```bash
    git clone https://github.com/kimhj010502/log-cloud.git log # log 폴더로 git clone
    ```
<br>

3. DB 저장용 폴더를 생성한다. <br>
    ```bash
    mkdir data # DB 저장용 폴더 생성
    cd data
    mkdir user # 사용자 프로필 
    ```
<br>

4. 사용자의 DB를 저장하기 위해 MySQL을 설치하고 `root` 사용자에 권한을 부여한다. <br>
    ```bash
    sudo apt-get install mysql-server # MySQL 설치
    sudo ufw allow mysql # 외부접속 허용
    sudo systemctl start mysql # MySQL 서버 실행
    sudo systemctl enable mysql # Ubuntu 서버 재시작시 MySQL 서버 자동 실행

    sudo mysql -u root -p # root 권한 설정
    ```
<br>

5.  MySQL에 접속한 후 root 계정의 비밀번호를 설정한다. <br>
    ```sql
    -- MySQL 접속
    GRANT ALL ON *.* TO 'root'@'%';
    FLUSH PRIVILEGES;

    
    alter user 'root'@'localhost' identified with mysql_native_password by'설정할 비밀번호' -- root 계정 비밀번호 설정
    ```
<br>

6. MySQL의 데이터베이스 경로(datadir)를 `ubuntu/data` 디렉토리로 지정한다. <br>
    ```bash
    vi /etc/my.cnf # MySQL 설정 파일 수정
    ```
<br>

7. 세션 관리를 위해 Redis를 설치한다. <br>
    ```bash
    sudo apt-get install redis-server # Redis 설치
    systemctl status redis-server # Redis 서버가 실행중인지 확인
    ```
<br>

8. React 프론트엔드 서버 구현을 위해 node와 npm을 설치한다. <br>
    ```bash
    sudo apt update
    sudo apt install nodejs npm #node, npm 설치
    ```
    ```bash
    node --version #node 버전 확인
    npm --version #npm 버전 확인
    ```
    node는 v20.10.0 버전을, npm은 10.2.3 버전을 사용하였다.
<br>

9. `log/web/flask-server` 폴더 내에 `config.py` 파일을 생성하여 백엔드 서버(Flask)와 DB 서버(MySQL, Redis)를 연결하는 코드를 작성한다.<br>
    ```python
    import redis

    class ApplicationConfig:
        SECRET_KEY = "{flask secret key}" #random한 값 생성해서 입력
        
        #MySQL 서버 연결
        SQLALCHEMY_TRACK_MODIFICATIONS = False
        SQLALCHEMY_ECHO = False
        SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:{root 계정 비밀번호}@localhost:3306/log'
        
        #Redis 서버 연결
        SESSION_TYPE = "redis"
        SESSION_PERMANENT = False
        SESSION_USE_SIGNER = True
        SESSION_REDIS = redis.from_url("redis://127.0.0.1:6379")
    ```
<br>

10. `log/modelling` 폴더 내에 훈련된 모델을 설치한다. <br><br>
    현재의 github에는 용량 문제로 인해 모델의 safetensors 파일이 첨부되어 있지 않다. 따라서, modelling 폴더의 hashtag, summary 폴더 각각에 model.safetensors 파일을 직접 첨부하여 사용해야 한다. <br><br>
    일기 데이터셋에 맞게 파인튜닝시킨 요약, 해시태그 모델은 아래 허깅페이스에서 다운받을 수 있다. <br>
    > [문서 요약 모델 다운받기](https://huggingface.co/jjae/kobart-summarization-diary/tree/main) | [해시태그 생성 모델 다운받기](https://huggingface.co/jjae/kobart-hashtag/tree/main)

    <br>

    혹은 모델 파일을 직접 첨부하는 방법 대신 허깅페이스의 모델을 불러와 사용하도록 `log/web/flask-server/server_khj.py` 파일의 24 ~ 34줄 코드를 아래와 같이 수정해도 된다.

    ```python
    # summary
    from transformers import PreTrainedTokenizerFast, BartForConditionalGeneration
    SUMMARY_DIR_PATH = "jjae/kobart-summarization-diary"
    summary_tokenizer = PreTrainedTokenizerFast.from_pretrained(SUMMARY_DIR_PATH)
    summary_model = BartForConditionalGeneration.from_pretrained(SUMMARY_DIR_PATH)
    summary_model = summary_model.to(device)

    # hashtag
    from transformers import PreTrainedTokenizerFast, BartForConditionalGeneration
    HASHTAG_DIR_PATH = "jjae/kobart-hashtag"
    hashtag_tokenizer = PreTrainedTokenizerFast.from_pretrained(HASHTAG_DIR_PATH)
    hashtag_model = BartForConditionalGeneration.from_pretrained(HASHTAG_DIR_PATH)
    hashtag_model = hashtag_model.to(device)
    ```
<br>

## HOW TO INSTALL
1. Python 라이브러리를 설치한다. <br>
    ```bash
    cd log #log 폴더로 이동
    pip install -r requirements.txt #필요한 python 라이브러리 설치
    ````

2. npm 패키지를 설치한다. <br>
    ```bash
    cd web/client #client 폴더로 이동
    npm install #필요한 npm 패키지 설치
    ````

<br>

## HOW TO TEST
1. **Terminal 1**: 프론트엔드 서버를 실행한다. <br>
    ```bash
    cd log/web/client #client 폴더로 이동
    npm start #프론트엔드 서버 실행
    ```

2. **Terminal 2**: 백엔드 서버를 실행한다. <br>
    ```bash
    python3 log/web/flask-server/server.py #server.py 파일 실행
    ```

3. **Terminal 3**: Session 관리용 Redis DB 서버를 실행한다.
    ```bash
    redis-server #redis server 실행
    ```
    성공적으로 켰다면, `Ready to accept connections tcp`가 출력된 것을 확인할 수 있다.

위의 터미널 3개를 모두 실행하면, `http://{Public IP 주소}:3000`으로 웹 어플리케이션에 접속할 수 있다. HTTPS로 접속해야만 카메라 및 음성 녹화 권한을 얻을 수 있으므로 도메인을 발급받아 배포를 진행하였다.

<br>

## HOW TO DEPLOY DOMAIN 
먼저, 외부 네트워크에서 각 포트에 접근할 수 있도록 클라우드 서버 인스턴스의 Inbound Rule을 설정해야 한다.

![](https://velog.velcdn.com/images/kmeeziv/post/d856007a-7710-4f73-ad77-8eaa983a5702/image.png)


Cloud Virtual Machine 창에서 인스턴스 이름을 설정하고 Security groups 탭의 Edit Rule 버튼을 클릭해 수정하였다.

![](https://velog.velcdn.com/images/kmeeziv/post/388ac848-67b0-45e1-be09-de706881a97e/image.png)

3306번, 3000번, 5000번 포트의 Source를 `0.0.0.0/0`로 설정하여 이 포트로 들어오는 모든 트래픽을 허용하였다. 지금 다시 생각해보니, 사용자는 프론트엔드 서버인 3000번 포트에만 직접적으로 접속하므로 3000번 포트만 전체로 설정하고 나머지는 localhost에서만 접속할 수 있도록 해도 될 것 같다.

![](https://velog.velcdn.com/images/kmeeziv/post/89cb9faa-cf08-4f1e-b478-c775ef5ddacb/image.png)

HTTP 서버 (80번 포트), HTTPS 서버 (443번 포트)는 따로 설정하지 않아도 기본으로 열린 포트로 도메인 배포 시에 필요하다.

---
### 1. 클라우드 웹 서버 작동 확인
도메인을 발급받기 전에 웹 서버가 정상적으로 작동되는지 확인해야 한다.

우리 프로젝트의 경우에 프론트엔드 서버가 3000번 포트이므로 `http://{Public IP주소}:3000`로 접근이 가능하다. HTTPS 서버는 SSL 인증서를 발급받은 이후에만 사용이 가능하므로 HTTP 서버만 제대로 작동되는지 확인하면 된다.
<br>

이 과정에서 오류가 뜬다면 Inbound Rule 설정이 제대로 안된 것이거나, 프로젝트 폴더를 클라우드 서버에 업로드하는 과정에 문제가 생긴 것이므로 터미널에 뜨는 에러를 확인하며 수정하면 된다.

![](https://velog.velcdn.com/images/kmeeziv/post/58a583b0-e919-4739-9c7e-d0a4b4b3f97a/image.png)

로그인을 하지 않은 상태에서는 `/login` 페이지로 이동되도록 만들어주었기 때문에 login 페이지가 뜨는 것이고 Public IP 뒤에 `:3000`이 붙어있을 때 접속이 잘 되는지 확인하면 된다.

---

### 2. Nginx를 이용한 포트 포워딩
Public IP 뒤에 `:3000`을 붙여야만 웹페이지가 정상적으로 작동되는 이유는 아무것도 붙이지 않았을 때 자동으로 HTTP 서버인 80번 포트로 로딩되기 때문이다. 즉, `http://{Public IP 주소}`는 `http://{Public IP 주소}:80`과 같은 상태이다.
<br>

3000번 포트로 접근하도록 유도해도 되지만, 포트 번호를 쓰지 않아도 바로 React 서버에 접근하도록 하고 싶었다. 그러면 80번 포트로 들어온 트래픽을 3000번 포트로 연결해주는 **포트 포워딩**이 필요하다.
<br>

먼저 Nginx를 설치하고 시작해야 한다.
```bash
#Nginx 설치
sudo apt install nginx

#Nginx 시작
sudo service nginx start

#Nginx가 제대로 동작하는지 확인
sudo service nginx status 
```
<br>

설치가 완료되면 `/etc/nginx` 폴더가 생성되었을 것이다. 그 안에 있는 `nginx.conf` 파일을 수정해야 한다.
```bash
#nginx.conf 열기
vi /etc/nginx/nginx.conf
```

맨 아래에 `http 블럭`에 아래 코드를 추가해주면 된다.
```bash
http {
	include /etc/nginx/conf.d/*.conf;
	include /etc/nginx/sites-enabled/*;
}
```
<br>

다음으로 `/etc/nginx/sites-available/default.conf` 파일을 수정한다.
```bash
#nginx.conf 열기
vi /etc/nginx/sites-available/default.conf`
```

`server 블럭`에 아래 코드를 추가한다.
```bash
server {
	listen 80;
	
	location / {
		# 모든 요청을 3000번 포트로 리디렉션
		proxy_pass http://localhost:3000;
        
		# 기타 프록시 설정
		proxy_set_header Host $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_ad_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
	}
}
```

`listen`, `location`을 사용해서 80번 포트로 들어오는 요청을 3000번 포트로 리디렉션한다.
<br>

또한, `sites-available/default.conf`에서 수정한 내용이 `sites-enabled/default.conf`에도 반영되어 있어야 한다. 이를 **심볼릭 링크**라고 하며 `nginx.conf`에 적어두었으므로 자동으로 반영된다. 아래 코드를 확인해서 제대로 반영되었는지 확인해볼 수 있다. 
```bash
# nginx.conf 확인
cat /etc/nginx/sites-enabled/default.conf`
```
<br>

마지막으로 Nginx를 재시작해준다.
```bash
# Nginx 재시작
sudo service nginx restart
```

![](https://velog.velcdn.com/images/kmeeziv/post/aae119b3-c954-4e2a-8ec7-1f7881475ec6/image.png)

아까와 달리 웹사이트 주소 마지막에 `:3000`을 쓰지 않아도 연결되는 3000번 포트로 리디렉션되는 것을 볼 수 있다.

---

### 3. Domain 발급
주소창에 Public IP 주소를 매번 입력해서 웹사이트에 접속할 수 없으니 비교적 기억하기 쉬운 Domain을 발급받아 연결해 줄 것이다.

도메인을 발급해주는 사이트는 많지만 배포를 Tencent Cloud에서 했기 때문에 도메인 발급도 Tencent Cloud 내의 도메인 발급 서비스를 사용해서 진행했다.

![](https://velog.velcdn.com/images/kmeeziv/post/5d20c107-355b-485a-b57a-199681dedb13/image.png)

Register Domain 버튼을 눌러 원하는 주소의 도메인을 발급받으면 된다. Tencent Cloud에서는 DNSPod의 DNS 서비스를 제공하며, 오른쪽의 DNS 버튼을 클릭하면 DNS 설정 페이지로 이동된다.

![](https://velog.velcdn.com/images/kmeeziv/post/bc20d902-de5a-455e-9a1c-96669696864e/image.png)

여기서 도메인 이름을 클릭하여 발급받은 도메인과 Public IP 주소를 연결해주는 작업을 할 것이다.

![](https://velog.velcdn.com/images/kmeeziv/post/a936c936-5c12-463b-86b5-5fdbf7a7cbe4/image.png)

빨간색 박스 부분에 Public IP 주소를 적으면 된다. 가상머신 인스턴스를 종료할 때 Public IP가 변경되는 옵션을 선택한 경우에는 이 부분을 매번 수정해 줘야 한다.  마지막에 CNAME 설정에 `www`과 도메인 주소를 입력해서 'www'로도 접근 가능하도록 설정해줬다.
<br>
도메인 연결에는 시간이 조금 소요될 수 있으며 개인적으로 30분 이내에 연결이 완료되는 것 같았다.

![](https://velog.velcdn.com/images/kmeeziv/post/7ae03c54-3823-4486-93de-963e028723fa/image.png)

도메인 연결이 완료되면 IP 주소가 아닌, 발급받은 도메인 주소로 웹사이트에 접근할 수 있다.

---
### 4. SSL 인증서 발급
log 웹 어플리케이션은 영상 일기를 기록하기 위한 서비스이기 때문에, 영상을 녹화하는 과정에서 카메라와 마이크 권한을 허용해야 한다.
![](https://velog.velcdn.com/images/kmeeziv/post/109e1afe-6186-417e-a71e-6ba6dfcf616b/image.png)

그런데 HTTP의 경우에는 보안 문제로 권한을 허용해줄 수 없었다. 그래서 SSL 인증서를 발급받아 HTTPS 주소로 접속할 수 있도록 해주었다.

<br>
먼저, 실행중인 Ngnix를 중지하고 SSL 인증서 발급을 위해 `Cerbot`을 설치한다.

```bash
# Ngnix 중지
sudo systemctl stop nginx

# Cerbot 설치
apt-get update
sudo apt-get install certbot
apt-get install python3-certbot-nginx
```
<br>
다음으로, 인증서를 생성한다.

```bash
# 인증서 생성 및 발급
sudo certbot --nginx -d logyourmemory.xyz -d www.logyourmemory.xyz
```

SSL 인증서 발급 및 갱신 등 관리자가 필요하기 때문에 관리자의 이메일을 입력해야 한다. 이메일을 입력하고 발급이 완료되면, `/etc/letsencrypt/live/{도메인 이름}/` 폴더에 2개의 `pem` 키 파일이 생성된다.
<br>

이번에는 HTTPS 서버인 443 포트로 들어오는 요청을 3000번 포트로 리디렉션해주는 포트 포워딩이 필요하다. 방법은 80번 포트를 3000번 포트로 연결해주는 것과 같다.
<br>

먼저, `/etc/nginx/sites-available/default.conf` 파일을 수정한다.
```bash
# nginx.conf 열기
vi /etc/nginx/sites-available/default.conf`
```

`server 블럭`에 아래 코드를 추가한다.
```bash
server {
	# SSL configuration
    listen 443 ssl default_server;
    listen [::]:443 ssl default_server;

	ssl_certificate "{fullchain.pem 경로}" # /etc/letsencrypt/live/logyourmemory.xyz/fullchain.pem;
    ssl_certificate_key "{privkey.pem 경로}" # /etc/letsencrypt/live/logyourmemory.xyz/privkey.pem;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    location / {
		# 모든 요청을 3000번 포트로 리디렉션
        proxy_pass http://localhost:3000;
        # 기타 프록시 설정
        proxy_set_header Host $http_host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

2개의 pem은 SSL 인증서를 발급받은 도메인 폴더 아래에 있으니 경로를 수정해서 입력하면 된다.
<br>

이번에도 마찬가지로 심볼릭 링크가 잘 연결되어 있는지 확인해본다. 
```bash
# nginx.conf 확인
cat /etc/nginx/sites-enabled/default.conf`
```
<br>

마지막으로 Nginx를 재시작해준다.
```bash
# Nginx 재시작
sudo service nginx restart
```

![](https://velog.velcdn.com/images/kmeeziv/post/294a6486-b07a-4004-919f-55fce625ee02/image.png)

이 과정이 완료되면 `https://{도메인 주소}`로 프론트엔드 프로젝트에 접근할 수 있으며 아까와 달리 주의 요함 문구가 뜨지 않는 것을 확인할 수 있다.