import React, { useState, useEffect } from 'react';
import { MyDetail } from './MyDetail'
import { MyComment } from './MyComment'
import { MyLike } from './MyLike'
import {useLocation} from "react-router-dom";

function FeedPage() {
    const { state } = useLocation();
    const [data, setData] = useState([{}])

    // console.log(state);

    useEffect(() => {

        const fetchData = async() => {
            // POST request to get video details
            try {
                const response = await fetch('/logdetail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({videoId: state.videoId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setData(data);
                    console.log(data);
                } else {
                    console.error('Error fetching log-detail api : ', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching log-detail api:', error);
            }
        };
        if (state && state.videoId) {
            fetchData();
        }
    }, [state]);


    const [page, setPage] = useState('detail')
    const [prevPage, setPrevPage] = useState('home')

    if (!data) {
        return <div>Loading...</div>;
    }

    // console.log(prevPage)
    // console.log(page)

    return (
        <>
            {page === 'detail' && (
                <MyDetail data={data} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage}/>
            )}

            {page === 'comment' && (
                <MyComment data={data} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage}/>
            )}
            {page === 'like' && (
                <MyLike data={data} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage}/>
            )}
        </>
    );

};

export default FeedPage;