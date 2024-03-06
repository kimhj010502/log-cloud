import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import {getProfileImage} from "../ProfilePage/ProfileComponents";

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


export function PendingRequests({ friendList, pendingReceivedRequests, pendingSentRequests }) {
    const [isRequests, setIsRequests] = useState(false);

    useEffect(() => {
        if (pendingReceivedRequests){
            setIsRequests(pendingReceivedRequests.length > 0);
        }
    }, [pendingReceivedRequests]);

    return (
        <div className='pending-requests-box'>
            <div className='pending-requests-header'>pending requests</div>

            { isRequests ? (
                <div className='requests-box'>
                    {pendingReceivedRequests.map((username, index) => (
                        <RequestsProfile friendList={friendList} pendingReceivedRequests={pendingReceivedRequests} key={index} img_src={sessionStorage.getItem(username)} id={username} />
                    ))}
                </div>
            ) : (
                <div className='no-request'>no requests yet..</div>
            )}
        </div>
    )
}

function RequestsProfile({ friendList, pendingReceivedRequests, img_src, id }) {
    async function handleAcceptFriendRequest(friend_username) {
        fetch('/accept_friend_request', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({"friend_username": friend_username}),
        })
            .then(response => {
                if (response.ok) {
                    friendList.push(friend_username);

                    // remove friend_username from pendingReceivedRequests
                    const index = pendingReceivedRequests.indexOf(friend_username);
                    pendingReceivedRequests.splice(index, 1);

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
                // remove friend_username from pendingReceivedRequests
                const index = pendingReceivedRequests.indexOf(friend_username);
                pendingReceivedRequests.splice(index, 1);

                // remove saved friend_username profile image from session storage
                sessionStorage.removeItem(friend_username);

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
    const [updatedFriendList, setUpdatedFriendList] = useState(friendList);

    useEffect(() => {
        if (friendList){
            setIsFriends(friendList.length > 0);
        }
    }, [friendList]);

    const removeFriendTag = (friend_username) => {
        const updatedList = updatedFriendList.filter(username => username !== friend_username);
        setUpdatedFriendList(updatedList);
    }

    return (
        <div className='my-friends-box'>
            <div className='my-friends-header'>my friends</div>

            { isFriends && (
                <div className='friends-box'>
                    {friendList.map((username, index) => (
                        <FriendProfile friendList={friendList} key={index} img_src={sessionStorage.getItem(username)} id={username} onRemove={() => removeFriendTag()} />
                    ))}
                </div>
            )}

            { !isFriends && (
                <div className='no-friend'>search to add your friends!</div>
            )}
        </div>
    )
}

function FriendProfile({ friendList, img_src, id, onRemove }) {
    function handleRemoveFriend(friend_username) {
        // remove friend_username from friendList
        const index = friendList.indexOf(friend_username);
        friendList.splice(index, 1);
        sessionStorage.setItem('friendList', JSON.stringify(friendList));
        // remove saved friend_username profile image from session storage
        sessionStorage.removeItem(friend_username);

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
                // window.location.reload();
                onRemove();
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
                        <FriendProfile key={index} img_src={sessionStorage.getItem(username)} id={username} />
                    ))}
                </div>
            ) : (
                <div className='searching-no-friend'>no user found</div>
            )}
        </div>
    )
}


export function SearchingMoreResults({ searchResult, pendingSentRequests, updatePendingSentRequests }) {
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
                        <MoreResultProfile key={index} img_src={sessionStorage.getItem(username)} id={username} pendingSentRequests={pendingSentRequests} updatePendingSentRequests={updatePendingSentRequests} />
                    ))}
                </div>
            ) : (
                <div className='searching-no-result'>no users found</div>
            )}
        </div>
    );
}


function MoreResultProfile({ img_src, id, request, pendingSentRequests, updatePendingSentRequests }) {
    const [requestSent, setRequestSent] = useState(false);
    const [profileImg, setProfileImg] = useState(img_src);

    useEffect( () => {
        async function fetchProfileImg(){
            try {
                const response = await getProfileImage(id)
                sessionStorage.setItem(id, response);
                setProfileImg(response);
                console.log("got " + id + "'s profile image");
            } catch (error) {
                console.log("Error getting profile image of: " + id);
            }
        }
        if (!profileImg) {
            fetchProfileImg();
        }
    }, [])

    useEffect(() => {
        if (pendingSentRequests.includes(id)) {
            setRequestSent(true);
        }
    }, [pendingSentRequests, id]);

    const handleSendRequest = () => {
        if (!requestSent) {
            console.log("send request");
            setRequestSent(true);

            fetch('/send_friend_request', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "friend_username": id }),
            })
            .then(response => {
                if (response.ok) {
                    updatePendingSentRequests(id, true);
                } else {
                    console.error('Failed to send friend request');
                }
            })
            .catch(error => {
                console.error('Error unsending friend request:', error);
            });

        } else {
            console.log("unsend friend requst");
            setRequestSent(false);

            fetch('/unsend_friend_request', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "friend_username": id }),
            })
            .then(response => {
                if (response.ok) {
                    updatePendingSentRequests(id, false);
                } else {
                    console.log('Failed to unsend friend request');
                }
            })
            .catch(error => {
                console.error('Error sending friend request:', error);
            });
        }
    };

    return (
        <div className='searching-result-box'>
            <div className="result-img">
                <img className="profile-img" src={img_src} alt="profile img"/>
            </div>

            <div className='result-id'>
                {id}
            </div>
            
            { requestSent ? (
                <div className='request-sent' onClick={handleSendRequest}>request sent!</div>
            ) : (
                <div className='follow-button' onClick={handleSendRequest}>＋</div>
            )}
        </div>
    )
}