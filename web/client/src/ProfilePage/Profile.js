import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { ProfileImg, ProfileButtons, DeleteAccount } from './ProfileComponents'
import './Profile.css'

function ProfilePage({ imgSrc }) {
    const [isClicked, setIsClicked] = useState(false);

    return (
        <div className="profile-page">
            <AnimatePresence mode='wait'>
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, when: "afterChildren" }}
                transition={{ duration: 0.5 }}
                >

                <h1>my profile</h1>

                <ProfileImg img_src={imgSrc}/>

                <ProfileButtons isClicked={isClicked} setIsClicked={setIsClicked} />

                { isClicked && (
                    <DeleteAccount isClicked={isClicked} setIsClicked={setIsClicked} />
                )}
                
                </motion.div>
            </AnimatePresence>

            <Navigation />
        </div>
    )
}

export default ProfilePage;