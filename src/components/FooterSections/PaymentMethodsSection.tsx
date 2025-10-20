import React from 'react'
import { PAYMENT_METHODS } from '@/data/staticData'

const PaymentMethodsSection = () => {
    return (
        <div>
            <h4 className='text-sm font-semibold text-foreground pb-4'>Payment Methods</h4>
            <div className='flex items-center gap-4'>

                {PAYMENT_METHODS.map((method) => (
                    <img key={method.label} src={method.src} alt={method.label} className='object-contain h-10 w-10' />
                ))}
            </div>
        </div>
    )
}

export default PaymentMethodsSection
