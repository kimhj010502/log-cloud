import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { Analysis } from "./AnalysisComponents";
import './Analysis.css';


async function fetchData(currentYear, currentMonth) {
    try {
        const response = await fetch('/analysisReport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ currentYear, currentMonth }),
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Sending data', error);
        throw error;
    }
}


function AnalysisPage() {
    let date = new Date()
    const [currentYear, setCurrentYear] = useState(date.getFullYear())
    const [currentMonth, setCurrentMonth] = useState(date.getMonth())
    const [data, setData] = useState([{}])

    useEffect(() => {
        fetchData(currentYear, currentMonth)
            .then(data => {
                setData(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching data', error);
            });
    }, [currentYear, currentMonth]);


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
                    
                    <Analysis currentYear={currentYear} setCurrentYear={setCurrentYear} currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} num={data.num} hashtag={data.hashtags} loved={data.loved} excited={data.excited} good={data.good} neutral={data.neutral} unhappy={data.unhappy} angry={data.angry} tired={data.tired}/>
                    </motion.div>
                </AnimatePresence>
            )}
            
            <Navigation />
        </div>

    );

};

export default AnalysisPage;
