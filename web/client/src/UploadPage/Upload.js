import React, { useState, useEffect  } from 'react';
import { useNavigate, useLocation  } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LogDate, VideoPreview, Toggle, SelectEmotion, NextButton } from './UploadComponents'
import './Upload.css'


function Upload() {
    const location = useLocation();
    const prevURL = location.state?.prevURL;  // 이전 페이지의 URL
    const videoInfo = JSON.parse(location.state?.videoInfo); 

    const navigate = useNavigate()
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        if (!isVisible) {
          setTimeout(() => {
            navigate('/record')
          }, 300);
        }
    }, [isVisible, navigate])
    
    const handleButtonClick = () => {
        setIsVisible(!isVisible)
    };

    const [switches, setSwitches] = useState({
        bgm: false,
        summary: false,
        hashtag: false,
        public: false,
    });

    const [emotion, setEmotion] = useState(null);

    console.log('감정', emotion)
    console.log('토글', switches)


    const handleUpload = async() => {
        if (!emotion) {
            alert("오늘의 감정을 선택하세요");
            return;
        }
        

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ switches: switches, emotion: emotion }),
            });

            // if (response.ok) {
            //     if (response.status === 200) {
            //         const data = await response.json();

            //         // sessionStorage.setItem('username', data.username);
            //         // sessionStorage.setItem('createdAt', new Date(data.createdAt).getFullYear());

            //         // sessionStorage.setItem('myProfileImg', await getProfileImage(data.username));

            //         // navigate("/", { replace: true });
            //     }
            // } else if (response.status === 401) {
            //     alert('Invalid value :(');
            // } else {
            //     alert('Select option failed :(');
            // }
        } catch (error) {
            console.error('Error uploading in:', error);
        }
    };

    return (
        <AnimatePresence>
        {isVisible && prevURL === '/record' && (
            <motion.div
            key="visible"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '200%' }}
            transition={{ duration: 0.5 }}
            className="upload-page"
            >
                {LogDate(handleButtonClick, videoInfo.upload_date)}

                <VideoPreview url={videoInfo.video_file_path} />

                <Toggle switches={switches} setSwitches={setSwitches} />

                <SelectEmotion emotion={emotion} setEmotion={setEmotion} />

                <NextButton handleUpload={handleUpload} />

            </motion.div>
        )}

        {isVisible && prevURL === '/save' && (
            <motion.div
            key="visible"
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-200%' }}
            transition={{ duration: 0.5 }}
            className="upload-page"
            >
                {LogDate(handleButtonClick, videoInfo.upload_date)}

                <VideoPreview url={videoInfo.video_file_path} />

                <Toggle switches={switches} setSwitches={setSwitches}/>

                <SelectEmotion emotion={emotion} setEmotion={setEmotion}/>

                <NextButton handleUpload={handleUpload} />

            </motion.div>
        )}
        </AnimatePresence>
    )
}


export default Upload