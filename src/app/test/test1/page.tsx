import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <section className='w-full mx-auto grid lg:grid-cols-2 grid-cols-1 gap-10 items-center'>
        <div>
         <h1>Looking for a place to stay?</h1>
         <p>Say goodbye to bookings on websites, get an all in price for your private vacations today.</p>
         <div className='max-w-md flex items-start justify-between'>
            <div>
                <p>50k+</p>
            <span>Hotels & Stays</span>
            </div>
             <div>
                <p>50k+</p>
            <span>Hotels & Stays</span>
            </div>
           
            <div>
                <p>50k+</p>
            <span>Hotels & Stays</span>
            </div>
           
         </div>
         <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 mt-10'>

         
         <div className='max-w-[200px] focus:outline-none outline-none'>
            <Input placeholder='Location or Hotel Name' />
         </div>
         <div className='max-w-[200px] focus:outline-none outline-none'>
            <Input placeholder='Location or Hotel Name' />
         </div>
         <div className='max-w-[200px] focus:outline-none outline-none'>
            <Input placeholder='Location or Hotel Name' />
         </div>
          <div>
            <Button className='bg-pink-400'>search</Button>
          </div>
         </div>
        </div>
        <div className='sticky bottom-0 right-0'>
            <Image src={'/banners/car.png'} alt='' height={400} width={400}/>
        </div>
    </section>
  )
}

export default page