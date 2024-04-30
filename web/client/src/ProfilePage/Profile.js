import React, {useEffect, useState} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import {ProfileImg, ProfileButtons, DeleteAccount, getProfileImage} from './ProfileComponents'
import './Profile.css'
import {getFriendList} from "../LoginPage/Login";

function ProfilePage({ imgSrc }) {
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        const checkFriendUpdates = async () => {
            try {
                // get friend's profile images
                const friendInfo = await getFriendList();

                sessionStorage.setItem('friendList', JSON.stringify(friendInfo.friendList));
                sessionStorage.setItem('pendingReceivedRequests', JSON.stringify(friendInfo.pendingReceivedRequests));
                sessionStorage.setItem('pendingSentRequests', JSON.stringify(friendInfo.pendingSentRequests));

                if (friendInfo.friendList) {
                    for (const user of friendInfo.friendList) {
                        if (!sessionStorage[user]) {
                            sessionStorage.setItem(user, await getProfileImage(user));
                            console.log("got " + user + "'s profile image");
                        }
                    }
                }

                if (friendInfo.pendingReceivedRequests) {
                    for (const user of friendInfo.pendingReceivedRequests) {
                        if (!sessionStorage[user]) {
                            sessionStorage.setItem(user, await getProfileImage(user));
                            console.log("got " + user + "'s profile image");
                        }
                    }
                }
            } catch (error) {
                console.error('Error checking for friend updates:', error);
            }
        };
        checkFriendUpdates()
    }, []);

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

                <ProfileImg imgSrc={imgSrc}/>

                <ProfileButtons isClicked={isClicked} setIsClicked={setIsClicked} />

                { isClicked && (
                    <DeleteAccount isClicked={isClicked} setIsClicked={setIsClicked} />
                )}
                
                </motion.div>
            </AnimatePresence>

            <Navigation imgSrc={imgSrc} />
        </div>
    )
}

export default ProfilePage;