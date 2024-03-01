import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { SocialDetail } from './SocialDetail'
import { SocialComment } from './SocialComment'
import { SocialLike } from './SocialLike'

async function fetchData(date, id) {
    try {
        const response = await fetch('/socialdetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ date, id }),
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Sending data', error);
        throw error;
    }
}

function SocialFeedPage() {
    const location = useLocation();
    const { date, id, profile_img_src, cover_img_src} = location.state;
    console.log(location.state);

    const [data, setData] = useState([{}])

    useEffect(() => {
        fetchData(date, id)
            .then(data => {
                setData(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching data', error);
            });
    }, []);

    const [page, setPage] = useState('social-detail')
    const [prevPage, setPrevPage] = useState('social-feed')

    return (
        <>
            { page === 'social-detail' && (
                <SocialDetail data={data} date={date} username={id} profile={profile_img_src} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} />
            )}
            
            { page === 'social-comment' && (
                <SocialComment data={data} date={date} username={id} profile={profile_img_src} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} />
            )}
            { page === 'social-like' && (
                <SocialLike data={data} id={id} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} />
            )}
        </>
    );

};

export default SocialFeedPage;