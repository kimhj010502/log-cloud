import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'

export function ManageFriendsHeader() {
    return (
        <div className='header-box'>
            <Link to={'/profile'} className="profile-link">
                <ArrowLeftOutlined className="left-button"/>
            </Link>
            
                <h1>manage friends</h1>
        </div>
    )
}


export function PendingRequests({ pendingReceivedRequests, pendingSentRequests }) {
    const [isRequests, setIsRequests] = useState(false)

    useEffect(() => {
        if (pendingReceivedRequests){
            setIsRequests(pendingReceivedRequests.length > 0);
        }
    }, [pendingReceivedRequests]);

    return (
        <div className='pending-requests-box'>
            <div className='pending-requests-header'>pending requests</div>

            { isRequests && (
                <div className='requests-box'>
                    {pendingReceivedRequests.map((username, index) => (
                        <RequestsProfile key={index} img_src='profile.png' id={username} />
                    ))}
                </div>
            )}

            { !isRequests && (
                <div className='no-request'>no requests just yet.</div>
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

export function MyFriends({ friendList }) {
    const [isFriends, setIsFriends] = useState(false);
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        if (friendList){
            setIsFriends(friendList.length > 0);
        }
    }, [friendList]);

    return (
        <div className='my-friends-box'>
            <div className='my-friends-header'>my friends</div>

            { isFriends && (
                <div className='friends-box'>
                    {friendList.map((username, index) => (
                        <FriendProfile key={index} img_src='profile.png' id={username} />
                    ))}
                </div>
            )}

            { !isFriends && (
                <div className='no-friend'>search to add your friends!</div>
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


// search result
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