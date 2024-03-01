import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import Loading from '../Routing/Loading'
import { Social } from './SocialComponents'
import './Social.css';

function SocialPage() {
    const [loading, setLoading] = useState(false);

    const [data, setData] = useState([{}])
    useEffect(() => {
        setLoading(true)
        fetch("/social").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
                setLoading(false)
            })
        .catch(error => {
            console.error('Error fetching data', error);
        });
    }, []);

    return (
        <div className="social-page">
            <Link to={'/'} class="home-link">
                <h1>log your memory</h1>
            </Link>

            {loading ? (
                <Loading />
            ) : (
                Object.keys(data).length === 0 ? ( // Check if data is empty
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
                            {data && data.map((cont) => (
                            <Social date={cont? cont.date: null} 
                                id={cont.profileUsername? cont.profileUsername: null}
                                profile_img_src={cont.profileImg? cont.profileImg: null}
                                cover_img_src={cont.coverImg? cont.coverImg: null}  /> 
                            ))
                            }
                            </div>
                            
                        </motion.div>
                    </AnimatePresence>
                )
            )}
        
            <Navigation />
        </div>

    );
};

export default SocialPage;