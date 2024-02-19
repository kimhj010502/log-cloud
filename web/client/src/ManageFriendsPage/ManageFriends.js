import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { SearchOutlined } from '@ant-design/icons'
import { ManageFriendsHeader, PendingRequests, MyFriends, SearchingMyFriends, SearchingMoreResults } from './ManageFriendsComponents'
import './ManageFriends.css'

function ManageFriendsPage() {
    const [friendName, setFriendName] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    
    useEffect(() => {
        //검색중인지 확인
        if (friendName !== undefined && friendName != null && friendName != "") {
            setIsSearching(true)
        }
        else {
            setIsSearching(false)
        }
    }, [friendName]);


    const handleSetFriendName = (e) => {
        setFriendName(e.target.value);
        console.log(friendName)
    };

    return (
        <div className="manage-friends-page">
            <AnimatePresence mode='wait'>
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, when: "afterChildren" }}
                transition={{ duration: 0.5 }}
                >

                <ManageFriendsHeader />

                <div className='search-friends-box'>
                    <SearchOutlined className='search-icon' />
                    <input value={friendName} onChange={(e) => handleSetFriendName(e)} placeholder='add or search friends' className='search-friends'></input>
                </div>

                
                {!isSearching && (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, when: "afterChildren" }}
                    transition={{ duration: 0.5 }}
                    >
                        <PendingRequests />
                        <MyFriends />
                    </motion.div>
                )}

                {isSearching && (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, when: "afterChildren" }}
                    transition={{ duration: 0.5 }}
                    >
                        <SearchingMyFriends />
                        <SearchingMoreResults />
                    </motion.div>
                )}
 
                </motion.div>
            </AnimatePresence>

            <Navigation />
        </div>
    )
}

export default ManageFriendsPage