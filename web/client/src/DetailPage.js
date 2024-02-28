import React, { useState, useEffect } from 'react';
import './DetailPage.css';
import { Navigation } from "./components/Home";

export function HashTag({ value }) {
    return (
        <p className="hashtag">#{value}</p>
    );
}

function DetailPage() {
    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/logdetail"). then(
            res => res.json()
        ). then(
            data => {
                setData(data)
                console.log(data)
            })
    }, []);

    return (
        <div className="body">
            <h1>log your memory</h1>
            <div className="container">
                {Object.keys(data).length === 0 ? ( // Check if data is empty
                    <h2>Loading...</h2>
                ) : (
                    <>
                        <h2>{data.date}</h2>
                        <img src={data.image} alt="Cover Image" className="full-coverimage"/>
                        <div className="hashtag-container">
                            {data.hashtags && data.hashtags.map((tag, index) => (
                                <HashTag key={index} value={ tag } />
                            ))}
                        </div>
                        <p className="summary">{data.summary}</p>
                    </>
                )}
            </div>

            <Navigation />
        </div>

    );

};

export default DetailPage;