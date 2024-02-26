import React from 'react';
import { ClipLoader } from 'react-spinners'

export const Loading = () => {
    return (
        <div>
            <ClipLoader className='loading'/>
        </div>
    )
};

export default Loading;