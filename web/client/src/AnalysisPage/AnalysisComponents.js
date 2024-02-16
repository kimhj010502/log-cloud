import React, { useState, useEffect } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { ResponsiveLine } from '@nivo/line'


export function Analysis() {
    let date = new Date()
    const [currentYear, setCurrentYear] = useState(date.getFullYear())
    const [currentMonth, setCurrentMonth] = useState(date.getMonth())

    const handleClickLeft = () => {
        const newMonth = currentMonth - 1
        setCurrentMonth(newMonth < 0 ? 11 : newMonth)
        setCurrentYear(newMonth < 0 ? currentYear - 1 : currentYear)
    };

    const handleClickRight = () => {
        const newMonth = currentMonth + 1
        setCurrentMonth(newMonth > 11 ? 0 : newMonth)
        setCurrentYear(newMonth > 11 ? currentYear + 1 : currentYear)
    };

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentMonthName = monthNames[currentMonth];

    const num = 8

    return (
        <div className='analysis-box'>
            <div className="year-month-box">
                <LeftOutlined className="left-button" onClick={handleClickLeft}/>

                <div className='year-month'>{` ${currentMonthName} `}</div>

                <RightOutlined className='right-button' onClick={handleClickRight}/>
            </div>

            <MonthAnalysis year={currentYear} month={currentMonth + 1} num={num} />
        </div>
        
    )
}

function MonthAnalysis({ year, month, num }) {
    const data = [
        {
            "id": "japan",
            "color": "hsl(0, 0%, 100%)",
            "data": [
            {
                "x": "🥰",
                "y": 7
            },
            {
                "x": "😆",
                "y": 5
            },
            {
                "x": "🙂",
                "y": 3
            },
            {
                "x": "😐",
                "y": 6
            },
            {
                "x": "🙁",
                "y": 3
            },
            {
                "x": "😠",
                "y": 1
            },
            {
                "x": "😵",
                "y": 2
            }
            ]
        }
    ]



    return (
        <>
            <div className='month-log'>{year}년 {month}월에는 총 {num}개의 일기를 작성했어요 ✏️</div>
            <Top5Hashtag year={year} month={month} />

            <div className='emotion-label'>감정 분석</div>
            <EmotionGraph data={data} />
        </> 
    )
}

function Top5Hashtag({ year, month }) {
    /* year년 month월 데이터 가져오기 */
    return (
        <div className='top5-hashtag-box'>
            <div className='hashtag-label'>TOP 5 해시태그</div>

            {/* 반복문으로 바꾸기 */}
            <div className='hashtag-box'>
                <HashTag key='0' value='여행' />
                <HashTag key='1' value='네덜란드네덜란드네덜란드' />
                <HashTag key='2' value='벨기에' />
                <HashTag key='3' value='해변' />
                <HashTag key='4' value='고양이' />
            </div>
        </div>
    )
}

function HashTag({ value }) {
    return (
        <div className="hashtag-container">
            <div className="hashtag">#{value}</div>
        </div>
    )
}


function EmotionGraph({ data }) {

    const theme = {
        axis: {
            ticks: {
                line: {
                    stroke: '#fff',
                },
                text: {
                    fill: '#fff',
                    fontSize: 18,
                }
            }
        },
        grid: {
            line: {
                stroke: '#888',
                strokeWidth: 1,
            }
        }
    }

    

    return (
        <div className='emotion-graph-box'>
            <ResponsiveLine
            data={data}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: true,
                reverse: false,
                color: '#ffffff'
            }}
            yFormat=" >-.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
                orient: 'bottom',
                tickSize: 0,
                tickPadding: 15,
                tickRotation: 0,  // x축 텍스트를 회전시켜줍니다. (세로)
                legend: '',  // x 축 단위를 표시합니다.
                legendOffset: 60,
                legendPosition: 'middle',
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickValues: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',  // y축 왼쪽에 표시될 단위입니다.
                legendOffset: -55,
                legendPosition: 'middle',
            }}
            enableGridX={false}
            enableGridY={false}
            colors={['#ffffff']}
            pointSize={10}
            pointColor={{ from: 'color', modifiers: [] }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabelYOffset={12}
            isInteractive={false}
            legends={[]}
            animate={false}
            className='emotion-graph'
            theme={theme}
        />
        </div>
    )
}
