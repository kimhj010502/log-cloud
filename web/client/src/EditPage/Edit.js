import React, { useState, useEffect } from 'react';
import { useNavigate  } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogDate, EditHashTag, AddHashTag, EditSummary, UpdateButton } from './EditComponents'
import './Edit.css';

function Edit() {
    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/generateDetails").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            })
    }, []);


    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        if (!isVisible) {
          setTimeout(() => {
            navigate('/save')
          }, 300);
        }
    }, [isVisible, navigate])
    
    const handleButtonClick = () => {
        setIsVisible(!isVisible)
    }

    return (
        <AnimatePresence>
        {isVisible && (
            <motion.div
            key="visible"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '200%' }}
            transition={{ duration: 0.5 }}
            className="edit-page"
            >
                {LogDate(handleButtonClick)}

                <div className="hashtag-container">
                    {data.hashtags && data.hashtags.map((tag, index) => (
                        <EditHashTag key={index} value={ tag } />
                    ))}
                </div>

                <AddHashTag />

                <EditSummary value={data.summary} />
                
                <UpdateButton />

            </motion.div>
        )}
        </AnimatePresence>
    )
}

export default Edit