import React, { useState, useRef } from 'react'
import { Link, useNavigate  } from 'react-router-dom'
import { ArrowLeftOutlined, TeamOutlined, LockOutlined, HeartOutlined, HeartFilled, MessageFilled, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'

export function LogHeader() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className='header-box'>
            <ArrowLeftOutlined className="left-button" onClick={handleGoBack}/>

            <Link to={'/'} class="home-link">
                <h1>log your memory</h1>
            </Link>
        </div>
    )
}


export function DatePublic({ date, isPublic }) {
    return (
        <div className="date-box">
            <h2 className="detail-date">{ date }</h2>

            {isPublic && (
                <TeamOutlined className="detail-icon" />
            )}
            
            {!isPublic && (
                <LockOutlined className="detail-icon" />
            )}
        </div>
    )
}

export function HeartComment({ isPublic, isLiked, setPage, setPrevPage }) {
    const [liked, setLiked] = useState(isLiked);

    const handleHeart = () => {
        setLiked(!liked)
    };

    const handlePageChange = () => {
        setPage('comment')
        setPrevPage('detail')
    };

    return (
        <div className="heart-comment-box">
            {isPublic && (
                <>
                {liked && (
                    <HeartFilled className="heart-icon" onClick={handleHeart} />
                )}
                
                {!liked && (
                    <HeartOutlined className="heart-icon" onClick={handleHeart} />
                )}

                <MessageFilled className="comment-icon" onClick={handlePageChange} />
                </>
            )}
            
            {!isPublic && (
                <></>
            )}
        </div>
    )
}

export function HashTag({ value }) {
    return (
        <p className="hashtag">#{value}</p>
    )
}


export function VideoPlay({url}) {
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
        <div className="video-play">
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

export function Summary({ value }) {
    return (
        <div className="summary-box">
            <p className="summary">{ value }</p>
        </div>
    )
}
