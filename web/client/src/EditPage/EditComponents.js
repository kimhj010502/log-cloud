import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, PlusCircleFilled, MinusCircleFilled } from '@ant-design/icons'

export function LogDate(handleButtonClick, videoInfo) {
    const upload_date = videoInfo.upload_date
    let nowY = upload_date[0]
    let nowM = upload_date[1]
    let nowD = upload_date[2]

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let currentMonthName = monthNames[nowM - 1]

    return (
        <div className="date-box">
            <Link  to={'/save'} state={{ prevURL: '/edit', videoInfo: JSON.stringify(videoInfo), uploadDate: JSON.stringify(upload_date) }}>
                <ArrowLeftOutlined className="left-button" onClick={handleButtonClick}/>
            </Link>
            
            <h2>{` ${currentMonthName} ${nowD}, ${nowY} `}</h2>
        </div>
    )
}

export function EditHashTag({ index, value, onRemove }) {
    return (
        <div className='hashtag-box'>
            <p className="hashtag">#{value}</p>
            <MinusCircleFilled className='remove-hashtag' onClick={() => onRemove(index)} />
        </div>
    )
}

export function AddHashTag({ newHashtag, setNewHashtag, onAdd }) {
    const handleSetNewHashtag = (e) => {
        setNewHashtag(e.target.value);
    };

    return (
        <div className='add-hashtag-box'>
            <PlusCircleFilled className='add-hashtag' onClick={() => onAdd(newHashtag)}/>
            <p className='add-hashtag-tag'>#</p>
            <input type='text' className='add-hashtag-input' value={newHashtag} onChange={(e) => handleSetNewHashtag(e)} placeholder='해시태그 추가하기'></input>
        </div>
    )
}

export function EditSummary({ prevSummary, currentSummary, setCurrentSummary }) {
    useEffect(() => {
        setCurrentSummary(prevSummary);
    }, [prevSummary]);
    
    const handleSetCurrentSummary = (e) => {
        setCurrentSummary(e.target.value);
    };


    return (
        <div className="summary-box">
            <textarea value={currentSummary} onChange={(e) => handleSetCurrentSummary(e)} className="summary" />
        </div>
    )
}


export function UpdateButton({ videoInfo, summary, hashtags, switches }) {
    return (
        <div className="update-button">
            <Link to={'/save'} state={{ prevURL: '/after-edit', videoInfo: JSON.stringify(videoInfo), switches: switches, summary: summary, hashtags: hashtags }} class="update-link">
                <div>UPDATE</div>
            </Link>
        </div>
    )
}
