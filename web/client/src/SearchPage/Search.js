import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import { SearchBox } from './SearchComponents'
import './Search.css'

function SearchPage({imgSrc}) {
    return (
        <div className="search-page">

            <h1>search</h1>

            <AnimatePresence mode='wait'>
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, when: "afterChildren" }}
                transition={{ duration: 0.5 }}
                >

                <SearchBox />
            
                </motion.div>
            </AnimatePresence>
            
            <Navigation imgSrc={imgSrc} />
        </div>
    )
}


export default SearchPage