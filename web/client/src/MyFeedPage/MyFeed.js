import React, { useState, useEffect } from 'react';
import { Navigation } from '../AppPage/AppComponents'
import { MyDetail } from './MyDetail'
import { MyComment } from './MyComment'
import { MyLike } from './MyLike'
import {useLocation} from "react-router-dom";
import Loading from '../Routing/Loading'


async function fetchData(videoId) {
    try {
        const response = await fetch('/logdetail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoId }),
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Sending data', error);
        throw error;
    }
}


async function fetchHeart(videoId) {
    try {
        const response = await fetch('/log_hearts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ videoId }),
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Sending data', error);
        throw error;
    }
}


function FeedPage() {
    const { state } = useLocation();
    const [page, setPage] = useState('detail')
    const [prevPage, setPrevPage] = useState('home')
    const [loading, setLoading] = useState(false);
    
    const [data, setData] = useState([{}]);
    const [heartData, setheartData] = useState([{}]);
    const[like, setLike] = useState([{}]);

    useEffect(() => {
        setLoading(true);
        fetchData(state.videoId)
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
        fetchHeart(state.videoId)
            .then(heartData => {
                console.log("Heart data", heartData);
                setheartData(heartData);
            })
            .catch(error => {
                console.error('Error fetching data', error);
            });
        setLike(heartData.is_like);
    }, [prevPage]);




    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <>
        {loading ? (
            <Loading />
        ) : (
            <>
            {page === 'detail' && (
                <MyDetail data={data} heartdata={heartData} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} setLike={setLike}/>
            )}

            {page === 'comment' && (
                <MyComment data={data} heartdata={heartData} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage}/>
            )}
            {page === 'like' && (
                <MyLike data={data} heartdata={heartData} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage}/>
                )}
                </>
            )}
            
            <Navigation imgSrc={sessionStorage.getItem('myProfileImg')} />
            </>
        );
    
    };

export default FeedPage;