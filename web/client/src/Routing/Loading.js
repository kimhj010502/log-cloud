import React from 'react';
import { ClipLoader } from 'react-spinners'

export const Loading = () => {
    return (
        <div>
            <ClipLoader color='#ffffff' className='loading'/>
        </div>
    )
};

export default Loading;