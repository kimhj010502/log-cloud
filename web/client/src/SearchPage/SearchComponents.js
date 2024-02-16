import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DatePicker from "react-datepicker"
import 'react-datepicker/dist/react-datepicker.css';


export function SearchBox() {
    const [selectedWhat, setSelectedWhat] = useState(null);
    const [selectedScope, setSelectedScope] = useState(null);
    const [dateRange, setDateRange] = useState([null, null]);
    const [keyword, setKeyword] = useState(null);

    useEffect(() => {
        console.log("1", selectedWhat);
        console.log("2", selectedScope);
        console.log("3", dateRange);
        console.log("4", keyword);
    }, [selectedWhat, selectedScope, dateRange, keyword]);

    return (
        <div className='search-box'>
            <SelectWhat selectedWhat={selectedWhat} setSelectedWhat={setSelectedWhat} />
            <SelectScope selectedScope={selectedScope} setSelectedScope={setSelectedScope} />
            <SelectPeriod dateRange={dateRange} setDateRange={setDateRange} />
            <InputKeyword keyword={keyword} setKeyword={setKeyword} />

            <SearchButton
                selectedWhat={selectedWhat}
                selectedScope={selectedScope}
                dateRange={dateRange}
                keyword={keyword}
            />
        </div>
    )
}



function SelectWhat({ selectedWhat, setSelectedWhat }) {
    const handleItemClick = (index) => {
        setSelectedWhat(index);
    };

    return (
        <div className="what-box">
            <div 
            className={`what-component ${selectedWhat === '전체' ? 'selected' : ''}`}
            onClick={() => handleItemClick('전체')}
            style={{ borderLeft: 'none', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px'}}>
            전체
            </div>

            <div 
            className={`what-component ${selectedWhat === 'log 전문' ? 'selected' : ''}`}
            onClick={() => handleItemClick('log 전문')}>
            log 전문
            </div>

            <div 
            className={`what-component ${selectedWhat === '요약본' ? 'selected' : ''}`}
            onClick={() => handleItemClick('요약본')}>
            요약본
            </div>

            <div 
            className={`what-component ${selectedWhat === '해시태그' ? 'selected' : ''}`}
            onClick={() => handleItemClick('해시태그')}
            style={{ borderTopRightRadius: '12px', borderBottomRightRadius: '12px'}}>
            해시태그
            </div>
        </div>
    )
}



function SelectScope({ selectedScope, setSelectedScope }) {
    const handleItemClick = (index) => {
        setSelectedScope(index);
    };

    return (
        <div className="scope-box">
            <div 
            className={`scope-component ${selectedScope === '전체' ? 'selected' : ''}`}
            onClick={() => handleItemClick('전체')}
            style={{ borderLeft: 'none', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px'}}>
            전체
            </div>

            <div 
            className={`scope-component ${selectedScope === '개인기록' ? 'selected' : ''}`}
            onClick={() => handleItemClick('개인기록')}>
            개인기록
            </div>

            <div 
            className={`scope-component ${selectedScope === '친구공유' ? 'selected' : ''}`}
            onClick={() => handleItemClick('친구공유')}
            style={{  borderRight: 'none', borderTopRightRadius: '12px', borderBottomRightRadius: '12px'}}>
            친구공유
            </div>
        </div>
    )
}




function SelectPeriod({ dateRange, setDateRange }) {
    return (
        <div className="period-box">
            <DatePicker
            selectsRange={true}
            startDate={dateRange[0]}
            endDate={dateRange[1]}
            onChange={(update) => {
                setDateRange(update);
            }}
            isClearable={true}
            dateFormat="yyyy/MM/dd"
            placeholderText="날짜 선택"
            />
        </div>
    )
}




function InputKeyword({ keyword, setKeyword }) {
    const handleSetKeyword = (e) => {
        setKeyword(e.target.value);
    };

    return (
        <div className='keyword-box'>
            <div className='keyword'>keyword</div>
            <input value={keyword} onChange={(e) => handleSetKeyword(e)} placeholder='추가 키워드 입력' className='keyword-textinput'></input>
        </div>
    )
}


function SearchButton({ selectedWhat, selectedScope, dateRange, keyword }) {
    return (
        <div className="search-button">
            <Link  to={'/search-result'} 
            state={{ 
                selectedWhat,
                selectedScope,
                dateRange,
                keyword
                }} className="search-link">
                <div>SEARCH</div>
            </Link>
        </div>
    )
}