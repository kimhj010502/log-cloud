import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, PlayCircleOutlined, PauseCircleOutlined, TeamOutlined, LockOutlined } from '@ant-design/icons'

export function LogDate(handleButtonClick, videoInfo) {
    const upload_date = videoInfo.upload_date
    let nowY = upload_date[0]
    let nowM = upload_date[1]
    let nowD = upload_date[2]

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let currentMonthName = monthNames[nowM - 1]

    return (
        <div className="date-box">
            <Link  to={'/upload'} state={{ prevURL: '/save', videoInfo: JSON.stringify(videoInfo), uploadDate: JSON.stringify(upload_date) }}>
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

export function EditButton({ videoInfo, summary, hashtags, switches }) {
    console.log('edit 버튼 클릭', JSON.stringify(videoInfo))
    return (
        <div className="edit-button">
            <Link to={'/edit'} state={{ prevURL: '/save', videoInfo: JSON.stringify(videoInfo), switches: switches, summary: summary, hashtags: hashtags } } className="edit-link">
                <div>EDIT</div>
            </Link>
        </div>
    )
}
  
export function SaveButton({ handleSave }) {
    return (
        <div className="save-button">
            {/* <Link to={'/'} state={{ prevURL: '/save' }} className="save-link"> */}
                <div className="save-link" onClick={handleSave} >SAVE</div>
            {/* </Link> */}
        </div>
    )
}