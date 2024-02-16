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


    //해시태그 삭제
    const [hashtags, setHashtags] = useState(data.hashtags);
    
    useEffect(() => {
        setHashtags(data.hashtags)
    }, [data]);
    
    const onRemove = (index) => {
        const newHashtags = [...hashtags.slice(0, index), ...hashtags.slice(index + 1)]
        setHashtags(newHashtags)
    }


    //해시태그 추가
    const [newHashtag, setNewHashtag] = useState();

    const onAdd = (newHashtag) => {
        const newHashtags = [...hashtags, newHashtag]
        setHashtags(newHashtags)
        setNewHashtag('')
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
                    {hashtags && hashtags.map((tag, index) => (
                        index !== 0 ? (
                            <EditHashTag index={index} value={tag} onRemove={onRemove} />
                        ) : null
                    ))}
                </div>

                <AddHashTag newHashtag={newHashtag} setNewHashtag={setNewHashtag} onAdd={onAdd} />

                <EditSummary prevSummary={data.summary} />
                
                <UpdateButton />

            </motion.div>
        )}
        </AnimatePresence>
    )
}

export default Edit