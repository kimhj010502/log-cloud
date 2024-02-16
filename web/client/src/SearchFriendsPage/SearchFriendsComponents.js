import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'

export function SearchFriendsHeader() {
    return (
        <div className='header-box'>
            <Link to={'/manage-friends'} class="manage-friends-link">
                <ArrowLeftOutlined className="left-button"/>
            </Link>
            
            <h1>search friends</h1>
        </div>
    )
}

export function SearchingMyFriends() {
    const [isFriends, setIsFriends] = useState(true) //친구가 0명이면 false로 설정

    return (
        <div className='searching-my-friends-box'>
            <div className='searching-my-friends-header'>my friends</div>

            {/* 검색 결과에 맞는 친구 명수만큼 반복 */}
            { isFriends && (
                <div className='searching-friends-box'>
                    <FriendProfile img_src='profile.png' id='user1' />
                    <FriendProfile img_src='profile.png' id='user2' />
                    <FriendProfile img_src='profile.png' id='user3' />
                    <FriendProfile img_src='profile.png' id='user4' />
                    <FriendProfile img_src='profile.png' id='user5' />
                    <FriendProfile img_src='profile.png' id='user6' />
                </div>
            )}

            { !isFriends && (
                <div className='searching-no-friend'>검색한 아이디의 친구가 없습니다.</div>
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

export function SearchingMoreResults() {
    const [isMoreResults, setIsMoreResults] = useState(true) //친구가 0명이면 false로 설정

    return (
        <div className='searching-more-results-box'>
            <div className='searching-more-results-header'>more results</div>

            {/* 검색 결과에 맞는 친구 명수만큼 반복 */}
            { isMoreResults && (
                <div className='searching-results-box'>
                    <MoreResultProfile img_src='profile.png' id='user1' />
                    <MoreResultProfile img_src='profile.png' id='user2' />
                    <MoreResultProfile img_src='profile.png' id='user3' />
                    <MoreResultProfile img_src='profile.png' id='user4' />
                    <MoreResultProfile img_src='profile.png' id='user5' />
                    <MoreResultProfile img_src='profile.png' id='user6' />
                </div>
            )}

            { !isMoreResults && (
                <div className='searching-no-result'>검색한 아이디의 사용자가 없습니다.</div>
            )}
        </div>
    )
}


function MoreResultProfile({ img_src, id }) {
    const [follow, setFollow] = useState(false);

    const handleFollow = () => {
        setFollow(!follow)
    };

    return (
        <div className='searching-result-box'>
            <div className="result-img">
                <img className="profile-img" src={img_src} alt="profile img"/>
            </div>

            <div className='result-id'>
                {id}
            </div>
            
            { follow && (
                <div className='request-sent' onClick={handleFollow}>request sent!</div>
            )}
            { !follow && (
                <div className='follow-button' onClick={handleFollow}>＋</div>
            )}
        </div>
    )
}