import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { ManageFriendsHeader, SearchFriends, PendingRequests, MyFriends } from './ManageFriendsComponents'
import './ManageFriends.css'

function ManageFriendsPage() {
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

                <SearchFriends />

                <PendingRequests />

                <MyFriends />
 
                </motion.div>
            </AnimatePresence>

            <Navigation />
        </div>
    )
}

export default ManageFriendsPage