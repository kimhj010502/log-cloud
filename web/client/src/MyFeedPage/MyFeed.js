import React, { useState, useEffect } from 'react';
import { MyDetail } from './MyDetail'
import { MyComment } from './MyComment'
import { MyLike } from './MyLike'

function FeedPage() {
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

    const [page, setPage] = useState('detail')
    const [prevPage, setPrevPage] = useState('home')
    
    console.log(prevPage)
    console.log(page)

    return (
        <>
            { page === 'detail' && (
                <MyDetail data={data} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} />
            )}
            
            { page === 'comment' && (
                <MyComment data={data} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} />
            )}
            { page === 'like' && (
                <MyLike data={data} setPage={setPage} prevPage={prevPage} setPrevPage={setPrevPage} />
            )}
        </>
    );

};

export default FeedPage;