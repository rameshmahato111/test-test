import { FOOTER_LINKS } from '@/data/staticData'

import DownloadSection from './DownloadSection'
import LinkSection from './LinkSection'
import PaymentMethodsSection from './PaymentMethodsSection'

import CopyRight from './CopyRight'
import Wrapper from '../Wrapper'
import Extras from '@/services/api/extras'
import SocialLinks from './SocialLinks'
import AssociationSection from './AssociationSection'

const Footer = async () => {
    const data = await Extras.getSocialMediaLinks()
    return (
        <Wrapper>
            <div className='bg-gray-100 px-4 pt-10 pb-6 md:px-8 lg:px-10 mt-16'>
                <AssociationSection />
                <div className='flex flex-col lg:flex-row justify-between py-8 gap-10 '>
                    <DownloadSection />
                    <div className='flex flex-col md:flex-row w-full lg:w-[50%] justify-between gap-10'>
                        <LinkSection title="Pages" links={FOOTER_LINKS} />
                        <SocialLinks title="Social Media" links={data} />
                        <PaymentMethodsSection />
                    </div>
                </div>
                <CopyRight />
            </div>
        </Wrapper>
    )
}

export default Footer
