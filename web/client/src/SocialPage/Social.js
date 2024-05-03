import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import Loading from '../Routing/Loading'
import { Social } from './SocialComponents'
import './Social.css';

function SocialPage({imgSrc}) {
    const [friendsProfileImg, setFriendsProfileImg] = useState({});

    console.log(sessionStorage.getItem('username'))
    console.log(sessionStorage.getItem('test'))

    useEffect(() => {
    const friendList = JSON.parse(sessionStorage.getItem('friendList')) || [];

    const fetchDataFromSessionStorage = () => {
        const friendData = {};
        friendList.forEach(username => {
            const profileImg = sessionStorage.getItem(username);
            friendData[username] = profileImg;
        });
        setFriendsProfileImg(friendData);
    };

    fetchDataFromSessionStorage();
    }, []);


    const [loading, setLoading] = useState(false);

    const [data, setData] = useState([{}])
    const [isFeed, setIsFeed] = useState(false)
    
    useEffect(() => {
        setLoading(true)
        fetch("/social").then(
            res => res.json()
        ).then(
            data => {
                if (data !== "No one has shared their memories.") {
                    setData(data)
                    console.log(data)
                    setIsFeed(true)
                }
                setLoading(false)
            })
        .catch(error => {
            console.error('Error fetching data', error);
            window.location.reload();
        });
    }, []);
    console.log(data)
    console.log('데이터 개수',Object.keys(data).length)

    return (
        <div className="social-page">
            <Link to={'/'} className="home-link">
                <h1>log your memory</h1>
            </Link>

            {loading ? (
                <Loading />
            ) : (
                !isFeed ? ( // Check if data is empty
                    <h3 className='no-feed'>no one has shared their memories</h3>
                ) : (
                    <AnimatePresence mode='wait'>
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, when: "afterChildren" }}
                        transition={{ duration: 0.5 }}
                        >
                            <div className='socials-box'>
                                {data && data.map((cont) => (
                                    <Social date={cont? cont.date: null} 
                                        id={cont.profileUsername? cont.profileUsername: null}
                                        profile_img_src={sessionStorage.getItem(cont.profileUsername)} //{sessionStorage.getItem(cont.ProfileUsername)? sessionStorage.getItem(cont.ProfileUsername): null}
                                        cover_img_src={cont.coverImg? cont.coverImg: null}  /> 
                                ))
                                }

                                <div className='blank-box'></div>
                            </div>
                            
                        </motion.div>
                        
                    </AnimatePresence>
                    
                )
            )}
        
            <Navigation imgSrc={imgSrc}/>
        </div>

    );
};

export default SocialPage;