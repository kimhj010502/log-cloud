import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeftOutlined } from '@ant-design/icons'
import './Signup.css'

function SignupPage() {
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const navigate = useNavigate();

    const handleSetEmail = (e) => {
        setEmail(e.target.value);
    };

    const handleSetUsername = (e) => {
        setUsername(e.target.value);
        setIsUsernameAvailable(false); // reset availability status if value is changed
    };

    const handleSetPassword1 = (e) => {
        setPassword1(e.target.value);
    };

    const handleSetPassword2 = (e) => {
        setPassword2(e.target.value);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSignup();
        }
    }

    const handleCheckAvailability = async() => {
        const response = await fetch(`/check_username_availability?username=${username}`);
        const data = await response.json();
        if (data.available === true) {
            setIsUsernameAvailable(true);
            alert("Username available!");
        }
    };

    const handleSignup = async() => {
        if (password1 !== password2) {
            alert("Passwords do not match");
            return;
        }

        if (!isUsernameAvailable) {
            alert("Check username availability");
            return;
        }

        if (!username || !email || !password1 || !password2)
        {
            alert("All fields are mandatory");
            return;
        }

        if (username && email && password1 && password2) {
            try {
                const response = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: username, email: email, password: password1 }),
                });

                if (response.ok) {
                    // history.push('/login');
                    navigate("/login");
                } else {
                    alert('Sign Up failed :(');
                }
            } catch (error) {
                console.error('Error signing up:', error);
            }
        }

    };

    const handleGoBack = () => {
        navigate("/login");
    };


    return (
        <div className="signup-page">
        <AnimatePresence mode='wait'>
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, when: "afterChildren" }}
            transition={{ duration: 0.5 }}
            >
            
            
            <div className='header-box'>
                <ArrowLeftOutlined className="left-button" onClick={handleGoBack}/>

                <h1>log your memory</h1>
            </div>


            <div className='signup-box'>
                <h2>Create Account</h2>

                <div className='text-box'>
                    <div className='signup-label'>Email</div>
                    <input value={email} onChange={(e) => handleSetEmail(e)} className='signup-textinput'></input>
                </div>

                <div className='text-box'>
                    <div className='signup-label'>username</div>
                    <input value={username} onChange={(e) => handleSetUsername(e)} className='username-textinput'></input>
                    <div className='check-username' onClick={handleCheckAvailability}>check</div>
                </div>

                <div className='text-box'>
                    <div className='signup-label'>password</div>
                    <input type="password" value={password1} onChange={(e) => handleSetPassword1(e)} className='signup-textinput'></input>
                </div>

                <div className='text-box'>
                    <div className='signup-label confirm-password'>confirm<br/>password</div>
                    <input type="password" value={password2} onKeyDown={handleKeyDown} onChange={(e) => handleSetPassword2(e)} className='signup-textinput'></input>
                </div>
                
                <SignupButton  handleSignup={handleSignup} />
            </div>
            </motion.div>
        </AnimatePresence>
        </div>
    )
}

function SignupButton({ handleSignup }) {
    return (
        <div className="signup-button">
            <div onClick={handleSignup} className="signup-link">
                <div>SIGN UP</div>
            </div>
        </div>
    )
}

export default SignupPage