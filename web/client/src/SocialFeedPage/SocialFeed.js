import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { Navigation } from '../AppPage/AppComponents'
import { SocialDetail } from './SocialDetail'
import { SocialComment } from './SocialComment'
import { SocialLike } from './SocialLike'
import Loading from '../Routing/Loading'

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

async function fetchHeart(date, id) {
    try {
        const response = await fetch('/hearts', {
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

function SocialFeedPage({imgSrc}) {
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState('social-detail');
    const [prevPage, setPrevPage] = useState('social-feed');

    const location = useLocation();
    const { date, id, profile_img_src, cover_img_src} = location.state;
    console.log(location.state);

    const [data, setData] = useState([{}]);
    const [heartData, setheartData] = useState([{}]);
    const[like, setLike] = useState([{}]);

    useEffect(() => {
        setLoading(true);
        fetchData(date, id)
            .then(data => {
                console.log("Data", data);
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data', error);
            });
    }, []);

    useEffect(() => {
        fetchHeart(date, id)
            .then(heartData => {
                console.log("Heart data", heartData);
                setheartData(heartData);
            })
            .catch(error => {
                console.error('Error fetching data', error);
            });
        setLike(heartData.is_like);
    }, [prevPage]);


    

    return (
        <>
        {loading ? (
            <Loading />
        ) : (
            <>
            { page === 'social-detail' && (
                <SocialDetail data={data} heartdata={heartData} date={date} username={id} profile={profile_img_src} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} setLike={setLike} />
            )}
            
            { page === 'social-comment' && (
                <SocialComment data={data} heartdata={heartData} date={date} username={id} profile={profile_img_src} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} />
            )}
            { page === 'social-like' && (
                <SocialLike data={data} heartdata={heartData} id={id} profile={profile_img_src} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} />
            )}
            </>
        )}
        <Navigation imgSrc={imgSrc}/>
        </>
    );

};

export default SocialFeedPage;