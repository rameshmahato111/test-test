import React from 'react'

const Loader = () => {

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[9999] flex items-center justify-center bg-black/20 overflow-hidden">
            <div className='bg-background rounded-lg shadow-searchShadow w-32 h-32 flex items-center justify-center'>
                <div className='main-loader' />
            </div>
        </div>
    )
}

export default Loader
