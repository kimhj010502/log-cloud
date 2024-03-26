import React, { useState, useRef } from 'react'
import { Link, useNavigate  } from 'react-router-dom'
import { ArrowLeftOutlined, TeamOutlined, LockOutlined, DeleteOutlined, HeartOutlined, HeartFilled, MessageFilled, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'

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


export function DatePublic({ date, isPublic, videoId }) {
    console.log(videoId)

    const handleDelete = () => {

        // POST 요청을 보내고 서버로 데이터 전송
        fetch('/deletePost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({videoId})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete post');
            }
            // 성공적으로 댓글을 게시한 후에 수행할 작업
            console.log('Post deleted successfully');
        })
        .catch(error => {
            console.error('Error deleting post:', error);
        });
    };

    return (
        <div className="date-box">
            <h2 className="detail-date">{ date }</h2>

            {isPublic && (
                <TeamOutlined className="detail-icon" />
            )}
            
            {!isPublic && (
                <LockOutlined className="detail-icon" />
            )}

            <DeleteOutlined className="detail-icon" onClick={handleDelete} />

        </div>
    )
}

export function HeartComment({ isPublic, isLiked, setPage, setPrevPage, sendHeartStatus }) {
    const [liked, setLiked] = useState(isLiked);

    const handleHeart = () => {
        const newLiked = !liked;
        setLiked(newLiked);

        // Send data to backend
        sendHeartStatus(newLiked);
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
