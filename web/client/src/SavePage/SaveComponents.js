import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, PlayCircleOutlined, PauseCircleOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons'

export function LogDate(handleButtonClick) {
    let date = new Date()
    let nowY = date.getFullYear()
    let nowM = date.getMonth()
    let nowD = date.getDate()

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let currentMonthName = monthNames[nowM]

    return (
        <div className="date-box">
            <Link  to={'/upload'} state={{ prevURL: '/save' }}>
                <ArrowLeftOutlined className="left-button" onClick={handleButtonClick}/>
            </Link>
            
            <h2>{` ${currentMonthName} ${nowD}, ${nowY} `}</h2>
        </div>
    )
}

export function VideoPreview({url}) {
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
    };

    const handleVideoStateChange = () => {
        setIsPlaying(!videoRef.current.paused);
    };


    return (
        <div className="video-preview">
            <video
            ref={videoRef}
            controls={false}
            onPlay={handleVideoStateChange}
            onPause={handleVideoStateChange}
            playsInline>
                <source src={url} type="video/mp4" />
            </video>

            {isPlaying && (
                <PauseCircleOutlined className="play-pause-button" onClick={handlePlayPause}/>
            )}

            {!isPlaying && (
                <PlayCircleOutlined className="play-pause-button" onClick={handlePlayPause}/>
            )}
        </div>
    )
}

export function HashTag({ value }) {
    return (
        <p className="hashtag">#{value}</p>
    )
}


export function Summary({ value }) {
    return (
        <div className="summary-box">
            <p className="summary">{ value }</p>
        </div>
    )
}

export function Scope({ isPublic }) {
    return (
        <div className="scope-box">
            {isPublic && (
                <>
                <TeamOutlined className="scope-icon" />
                <div className="scope-label">친구 공개</div>
                </>
            )}
            
            {!isPublic && (
                <>
                <LockOutlined className="scope-icon" />
                <div className="scope-label">나만 보기</div>
                </>
            )}
        </div>
    )
}

export function EditButton() {
    return (
        <div className="edit-button">
            <Link to={'/edit'} state={{ prevURL: '/save' }} class="edit-link">
                <div>EDIT</div>
            </Link>
        </div>
    )
}
  
export function SaveButton() {
    return (
        <div className="save-button">
            <Link to={'/'} state={{ prevURL: '/save' }} class="save-link">
                <div>SAVE</div>
            </Link>
        </div>
    )
}