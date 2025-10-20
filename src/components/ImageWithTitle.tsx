import React from 'react'
import Image from 'next/image'

const ImageWithTitle = ({ title, image }: { title: string, image: string }) => {
    return (
        <div className='h-[350px] relative mb-6'>
            <Image
              src={image}
              alt="city"
              layout="fill"
              className='w-full h-full object-cover'
            />
            <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/50' />
            <h1 className='capitalize px-4  md:px-8 lg:px-10  text-background text-3xl font-medium absolute left-0 bottom-5'>
                {title}
            </h1>
        </div>
    )
}

export default ImageWithTitle
