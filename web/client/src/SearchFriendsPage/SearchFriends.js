import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { SearchFriends } from '../ManageFriendsPage/ManageFriendsComponents'
import { SearchFriendsHeader, SearchingMyFriends, SearchingMoreResults } from './SearchFriendsComponents'
import './SearchFriends.css'

function SearchFriendsPage() {
    const location = useLocation();
    const friendName = location.state?.friendName; //검색한 아이디
    console.log(friendName);

    return (
        <div className="search-friends-page">
            <AnimatePresence mode='wait'>
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, when: "afterChildren" }}
                transition={{ duration: 0.5 }}
                >

                <SearchFriendsHeader />

                <SearchFriends />

                <SearchingMyFriends />

                <SearchingMoreResults />
                
                </motion.div>
            </AnimatePresence>

            <Navigation />
        </div>
    )
}

export default SearchFriendsPage