import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './Login.css'
import {getProfileImage} from "../ProfilePage/ProfileComponents";

function LoginPage({ updateIsAuthorized }) {
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSetUsername = (e) => {
        setUsername(e.target.value);
    };

    const handleSetPassword = (e) => {
        setPassword(e.target.value);
    };

    const location = useLocation();
    const prevURL = location.state?.prevURL;  // 이전 페이지의 URL
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if (isVisible && prevURL === '/signup') {

          const timeoutId = setTimeout(() => {
            setIsVisible(false);
          }, 1000);

          return () => clearTimeout(timeoutId);
        }
      }, [isVisible, prevURL]);

    function handleFindPassword() {
        return;
    }

    const handleLogin = async() => {
        if (!username || !password) {
            alert("All fields are mandatory");
            return;
        }

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username, password: password }),
            });
            // console.log(username, password);

            if (response.ok) {
                // const data = await response.json();
                if (response.status === 200) {
                    const data = await response.json();

                    sessionStorage.setItem('username', data.username);
                    sessionStorage.setItem('createdAt', new Date(data.createdAt).getFullYear());
                    // sessionStorage.setItem('email', data.email);
                    sessionStorage.setItem('myProfileImg', await getProfileImage(data.username));

                    // get friend's profile images
                    const friendInfo = await getFriendList();

                    sessionStorage.setItem('friendList', JSON.stringify(friendInfo.friendList));
                    sessionStorage.setItem('pendingReceivedRequests', JSON.stringify(friendInfo.pendingReceivedRequests));
                    sessionStorage.setItem('pendingSentRequests', JSON.stringify(friendInfo.pendingSentRequests));

                    if (friendInfo.friendList) {
                        for (const user of friendInfo.friendList) {
                            if (!sessionStorage[user]) {
                                sessionStorage.setItem(user, await getProfileImage(user));
                                console.log("got "+user+"'s profile image");
                            }
                        }
                    }

                    if (friendInfo.pendingReceivedRequests) {
                        for (const user of friendInfo.pendingReceivedRequests) {
                            if (!sessionStorage[user]) {
                                sessionStorage.setItem(user, await getProfileImage(user));
                                console.log("got "+user+"'s profile image");
                            }
                        }
                    }

                    console.log("successful login");
                    updateIsAuthorized(true);

                    navigate("/", { replace: true });
                }
            } else if (response.status === 401) {
                alert('Invalid username or password :(');
            } else {
                alert('Log in failed :(');
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleLogin();
        }
    }

    return (
        <div className="login-page">
            <h1>log your memory</h1>

            { isVisible && prevURL === '/signup' && (
            <AnimatePresence mode='wait'>
                <motion.div
                key={isVisible}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, when: "afterChildren" }}
                transition={{ duration: 0.5 }}
                >
                    <h2 className="welcome">Welcome to Log!</h2>
                </motion.div>
            </AnimatePresence>
            )}
             
            { (!isVisible || prevURL !== '/signup') && (
            <AnimatePresence mode='wait'>
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, when: "afterChildren" }}
                transition={{ duration: 0.5 }}
                >
                <div className='login-box'>
                    <h2>Log In</h2>

                    <div className='text-box'>
                        <div className='login-label'>username</div>
                        <input value={username} onChange={(e) => handleSetUsername(e)} className='login-textinput'></input>
                    </div>

                    <div className='text-box'>
                        <div className='login-label'>password</div>
                        <input type="password" value={password} onKeyDown={handleKeyDown} onChange={(e) => handleSetPassword(e)} className='login-textinput'></input>
                    </div>

                    <div className="find-password" onClick={handleFindPassword}>find my username/password</div>
                    
                    <LoginButton handleLogin={handleLogin} />
                </div>

                <Link to={'/signup'} className='signup-link'>
                    <h3>New Here?</h3>
                    <h3>→ Create your account</h3>
                </Link>
                </motion.div>
            </AnimatePresence>
            )}
        </div>
    )
}


function LoginButton({ handleLogin }) {

    return (
        <div className="login-button">
            <div onClick={handleLogin} className="login-link">
                <div>LOGIN</div>
            </div>
        </div>
    )
}

export async function getFriendList() {
    try {
        console.log("fetching friend info")
        const response = await fetch('/get_friend_list', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            // body: JSON.stringify({ username: sessionStorage.getItem('username') })
        });
        if (!response.ok) {
            console.log('Error fetching friend data');
        }
        const data = await response.json();
        console.log(data);
        return {friendList: data.friends, pendingReceivedRequests: data.pending_received_requests, pendingSentRequests: data.pending_sent_requests};
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

export default LoginPage