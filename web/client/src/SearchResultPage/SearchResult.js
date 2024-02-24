import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { SearchHeader, SelectedValue, Result } from './SearchResultComponents'
import './SearchResult.css'


async function fetchData(selectedValue){
    try {
        const response = await fetch('/searchresult', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ selectedValue }),
        });
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Sending data', error);
        throw error;
        }
}


function SearchResultPage() {
    const location = useLocation();
    const selectedValue = location.state;
    
    const [data, setData] = useState([{}])

    useEffect(() => {
        fetchData(selectedValue)
            .then(data => {
                setData(data);
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching data', error);
            });
    }, [selectedValue]);
    
    return (
        <div className="search-result-page">

            <SearchHeader />
            
            <AnimatePresence mode='wait'>
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, when: "afterChildren" }}
                transition={{ duration: 0.5 }}
                >
                
                <SelectedValue selectedValue={selectedValue} />

                <div className='results-box'>
                    {data.map((cont) => (
                        <Result date={cont? cont.date: null} cover_img_src={cont? cont.coverImg: null} />
                    ))
                }
                </div>
                </motion.div>
            </AnimatePresence>
            <Navigation />
        </div>
    )
}

export default SearchResultPage
