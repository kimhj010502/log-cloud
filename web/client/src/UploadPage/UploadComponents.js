import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeftOutlined, PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons'
import Switch, { switchClasses } from '@mui/joy/Switch';

export function LogDate(handleButtonClick) {
    let date = new Date()
    let nowY = date.getFullYear()
    let nowM = date.getMonth()
    let nowD = date.getDate()

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let currentMonthName = monthNames[nowM]

    return (
        <div className="date-box">
            <Link  to={'/record'} state={{ prevURL: '/upload' }}>
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


function ToggleSwitch({ label, onChange, checked }) {
    return (
        <div className="toggle-switch-box">
            <div className="toggle-label">{label}</div>
            <div className="toggle-switch">
                <Switch
                    checked={checked}
                    onChange={onChange}
                    sx={(theme) => ({
                    '--Switch-thumbShadow': '0 3px 7px 0 rgba(0 0 0 / 0.12)',
                    '--Switch-thumbSize': '27px',
                    '--Switch-trackWidth': '70px',
                    '--Switch-trackHeight': '31px',
                    '--Switch-trackBackground': 'rgb(217,217,217)',
                    [`& .${switchClasses.thumb}`]: {
                        transition: 'width 0.2s, left 0.2s',
                    },
                    '&:hover': {
                        '--Switch-trackBackground': 'rgb(217,217,217)',
                    },
                    '&:active': {
                        '--Switch-thumbWidth': '32px',
                    },
                    [`&.${switchClasses.checked}`]: {
                        '--Switch-trackBackground': 'rgb(75,75,75)',
                        '&:hover': {
                        '--Switch-trackBackground': 'rgb(75,75,75)',
                        },
                    },
                    })}
                />
            </div>
      </div>
    );
}
  
export function Toggle() {
    const [switches, setSwitches] = useState({
        bgm: false,
        summary: false,
        hashtag: false,
        public: false,
    });
  
    const handleSwitchChange = (id) => (event) => {
        setSwitches((prevSwitches) => ({
            ...prevSwitches,
            [id]: event.target.checked,
        }));
    };
  
    return (
        <div className="toggle-box">
            <ToggleSwitch
                id="summary"
                label="요약 설명"
                onChange={handleSwitchChange('summary')}
                checked={switches.summary}
            />
            <ToggleSwitch
                id="hashtag"
                label="해시태그&nbsp;"
                onChange={handleSwitchChange('hashtag')}
                checked={switches.hashtag}
            />
            <ToggleSwitch
                id="bgm"
                label="배경 음악"
                onChange={handleSwitchChange('bgm')}
                checked={switches.bgm}
            />
            <ToggleSwitch
                id="public"
                label="전체 공개"
                onChange={handleSwitchChange('public')}
                checked={switches.public}
            />
        </div>
    );
}



export function SelectEmotion() {
    const [emotion, setEmotion] = useState(null);
    const handleItemClick = (index) => {
        setEmotion(index);
    };

    return (
        <div className="emotion-box">
            <div 
            className={`emotion-component ${emotion === '0' ? 'selected' : ''}`}
            onClick={() => handleItemClick('0')}
            style={{ borderLeft: 'none', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px'}}>
            🥰
            </div>

            <div 
            className={`emotion-component ${emotion === '1' ? 'selected' : ''}`}
            onClick={() => handleItemClick('1')}>
            😆
            </div>

            <div 
            className={`emotion-component ${emotion === '2' ? 'selected' : ''}`}
            onClick={() => handleItemClick('2')}>
            🙂
            </div>

            <div 
            className={`emotion-component ${emotion === '3' ? 'selected' : ''}`}
            onClick={() => handleItemClick('3')}>
            😐
            </div>

            <div 
            className={`emotion-component ${emotion === '4' ? 'selected' : ''}`}
            onClick={() => handleItemClick('4')}>
            🙁
            </div>

            <div 
            className={`emotion-component ${emotion === '5' ? 'selected' : ''}`}
            onClick={() => handleItemClick('5')}>
            😠
            </div>

            <div 
            className={`emotion-component ${emotion === '6' ? 'selected' : ''}`}
            onClick={() => handleItemClick('6')}
            style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px'}}>
            😵
            </div>
        </div>
    )
}


export function NextButton() {
    return (
        <div className="next-button">
            <Link to={'/save'} state={{ prevURL: '/upload' }} className="next-link">
                <div>NEXT</div>
            </Link>
        </div>
    )
}