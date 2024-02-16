import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { SearchHeader, SelectedValue, Result } from './SearchResultComponents'
import './SearchResult.css'

function SearchResultPage() {
    const location = useLocation();
    const selectedValue = location.state;

    const [data, setData] = useState([{}])
    useEffect(() => {
        fetch("/socialdetail").then(
            res => res.json()
        ).then(
            data => {
                setData(data)
                console.log(data)
            })
    }, []);

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
                    <Result date={data.date} cover_img_src="test_image.jpg" />
                    <Result date={data.date} cover_img_src="test_image.jpg" />
                </div>
            
                </motion.div>
            </AnimatePresence>
            <Navigation />
        </div>
    )
}


export default SearchResultPage