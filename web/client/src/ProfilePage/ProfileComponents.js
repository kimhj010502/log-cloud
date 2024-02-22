import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { CameraFilled } from '@ant-design/icons'
import { getUserInfo } from '../AppPage/AppComponents'
import ProfilePage from "./Profile";

export async function setProfileImage(imageFile) {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch('/set_profile_image', {
            method: 'POST',
            credentials: 'include',
            body: formData,
        }).then(response => {
                console.log(response)
                if (response.status === 200) {
                    alert("Successfully uploaded image");
                }
                if (response.status === 500) {
                    alert("Network error. Please try again later");
                    console.log('Error during photo upload');
                }
                if (response.status === 401) {
                    alert("Unable to process image");
                    console.log('No image or user found');
                }
            });
        }
    catch (error) {
        console.error('Error during video upload:', error);
    }
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
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            }
        } else if (response.status === 404) { // no image set; use default image
            // return process.env.PUBLIC_URL + '/images/default.jpg';
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

export function ProfileImg({ username }) {
    const [user, setUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = React.useRef(null);
    const [profileImgSrc, setProfileImgSrc] = useState(null);

    useEffect(() => {
        async function fetchUserData() {
            try {
                const userInfo = await getUserInfo();
                setUser(userInfo);
            } catch (error) {
                console.error('Error fetching user info for profile page:', error);
            }
        }
        fetchUserData();
    }, []);

    useEffect(() => {
        async function fetchUserProfileImage() {
            try {
                if (user) {
                    const userProfileImage = await getProfileImage(user.username);
                    // change displayed profile image
                    setProfileImgSrc(userProfileImage);
                }
            } catch (error) {
                console.error('Error fetching user info for profile page:', error);
            }
        }
        fetchUserProfileImage();
    }, [user]);

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


    return (
        <div className='profile-box'>
            {user ? (
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
                        <div className='username'>{user.username}</div>
                        <div className='since-when'>logging since {new Date(user.createdAt).getFullYear()}</div>
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
            // console.log('Logging out...');
            console.log(data);
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

    return (
        <div className='buttons-box'>
            <Link to={'/manage-friends'} className="profile-link">
                <div className='profile-button'>manage friends</div>
            </Link>

            <Link to={'/change-password'} className='profile-link'>
                <div className='profile-button'>change password</div>
            </Link>

            <Link to={'/login'} onClick={handleLogout} className='profile-link'>
                <div className='profile-button'>log out</div>
            </Link>

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