import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ConsentSection = () => {
    return (
        <div className='px-6 py-8 mt-8 rounded-[20px] bg-background shadow-cardShadow'>
            <p className='text-foreground text-sm font-normal pb-4'>
                By submitting this booking, I acknowledge that I have read and agree to Exploreden's{' '}
                <Link href="/terms-and-conditions" className='text-primary-400 hover:underline'>
                    Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link href="/privacy-policy" className='text-primary-400 hover:underline'>
                    Privacy Policy
                </Link>
                .
            </p>

            <div className='flex items-center gap-2 pb-6'>
                <input
                    type="checkbox"
                    id="marketingConsent"
                    name="marketingConsent"
                    value="true"
                    className="rounded border-gray-300 text-primary-400 focus:ring-primary-400"
                />
                <Label htmlFor="marketingConsent" className='text-sm font-medium text-gray-800 cursor-pointer'>
                    Send me special Exploreden deals and travel reminders
                </Label>
            </div>

            <Button
                type="submit"
                className='w-full bg-primary-400 hover:bg-primary-500 text-white py-3 rounded-md text-base font-bold transition-colors'
            >
                Complete Booking
            </Button>
        </div>
    );
};

export default ConsentSection; 