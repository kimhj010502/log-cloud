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
                <div className='no-request'>no requests yet..</div>
            )}
        </div>
    )
}

function RequestsProfile({ img_src, id }) {
    function handleAcceptFriendRequest(friend_username) {
        fetch('/accept_friend_request', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "friend_username": friend_username }),
        })
        .then(response => {
            if (response.ok) {
                // remove current <accept-box> tag
                window.location.reload();
            } else {
                console.error('Failed to accept friend request');
            }
        })
        .catch(error => {
            console.error('Error accepting friend request:', error);
        });
    }

    function handleDeclineFriendRequest(friend_username) {
        fetch('/reject_friend_request', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "friend_username": friend_username }),
        })
        .then(response => {
            if (response.ok) {
                // remove current <accept-box> tag
                window.location.reload();
            } else {
                console.error('Failed to reject friend request');
            }
        })
        .catch(error => {
            console.error('Error rejecting friend request:', error);
        });
    }

    return (
        <div className='request-box'>
            <div className="request-img">
                <img className="profile-img" src={img_src} alt="profile img"/>
            </div>

            <div className='request-id'>
                {id}
            </div>

            <div className='accept-box'>
                <div className='accept-button' onClick={() => handleAcceptFriendRequest(id)}>Accept</div>
                <div className='middle-line'>|</div>
                <div className='decline-button' onClick={() => handleDeclineFriendRequest(id)}>Decline</div>
            </div>
        </div>
    )
}

export function MyFriends({ friendList }) {
    const [isFriends, setIsFriends] = useState(false);

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
    function handleRemoveFriend(friend_username) {
        fetch('/remove_friend', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "friend_username": friend_username }),
        })
        .then(response => {
            if (response.ok) {
                // remove current <FriendProfile> tag
                window.location.reload();
            } else {
                console.error('Failed to remove friend');
            }
        })
        .catch(error => {
            console.error('Error removing friend:', error);
        });
    }

    return (
        <div className='friend-box'>
            <div className="friend-img">
                <img className="profile-img" src={img_src} alt="profile img"/>
            </div>

            <div className='friend-id'>
                {id}
            </div>

            <div className='delete-button' onClick={() => handleRemoveFriend(id)}>×</div>
        </div>
    )
}


// search result
export function SearchingMyFriends({ friendList, searchString }) {
    const [isFriends, setIsFriends] = useState(true);
    const [searchResult, setSearchResult] = useState([]);

    useEffect(() => {
        if (friendList){
            // setIsFriends(friendList.length > 0);
            const result = friendList.filter(friend => friend.toLowerCase().includes(searchString.toLowerCase()));
            setSearchResult(result);
            // setIsFriends(result.length > 0)
        }
    }, [friendList, searchString]);

    return (
        <div className='searching-my-friends-box'>
            <div className='searching-my-friends-header'>my friends</div>

            { searchResult.length > 0 ? (
                <div className='searching-friends-box'>
                    {searchResult.map((username, index) => (
                        <FriendProfile key={index} img_src='profile.png' id={username} />
                    ))}
                </div>
            ) : (
                <div className='searching-no-friend'>no user found</div>
            )}
        </div>
    )
}


export function SearchingMoreResults({ searchResult }) {
    const [isMoreResults, setIsMoreResults] = useState(false);

    useEffect(() => {
        if (searchResult){
            setIsMoreResults(searchResult.length > 0);
        }
    }, [searchResult]);

    return (
        <div className='searching-more-results-box'>
            <div className='searching-more-results-header'>more results</div>

            { isMoreResults ? (
                <div className='searching-results-box'>
                    {searchResult.map((username, index) => (
                        <MoreResultProfile key={index} img_src='profile.png' id={username} />
                    ))}
                </div>
            ) : (
                <div className='searching-no-result'>no users found</div>
            )}
        </div>
    );
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