import React, { useState, useEffect } from 'react';
import { SocialDetail } from './SocialDetail'
import { SocialComment } from './SocialComment'
import { SocialLike } from './SocialLike'

function SocialFeedPage() {
    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/logdetail").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            })
    }, []);

    const [page, setPage] = useState('social-detail')
    const [prevPage, setPrevPage] = useState('social-feed')

    return (
        <>
            { page === 'social-detail' && (
                <SocialDetail data={data} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} />
            )}
            
            { page === 'social-comment' && (
                <SocialComment data={data} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} />
            )}
            { page === 'social-like' && (
                <SocialLike data={data} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} />
            )}
        </>
    );

};

export default SocialFeedPage;