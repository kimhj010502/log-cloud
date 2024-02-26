import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PictureOutlined, PictureFilled, SyncOutlined } from '@ant-design/icons'
import Webcam from 'react-webcam';
import Loading from '../Routing/Loading'


//카메라 화면
const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
    facingMode: FACING_MODE_USER
};

//접속 기기 및 브라우저 확인
export function checkBrowser() {
    // 안드로이드 모바일 기기인 경우 webm 지정
    if (/Android/i.test(navigator.userAgent)) {
        return ['android', 'webm']
    }
    // ios 모바일 기기인 경우 mp4 지정
    else if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        return ['ios', 'mp4']
    }
    // Windows 의 Chrome 브라우저인 경우 webm 지정
    else if (navigator.userAgent.indexOf("Chrome") > -1) {
        return ['chrome', 'webm']
    }
    // Mac OS 의 Safari 브라우저인 경우 mp4 지정
    else if (navigator.userAgent.indexOf("Safari") > -1) {
        return ['safari', 'mp4']
    }
}

export function CameraRecord() {
    const [loading, setLoading] = useState(false);


    //카메라 전환
    const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);
    const [mirrorMode, setMirrorMode] = React.useState(false);

    const handleClick = React.useCallback(() => {
        setFacingMode(
            prevState =>
                prevState === FACING_MODE_USER
                    ? FACING_MODE_ENVIRONMENT
                    : FACING_MODE_USER
        );
    }, []);

    useEffect(() => {
        setMirrorMode(!mirrorMode);
    }, [facingMode])
    

    let [name, videoType] = ['', '']
    useEffect(() => {
        [name, videoType] = checkBrowser()
    }, [])

    //영상 녹화
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [recording, setRecording] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
  
    const handleStartRecordClick = React.useCallback(() => {
        setRecording(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: `video/${videoType}`
        });
        mediaRecorderRef.current.addEventListener(
            "dataavailable",
            handleDataAvailable
        );
        mediaRecorderRef.current.start();
    }, [webcamRef, setRecording, mediaRecorderRef]);
  
    const handleDataAvailable = React.useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );
  

    const handleStopRecordClick = React.useCallback(() => {
        mediaRecorderRef.current.stop();
        setRecording(false);
    }, [mediaRecorderRef, webcamRef, setRecording]);
  


    //동영상 업로드 (갤러리)
    const [selectedVideo, setSelectedVideo] = useState(null);
    const fileInputRef = React.useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedVideo(file);
        console.log(selectedVideo)
    };

    useEffect(() => {
        // selectedVideo가 변경되었을 때만 uploadButton.click()을 호출
        const uploadButton = document.querySelector('.upload-button .upload-link');
        if (uploadButton && selectedVideo) {
            uploadButton.click();
        }
    }, [selectedVideo]);

    const handleFileIconClick = React.useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [fileInputRef]);

    const [videoInfo, setVideoInfo] = useState(null);
    const navigate = useNavigate();

    function wait(seconds) {
        return new Promise(resolve => {
            setTimeout(resolve, seconds * 1000);
        });
    }
    

    //영상 서버에 업로드
    const handleUpload = async (selectedVideo) => {
        console.log("버튼 클릭")

        if (selectedVideo) {
            console.log("영상 있음")
            const formData = new FormData();
            formData.append('video', selectedVideo);

            try {
                setLoading(true)
                const response = await fetch('/record', {
                    method: 'POST',
                    headers: {},
                    body: formData,
                })
                
                if (response.ok) {
                    console.log(response)
                    if (response.status === 200) {
                        const data = await response.json();
                        setLoading(false)
                        navigate('/upload', { state: { prevURL: '/record', videoInfo: JSON.stringify(data.video_info) } });
                    }
                    if (response.status === 400) {
                        console.log('Error during video upload: 400');
                    }
                }
            } 
            catch (error) {
                console.err('Error during video upload:', error);
            }
        } 

        else if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, { type: "video/mp4" });
            const formData = new FormData();
            formData.append('video', blob);

            console.log('영상 녹화 완료')

            try {
                setLoading(true)
                const response = await fetch('/record', {
                    method: 'POST',
                    headers: {},
                    body: formData,
                })

                if (response.ok) {
                    console.log(response)
                    if (response.status === 200) {
                        const data = await response.json();
                        setLoading(false)
                        navigate('/upload', { state: { prevURL: '/record', videoInfo: JSON.stringify(data.video_info) } });
                    }
                    if (response.status === 400) {
                        console.log('Error during video upload:');
                    }
                }
            } 
            catch (error) {
                console.error('Error during video upload:', error);
            }
        }

        else {
            console.log('No video recorded.');
        }
    };

    
    return (
        <>
        {loading ? <Loading /> : null}

        <div className="camera-box">
            <Webcam 
            audio={true}
            muted={true}
            mirrored={mirrorMode}
            ref={webcamRef} 
            videoConstraints={{
                ...videoConstraints,
                facingMode
            }}
            style={{
                position: "absolute",
                textAlign: "center",
                zindex: 8,
                right:0,
                height: "100%",
                width: "100%",
                objectFit: "fill",
            }} />
        </div>

        <div className="camera-navigator">
            <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
            
            {selectedVideo === null && (
                <PictureOutlined className="gallery" onClick={handleFileIconClick}/>
            )}

            { selectedVideo !== null && (
                <PictureFilled className="gallery" onClick={handleFileIconClick}/>
            )}

            {recording ? (
                <div className="camera-button" onClick={handleStopRecordClick}>
                    <div className="recording-stop-button"></div>
                </div>
            ) : (
                <div className="camera-button" onClick={handleStartRecordClick}>
                    <div className="recording-start-button"></div>
                </div>
                
            )}
            
            <SyncOutlined className="switch" onClick={handleClick}/>
        </div>

        <div className="upload-button">
            {/* <Link to={'/upload'} state={{ prevURL: '/record', videoInfo: videoInfo }} className="upload-link"> */}
            <div onClick={() => handleUpload(selectedVideo)} className="upload-link">UPLOAD</div>
            {/* </Link> */}
        </div>
        </>
    );
};
