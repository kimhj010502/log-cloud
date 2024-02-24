import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { SearchOutlined } from '@ant-design/icons'
import { ManageFriendsHeader, PendingRequests, MyFriends, SearchingMyFriends, SearchingMoreResults } from './ManageFriendsComponents'
import './ManageFriends.css'

function ManageFriendsPage() {
    const [friendUsername, setFriendUsername] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    const [friendList, setFriendList] = useState([]);
    const [pendingReceivedRequests, setPendingReceivedRequests] = useState([]);
    const [pendingSentRequests, setPendingSentRequests] = useState([]);

    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        //검색중인지 확인
        if (friendUsername !== "") {
            setIsSearching(true);
        }
        else {
            setIsSearching(false);
        }
    }, [friendUsername]);

    useEffect(() => {
        async function fetchFriendInfo() {
            try {
                const response = await fetch('/get_friend_list', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    // body: JSON.stringify({ username: sessionStorage.getItem('username') })
                });
                if (response.ok) {
                    const data = await response.json();
                    // console.log(data);
                    setFriendList(data.friends);
                    setPendingReceivedRequests(data.pending_received_requests);
                    setPendingSentRequests(data.pending_sent_requests);
                } else {
                    console.log('Error fetching friend data');
                }
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        }
        fetchFriendInfo();
    }, []);

    useEffect(() => {
        async function fetchSearchResult() {
            try {
                const response = await fetch('/search_user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({'searchString': friendUsername}),
                });
                if (response.status===200) {
                    const data = await response.json();
                    // console.log(data);
                    setSearchResult(data.users);
                } else if (response.status===202) {
                    setSearchResult([]);
                } else {
                    console.log('Error fetching friend data');
                    setSearchResult([]);
                }
            } catch (error) {
            console.error('Error fetching data:', error);
            }
        }
        fetchSearchResult();
    }, [friendUsername]);

    const handleSetFriendName = (e) => {
        setFriendUsername(e.target.value);
        // console.log(friendUsername);

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
                    <input value={friendUsername} onChange={(e) => handleSetFriendName(e)} placeholder='add or search friends' className='search-friends'></input>
                </div>

                
                {!isSearching && (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, when: "afterChildren" }}
                    transition={{ duration: 0.5 }}
                    >
                        <PendingRequests pendingReceivedRequests={pendingReceivedRequests} pendingSentRequests={pendingSentRequests} />
                        <MyFriends friendList={friendList} />
                    </motion.div>
                )}

                {isSearching && (
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, when: "afterChildren" }}
                    transition={{ duration: 0.5 }}
                    >
                        <SearchingMyFriends friendList={friendList} searchString={friendUsername} />
                        <SearchingMoreResults searchResult={searchResult} />
                    </motion.div>
                )}
 
                </motion.div>
            </AnimatePresence>

            <Navigation />
        </div>
    )
}

export default ManageFriendsPage