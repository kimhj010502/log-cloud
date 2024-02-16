import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CameraFilled } from '@ant-design/icons'


export function ProfileImg({ img_src }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = React.useRef(null);

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
            <div className="profile-img-box">
                <img className="profile-img" src={img_src} alt="profile img"/>
            </div>

            <div className="change-button-box">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
                <CameraFilled className='change-button' onClick={handleFileIconClick}/>
            </div>

            <div className='detail-box'>
                <div className='username'>username</div>
                <div className='since-when'>logging since 2023</div>
            </div>
        </div>
    )
}

export function ProfileButtons({ isClicked, setIsClicked }) {
    const handleDeleteAccountClick = () => {
        setIsClicked(true)
    };

    return (
        <div className='buttons-box'>
            <Link to={'/manage-friends'} class="profile-link">
                <div className='profile-button'>manage friends</div>
            </Link>

            <Link to={'/change-password'} class='profile-link'>
                <div className='profile-button'>change password</div>
            </Link>

            <Link to={'/login'} class='profile-link'>
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

    return (
        <div className='delete-account-popup'>
            <div className='popup-label'>are you sure you want to<br/>delete your accout?</div>
            <div className='popup-delete-button'>DELETE ACCOUNT</div>
            <div className='popup-cancel-button' onClick={handleDeleteAccountClick}>CANCEL</div>
        </div>
    )
}