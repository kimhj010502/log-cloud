import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { Social } from './SocialComponents'
import './Social.css';

function SocialPage() {
    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/socialdetail").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            })
    }, []);

    return (
        <div className="social-page">
            <Link to={'/'} class="home-link">
                <h1>log your memory</h1>
            </Link>

            {Object.keys(data).length === 0 ? ( // Check if data is empty
                <h2>Loading...</h2>
            ) : (
                <AnimatePresence mode='wait'>
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, when: "afterChildren" }}
                    transition={{ duration: 0.5 }}
                    >
                        <div className='socials-box'>
                            <Social date={data.date} id="test_id" profile_img_src="profile.png" cover_img_src="test_image.jpg" />
                            <Social date={data.date} id="test_id" profile_img_src="profile.png" cover_img_src="test_image.jpg" />
                        </div>
                        
                    </motion.div>
                </AnimatePresence>
            )}
            <Navigation />
        </div>

    );

};

export default SocialPage;