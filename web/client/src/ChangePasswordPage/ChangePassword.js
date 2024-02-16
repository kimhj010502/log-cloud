import { Link } from 'react-router-dom'
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Navigation } from '../AppPage/AppComponents'
import './ChangePassword.css'

function ChangePasswordPage() {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword1, setNewPassword1] = useState("");
    const [newPassword2, setNewPassword2] = useState("");

    const handleSetCurrentPassword = (e) => {
        setCurrentPassword(e.target.value);
    };

    const handleSetNewPassword1 = (e) => {
        setNewPassword1(e.target.value);
    };

    const handleSetNewPassword2 = (e) => {
        setNewPassword2(e.target.value);
    };

    const handleSave = async() => {
    }

    return (
        <div className="change-password-page">
            <AnimatePresence mode='wait'>
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, when: "afterChildren" }}
                transition={{ duration: 0.5 }}
                >

                <div className='header-box'>
                    <Link to={'/profile'} class="profile-link">
                        <ArrowLeftOutlined className="left-button"/>
                    </Link>
                    
                    <h1>my profile</h1>
                </div>

                <div className='change-password-box'>
                    <h2>change password</h2>

                    <div className='text-box'>
                        <div className='password-label'>current<br/>password</div>
                        <input type="password" value={currentPassword} onChange={(e) => handleSetCurrentPassword(e)} className='password-textinput'></input>
                    </div>

                    <div className='text-box'>
                        <div className='password-label'>new<br/>password</div>
                        <input type="password" value={newPassword1} onChange={(e) => handleSetNewPassword1(e)} className='password-textinput'></input>
                    </div>

                    <div className='text-box'>
                        <div className='password-label'>confirm<br/>password</div>
                        <input type="password" value={newPassword2} onChange={(e) => handleSetNewPassword2(e)} className='password-textinput'></input>
                    </div>
                    
                    <SaveButton  handleSave={handleSave} />
                </div>
   
                </motion.div>
            </AnimatePresence>

            <Navigation />
        </div>
    )
}

function SaveButton({ handleSave }) {
    return (
        <div className="save-button">
            <div onClick={handleSave} className="save-link">
                <div>SAVE</div>
            </div>
        </div>
    )
}

export default ChangePasswordPage