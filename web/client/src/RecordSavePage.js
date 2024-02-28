import React, { useState, useEffect } from 'react';
import './DetailPage.css';
import { Navigation } from "./components/Home";
import { HashTag } from "./DetailPage";


function SaveButton() {
    return <button>SAVE</button>;
}

function RecordSavePage() {
    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/generateDetails"). then(
            res => res.json()
        ). then(
            data => {
                setData(data)
                console.log(data)
            })
    }, []);

    return (
        <div className="body">
            <div className="container">
                {Object.keys(data).length === 0 ? ( // Check if data is empty
                    <h2>Loading...</h2>
                ) : (
                    <>
                        <h2>{data.date}</h2>
                        <img src={data.image} alt="Cover Image" className="small-coverimage"/>
                        <div className="hashtag-container">
                            {data.hashtags && data.hashtags.map((tag, index) => (
                                <HashTag key={index} value={ tag } />
                            ))}
                        </div>
                        <p className="summary">{data.summary}</p>
                        <div className="privacy">
                            <img src="privacy/icon" className="icon" />
                            <p>{data.privacy}</p>
                        </div>

                    </>
                )}
            </div>
            <div className="button-container">
                <SaveButton />
            </div>
            <Navigation />
        </div>
    );
};

export default RecordSavePage;