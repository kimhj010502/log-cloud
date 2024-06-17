import React from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { ResponsiveLine } from '@nivo/line'
import Loading from '../Routing/Loading'

export function Analysis({ currentYear, setCurrentYear, currentMonth, setCurrentMonth, num, hashtag, loved, excited, good, neutral, unhappy, angry, tired, loading, setLoading }) {

    let date = new Date();
    const todayYear = date.getFullYear();
    const todayMonth = date.getMonth();

    let userCreatedMonth = sessionStorage.getItem('userCreatedMonth');
    let userCreatedYear = sessionStorage.getItem('userCreatedYear');

    const handleClickLeft = () => {
        if ((currentYear > userCreatedYear) || (currentMonth > userCreatedMonth)){
            const newMonth = currentMonth - 1
            setCurrentMonth(newMonth < 0 ? 11 : newMonth)
            setCurrentYear(newMonth < 0 ? currentYear - 1 : currentYear)
        };

    };

    const handleClickRight = () => {
        if ((currentYear < todayYear) || (currentMonth < todayMonth)) {
            const newMonth = currentMonth + 1
            setCurrentMonth(newMonth > 11 ? 0 : newMonth)
            setCurrentYear(newMonth > 11 ? currentYear + 1 : currentYear)
        };
    };

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let currentMonthName = monthNames[currentMonth];

    return (
        <div className='analysis-box'>
            <div className="year-month-box">
                <LeftOutlined className="left-button" onClick={handleClickLeft}/>

                <div className='year-month'>{` ${currentMonthName} `}</div>

                <RightOutlined className='right-button' onClick={handleClickRight}/>
            </div>
            
            {loading ? (<Loading />) : (
                <MonthAnalysis year={currentYear} month={currentMonth + 1} num={num} hashtag={hashtag} loved={loved} excited={excited} good={good} neutral={neutral} unhappy={unhappy} angry={angry} tired={tired}/>
            )}
        </div>
        
    )
}

function MonthAnalysis({ year, month, num, hashtag, loved, excited, good, neutral, unhappy, angry, tired }) {
    const data = [
        {
            "id": "japan",
            "color": "hsl(0, 0%, 100%)",
            "data": [
            {
                "x": "🥰",
                "y": loved
            },
            {
                "x": "😆",
                "y": excited
            },
            {
                "x": "🙂",
                "y": good
            },
            {
                "x": "😐",
                "y": neutral
            },
            {
                "x": "🙁",
                "y": unhappy
            },
            {
                "x": "😠",
                "y": angry
            },
            {
                "x": "😵",
                "y": tired
            }
            ]
        }
    ]

    const max_num = Math.max(loved, excited, good, neutral, unhappy, angry, tired)

    return (
        <>
            <div className='month-log'>{year}년 {month}월에는 총 {num}개의 일기를 작성했어요 ✏️</div>
            <Top5Hashtag year={year} month={month} hashtag={hashtag} />

            <div className='emotion-label'>감정 분석</div>
            <EmotionGraph data={data} max_num={max_num}/>
        </> 
    )
}

function Top5Hashtag({ hashtag }) {

    return(
        <div className='top5-hashtag-box'>
            <div className='hashtag-label'>TOP 해시태그</div>

            <div className='hashtag-box'>
                {hashtag && hashtag.length > 0 ? (
                    hashtag.map((tag, index) => tag ? (
                        <HashTag key={index} value={tag} bgColor={`bg-color-${index}`} />
                    ) : null)
                ) : (
                    <div className="no-hashtags">nothing here yet</div>
                )}
            </div>
        </div>
    )
}

function HashTag({ value, key, bgColor }) {
    return (
        <div className="hashtag-container">
            <div className={`hashtag ${bgColor}`}>#{value}</div>
        </div>
    )
}

function EmotionGraph({ data, max_num }) {
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
            margin={{ top: 10, right: 50, bottom: 50, left: 60 }}
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
                tickRotation: 0,
                legend: '',
                legendOffset: 60,
                legendPosition: 'middle',
            }}
            axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickValues: max_num,
                tickPadding: 5,
                tickRotation: 0,
                legend: '',
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
