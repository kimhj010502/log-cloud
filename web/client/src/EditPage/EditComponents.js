import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, PlusCircleFilled, MinusCircleFilled } from '@ant-design/icons'

export function LogDate(handleButtonClick) {
    let date = new Date()
    let nowY = date.getFullYear()
    let nowM = date.getMonth()
    let nowD = date.getDate()

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let currentMonthName = monthNames[nowM]

    return (
        <div className="date-box">
            <Link  to={'/save'} state={{ prevURL: '/edit' }}>
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

export function EditSummary({ prevSummary }) {
    const [currentSummary, setCurrentSummary] = useState(prevSummary);

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


export function UpdateButton() {
    return (
        <div className="update-button">
            <Link to={'/save'} state={{ prevURL: '/after-edit' }} class="update-link">
                <div>UPDATE</div>
            </Link>
        </div>
    )
}
