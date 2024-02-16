import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons'

export function ManageFriendsHeader() {
    return (
        <div className='header-box'>
            <Link to={'/profile'} class="profile-link">
                <ArrowLeftOutlined className="left-button"/>
            </Link>
            
                <h1>manage friends</h1>
        </div>
    )
}

export function SearchFriends() {
    const [friendName, setFriendName] = useState(null);
    
    const handlesetFriendName = (e) => {
        setFriendName(e.target.value);
    };

    return (
        <div className='search-friends-box'>
            <Link to={'/search-friends'} state={{ friendName: friendName }} >
                <SearchOutlined className='search-icon' />
            </Link>
            <input value={friendName} onChange={(e) => handlesetFriendName(e)} placeholder='add or search friends' className='search-friends'></input>
        </div>
    )
}

export function PendingRequests() {
    const [isRequests, setIsRequests] = useState(true) //요청이 0개이면 false로 설정

    return (
        <div className='pending-requests-box'>
            <div className='pending-requests-header'>pending requests</div>

            {/* 개수만큼 반복 */}
            { isRequests && (
                <div className='requests-box'>
                    <RequestsProfile img_src='profile.png' id='user1' />
                    <RequestsProfile img_src='profile.png' id='user2' />
                    <RequestsProfile img_src='profile.png' id='user3' />
                    <RequestsProfile img_src='profile.png' id='user4' />
                </div>
            )}

            { !isRequests && (
                <div className='no-request'>팔로우를 요청한 친구가 없습니다.</div>
            )}
        </div>
    )
}

function RequestsProfile({ img_src, id}) {
    return (
        <div className='request-box'>
            <div className="request-img">
                <img className="profile-img" src={img_src} alt="profile img"/>
            </div>

            <div className='request-id'>
                {id}
            </div>

            <div className='accept-box'>
                <div className='accept-button'>Accept</div>
                <div className='middle-line'>|</div>
                <div className='decline-button'>Decline</div>
            </div>
        </div>
    )
}

export function MyFriends() {
    const [isFriends, setIsFriends] = useState(true) //친구가 0명이면 false로 설정

    return (
        <div className='my-friends-box'>
            <div className='my-friends-header'>my friends</div>

            {/* 친구 명수만큼 반복 */}
            { isFriends && (
                <div className='friends-box'>
                    <FriendProfile img_src='profile.png' id='user1' />
                    <FriendProfile img_src='profile.png' id='user2' />
                    <FriendProfile img_src='profile.png' id='user3' />
                    <FriendProfile img_src='profile.png' id='user4' />
                    <FriendProfile img_src='profile.png' id='user5' />
                    <FriendProfile img_src='profile.png' id='user6' />
                </div>
            )}

            { !isFriends && (
                <div className='no-friend'>친구가 없습니다.</div>
            )}
        </div>
    )
}

function FriendProfile({ img_src, id }) {
    return (
        <div className='friend-box'>
            <div className="friend-img">
                <img className="profile-img" src={img_src} alt="profile img"/>
            </div>

            <div className='friend-id'>
                {id}
            </div>

            <div className='delete-button'>×</div>
        </div>
    )
}