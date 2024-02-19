import React, {useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { CameraFilled } from '@ant-design/icons'
import { getUserInfo } from '../AppPage/AppComponents'

export function ProfileImg({img_src}) {
    const [user, setUser] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = React.useRef(null);

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

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
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
                        <img className="profile-img" src={img_src} alt="profile img"/>
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