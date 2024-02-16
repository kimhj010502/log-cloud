import { Link } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'

export function SearchHeader() {
    return (
        <div className='header-box'>
            <Link to={'/search'} class="search-link">
                <ArrowLeftOutlined className="left-button"/>
            </Link>
            
                <h1>search result</h1>
        </div>
    )
}

export function SelectedValue({ selectedValue }) {
    const formatDate = (date) => date ? date.toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/[.\s]+$/, '') : '';

    const startDate = formatDate(selectedValue.dateRange[0]);
    const endDate = formatDate(selectedValue.dateRange[1]);

    return (
        <div className="value-box">
            <div className="value-component-what">{selectedValue.selectedWhat}</div>
            <div className="value-component-scope">{selectedValue.selectedScope}</div>
            <div className="value-component-date" style={{ borderRight: 'none' }}>{startDate} ~ {endDate}</div>
            
            <div style={{ width: '390px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                <div className="value-keyword">{selectedValue.keyword}</div>
            </div>
        </div>
    )
}


/* 검색 결과 피드 */
export function Result({ date, cover_img_src }) {
    return (
        <div className='result-box'>
            <Link to={'/feed'} style={{ textDecoration: 'none' }}>
                <div className='result-date'>
                    {date}
                </div>

                <CoverImg cover_img_src={cover_img_src} />
            </Link>
        </div>
    )
}

function CoverImg({ cover_img_src }) {
    return (
        <div className='result-img'>
            <img className="cover-img" src={cover_img_src} alt="cover img"/>
        </div>
    )
}


