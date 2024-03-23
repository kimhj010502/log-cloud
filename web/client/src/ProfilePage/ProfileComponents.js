import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { CameraFilled } from '@ant-design/icons'
import { getUserInfo } from '../AppPage/AppComponents'


function resizeAndCropImage(file, width, height) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                const canvas = document.createElement('canvas');
                let targetWidth = width;
                let targetHeight = height;
                let offsetX = 0;
                let offsetY = 0;

                // Calculate scaling factor for resizing
                const scaleX = img.width / width;
                const scaleY = img.height / height;

                // Determine which side to scale down and crop
                if (scaleX > scaleY) {
                    targetWidth = img.width / scaleY;
                    offsetX = (targetWidth - width) / 2;
                } else {
                    targetHeight = img.height / scaleX;
                    offsetY = (targetHeight - height) / 2;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, -offsetX, -offsetY, targetWidth, targetHeight);
                canvas.toBlob((blob) => {
                    resolve(new File([blob], file.name, {
                        type: 'image/jpeg', // Change the type if necessary
                        lastModified: Date.now()
                    }));
                }, 'image/jpeg'); // Change the format if necessary
            };
            img.onerror = function(error) {
                reject(error);
            };
        };
        reader.onerror = function(error) {
            reject(error);
        };
    });
}


export async function getProfileImage(username) {
    try {
        const response = await fetch('/get_profile_image', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username}),
        });
        if (response.ok) {
            if (response.status === 200) {
                // const blob = await response.blob();
                // return URL.createObjectURL(blob);
                // console.log(response.body);
                return response;
            }
        } else if (response.status === 404) { // no image set; use default image
            return 'profile.png';
        } else {
            console.log("Error getting profile image:", response);
            return 'profile.png';
        }
    }
    catch (error) {
        console.log("Error getting profile image:", error);
        return 'profile.png';
    }
}


export function ProfileImg() {
    const [username, setUsername] = useState(sessionStorage.getItem('username'));
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = React.useRef(null);
    const [profileImgSrc, setProfileImgSrc] = useState(sessionStorage.getItem('myProfileImg'));
    const [userCreatedAt, setUserCreatedAt] = useState(sessionStorage.getItem('createdAt'));

    useEffect(() => {
        // get user information if it cannot be found in session
        async function fetchData() {
            if (!username || !userCreatedAt) {
                const user = await getUserInfo();

                setUsername(user.username);
                setUserCreatedAt(new Date(user.createdAt).getFullYear());

                sessionStorage.setItem('username', username);
                sessionStorage.setItem('createdAt', userCreatedAt);
            }

            if (!profileImgSrc) {
                const userProfileImage = await getProfileImage(username);
                setProfileImgSrc(userProfileImage);
                sessionStorage.setItem('myProfileImg', userProfileImage);
            }
        }
        fetchData();
    }, [profileImgSrc]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
        setProfileImage(file);
    };

    const handleFileIconClick = React.useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [fileInputRef]);

    async function setProfileImage(imageFile) {
        try {
            const formData = new FormData();

            const resizedImageFile = await resizeAndCropImage(imageFile, 500, 500);

            formData.append('image', resizedImageFile);

            const response = await fetch('/set_profile_image', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (response.ok) {
                const newImage = URL.createObjectURL(resizedImageFile)
                setProfileImgSrc(newImage);
                sessionStorage.setItem('myProfileImg', newImage);
                alert("Successfully uploaded!");
                window.location.reload();
            }
            if (response.status === 500) {
                console.log('Error during photo upload');
                alert("Network error. Please try again later");
            }
            if (response.status === 401) {
                console.log('No image or user found');
                alert("Unable to process image");
            }
        }
        catch (error) {
            console.error('Error during photo upload:', error);
            alert("Error during photo upload");
        }
    }


    return (
        <div className='profile-box'>
            {username ? (
                <>
                    <div className="profile-img-box">
                        <img className="profile-img" src={profileImgSrc} alt="profile image"/>
                    </div>

                    <div className="change-button-box">
                        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange}
                               style={{display: 'none'}}/>
                        <CameraFilled className='change-button' onClick={handleFileIconClick}/>
                    </div>

                    <div className='detail-box'>
                        <div className='username'>{username}</div>
                        <div className='since-when'>logging since {userCreatedAt}</div>
                    </div>
                </>
            ) : (
                <div>Loading user information...</div>
            )}
        </div>
    );
}

async function handleLogout() {
    try {
        const response = await fetch('/logout', {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            console.log('Network response was not ok');
        }
        else {
            const data = await response.json();
            console.log(data);
            sessionStorage.clear();

            console.log("로그인으로 이동")
            window.location.reload();
            console.log("이동 완료")

            // return {username: data.username, createdAt: data.createdAt};
        }

    } catch (error) {
        console.error('Error while logging out:', error);
    }
}


export function ProfileButtons({ isClicked, setIsClicked }) {
    
    const handleDeleteAccountClick = () => {
        setIsClicked(true)
    };

    function handleLogoutClick() {
        handleLogout()
    }

    return (
        <div className='buttons-box'>
            <Link to={'/manage-friends'} className="profile-link" >
                <div className='profile-button'>manage friends</div>
            </Link>

            <Link to={'/change-password'} className='profile-link'>
                <div className='profile-button'>change password</div>
            </Link>

            <div onClick={handleLogoutClick} className='profile-link'>
                <div className='profile-button'>log out</div>
            </div>

            <div className='profile-button delete-button' onClick={handleDeleteAccountClick}>delete my account</div>
        </div>
    )
}


export function DeleteAccount({ isClicked, setIsClicked }) {
    const handleDeleteAccountClick = () => {
        setIsClicked(false)
    };

    const navigate = useNavigate();

    async function deleteUser() {
        try {
            const response = await fetch('/delete_account', {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                alert("Account deleted successfully");
                navigate("/");
            } else {
                alert("Failed to delete account");
            }
        } catch (error) {
            console.error('Error while deleting account:', error);
        }
    }

    return (
        <div className='delete-account-popup'>
            <div className='popup-label'>are you sure you want to<br/>delete your accout?</div>
            <div className='popup-delete-button' onClick={deleteUser}>DELETE ACCOUNT</div>
            <div className='popup-cancel-button' onClick={handleDeleteAccountClick}>CANCEL</div>
        </div>
    )
}