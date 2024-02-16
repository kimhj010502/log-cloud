import React from 'react'
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

export function EditHashTag({ value }) {
    return (
        <div className='hashtag-box'>
            <p className="hashtag">#{value}</p>
            <MinusCircleFilled className='remove-hashtag'/>
        </div>
    )
}

export function AddHashTag() {
    return (
        //onclick 추가하기
        <div className='add-hashtag-box'>
            <PlusCircleFilled className='add-hashtag'/>
            <p>해시태그 추가하기</p>
        </div>
    )
}

export function EditSummary({ value }) {
    return (
        <div className="summary-box">
            <textarea value={value} className="summary" />
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
