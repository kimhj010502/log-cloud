import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { Analysis } from "./AnalysisComponents";
import './Analysis.css';

function numberToMonth(number) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[number - 1] || 'Invalid month';
}


function AnalysisPage() {
    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/analysisReport"). then(
            res => res.json()
        ). then(
            data => {
                setData(data)
                console.log(data)
            })
    }, []);

    return (
        <div className="analysis-page">

            <h1>analysis report</h1>

            {Object.keys(data).length === 0 ? ( // Check if data is empty
                <h2>Loading...</h2>
            ) : (
                <AnimatePresence mode='wait'>
                    <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, when: "afterChildren" }}
                    transition={{ duration: 0.5 }}
                    >
                    
                    <Analysis />

                    </motion.div>
                </AnimatePresence>
            )}
            
            <Navigation />
        </div>

    );

};

export default AnalysisPage;