import os
import base64
import shutil

def create_folder(username):
	folder_path = f'data/{username}'
	os.mkdir(folder_path)
	
	bin_file = 'log/web/client/public/bin.txt'
	bin_file_path = f'data/{username}/bin.txt'
	bin_file.save(bin_file_path)


def delete_folder(username):
    try:
        folder_path = f'data/{username}'
        shutil.rmtree(folder_path)
    except Exception as e:
        print(f"Error deleting folder {folder_path}: {e}")
		

def get_image(img_path, image_type):
	with open(img_path, 'rb') as file:
		image_data = base64.b64encode(file.read()).decode('utf-8')
		image_data = 'data:image/' + image_type + ';base64,' + image_data
		return image_data
	

def get_video(video_path):
	try:
		with open(video_path, 'rb') as file:
			video_file = 'data:video/mp4;base64,' + base64.b64encode(file.read()).decode('utf-8')
			
	except Exception as e:
		print(f"Error getting video: {e}")

	return video_file


def get_profile_image(profile_img):
	try:
		with open(profile_img, 'rb') as file:
			image_data = base64.b64encode(file.read()).decode('utf-8')
			image_data = 'data:image/jpg;base64,' + image_data
			return image_data, 200
	
	except Exception as e:
		print(f"Error getting profile image: {e}")
		return 'Error setting profile image', 500
	
		
def get_images(image_list, image_type):
	images = []

	try:
		for img in image_list:
			with open(img, 'rb') as file:
				image_data = base64.b64encode(file.read()).decode('utf-8')
				image_data = 'data:image/' + image_type + ';base64,' + image_data
				images.append(image_data)
	except Exception as e:
		print(f"Error getting images: {e}")
		 
	return images


def save_file(src_file, dst_file):
	try:
		shutil.move(src_file, dst_file)
	except Exception as e:
		print(f"Error saving file: {e}")
