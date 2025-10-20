import React from 'react'

import Wrapper from '@/components/Wrapper'
import AllImages from '@/components/Details_page/AllImages'
type ValidTypes = 'hotel' | 'activity';

const GalleryPage = async ({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ type: ValidTypes }> }) => {
    const { id } = await params;
    const { type } = await searchParams;
    return (

        <Wrapper>
            <div className='px-4 md:px-8 lg:px-10 pt-8 md:pt-16'>
                <h1 className='text-2xl font-semibold mb-6'>Gallery</h1>
                <AllImages id={id} type={type} />
            </div>
        </Wrapper>

    )
}

export default GalleryPage;


