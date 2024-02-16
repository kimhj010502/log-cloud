from cryptography.fernet import Fernet
import json
import base64

# 키 생성
key = Fernet.generate_key()
cipher_suite = Fernet(key)

# 암호화
ip_to_encrypt = "222.107.147.71"
encrypted_ip = cipher_suite.encrypt(ip_to_encrypt.encode())

port_to_encrypt = "22"
encrypted_port = cipher_suite.encrypt(port_to_encrypt.encode())

username_to_encrypt = "user"
encrypted_username = cipher_suite.encrypt(username_to_encrypt.encode())

password_to_encrypt = "kanginlee0219"
encrypted_password = cipher_suite.encrypt(password_to_encrypt.encode())

# 데이터 패킹
data_to_share = {
    'key': base64.urlsafe_b64encode(key).decode(),
    'encrypted_ip': base64.urlsafe_b64encode(encrypted_ip).decode(),
    'encrypted_port': base64.urlsafe_b64encode(encrypted_port).decode(),
    'encrypted_username': base64.urlsafe_b64encode(encrypted_username).decode(),
    'encrypted_password': base64.urlsafe_b64encode(encrypted_password).decode()
}

# 데이터를 문자열로 변환
packed_data = json.dumps(data_to_share)

# packed_data를 친구에게 전송하거나 저장
print("전송 또는 저장할 데이터:", packed_data)