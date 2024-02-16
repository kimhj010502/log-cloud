import React, { useState } from 'react'
import { PictureOutlined, SyncOutlined } from '@ant-design/icons'
import Webcam from 'react-webcam';




//카메라 화면
const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
    facingMode: FACING_MODE_USER
};

export function CameraRecord() {
    //카메라 전환
    const [facingMode, setFacingMode] = React.useState(FACING_MODE_USER);

    const handleClick = React.useCallback(() => {
        setFacingMode(
            prevState =>
                prevState === FACING_MODE_USER
                    ? FACING_MODE_ENVIRONMENT
                    : FACING_MODE_USER
        );
    }, []);


    //영상 녹화
    const webcamRef = React.useRef(null);
    const mediaRecorderRef = React.useRef(null);
    const [recording, setRecording] = React.useState(false);
    const [recordedChunks, setRecordedChunks] = React.useState([]);
  
    const handleStartRecordClick = React.useCallback(() => {
        setRecording(true);
        mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
            mimeType: "video/webm"
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
    };

    const handleUpload = () => {
        // 여기서 동영상 업로드 로직을 구현하면 됩니다.
        if (selectedVideo) {
        console.log('Uploading video:', selectedVideo);
        // 여기서 선택한 동영상 파일을 서버로 업로드하거나 다른 작업을 수행할 수 있습니다.
        } else {
        console.log('No video selected.');
        }
    };

    const handleFileIconClick = React.useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, [fileInputRef]);

    
    //녹화한 동영상 다운로드
    const handleDownload = React.useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/mp4"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = "react-webcam-stream-capture.webm";
            a.click();
            window.URL.revokeObjectURL(url);
            setRecordedChunks([]);
        }
    }, [recordedChunks]);
  
    
    return (
        <>
        <div className="camera-box">
            <Webcam 
            audio={true}
            muted={true}
            ref={webcamRef} 
            videoConstraints={{
                ...videoConstraints,
                facingMode,
                width: 522,
                height: 351
            }} />
        </div>

        <div className="camera-navigator">
            <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
            <PictureOutlined className="gallery" onClick={handleFileIconClick}/>

            {recording ? (
                <div className="camera-button" onClick={handleStopRecordClick}>
                    <div className="recording-stop-button"></div>
                </div>
            ) : (
                <div className="camera-button" onClick={handleStartRecordClick}>
                    <div className="recording-start-button"></div>
                </div>
                
            )}
            {recordedChunks.length > 0 && (
                <button onClick={handleDownload}>Download</button>
            )}
            
            <SyncOutlined className="switch" onClick={handleClick}/>
        </div>
        </>
    );
};
  