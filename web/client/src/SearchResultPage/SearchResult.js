import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../AppPage/AppComponents'
import Loading from '../Routing/Loading'
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


function SearchResultPage({imgSrc}) {
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const selectedValue = location.state;
    
    const [data, setData] = useState([{}])
    const [isFeed, setIsFeed] = useState(false)

    useEffect(() => {
        setLoading(true)
        fetchData(selectedValue)
            .then(data => {
                setData(data);
                console.log("Data", data);
                if (data !== "No records meet the conditions.") {
                    setIsFeed(true)
                    setData(data);
                    console.log(data);
                }
                setLoading(false)
            })
            .catch(error => {
                console.error('Error fetching data', error);
            });
    }, [selectedValue]);

    
    return (
        <div className="search-result-page">

            <SearchHeader />
            
            {loading ? (
                <Loading />
            ) : (
                !isFeed ? ( // Check if data is empty
                    <h3 className='no-feed'>No records meet the conditions.</h3>
                ) : (
                    <AnimatePresence mode='wait'>
                        <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, when: "afterChildren" }}
                        transition={{ duration: 0.5 }}
                        >
                        
                        <SelectedValue selectedValue={selectedValue} />

                <div className='results-box'>
                    {data && data.map((cont) => (
                        <Result date={cont? cont.date: null} 
                        videoId={cont? cont.videoId: null} 
                        cover_img_src={cont.coverImg? cont.coverImg: null}  />
                    ))
                    }
                </div>
                </motion.div>
            </AnimatePresence>
                )
            )}
            

            <Navigation imgSrc={imgSrc}/>
        </div>
    )
}

export default SearchResultPage