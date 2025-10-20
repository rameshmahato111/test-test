import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Coins } from 'lucide-react';

interface CreditsSectionProps {
    useCredits: boolean;
    setUseCredits: (value: boolean) => void;
}

const CreditsSection = ({ useCredits, setUseCredits }: CreditsSectionProps) => {
    return (
        <div className='px-4 py-5 rounded-sm bg-background shadow-cardShadow'>
            <div className='flex justify-between gap-2 items-center border-b border-gray-200 pb-4'>
                <div>
                    <h3 className='flex items-center gap-2 text-foreground text-base font-semibold pb-1'>
                        Travel Credit <Coins className='w-5 h-5' />
                    </h3>
                    <p className='text-sm font-normal'>
                        You have <span className='font-semibold text-primary-400'>14 credits</span>
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className={`${useCredits ? 'bg-primary-400 text-white' : 'text-primary-400 border-primary-400'}`}
                    onClick={() => setUseCredits(!useCredits)}
                >
                    {useCredits ? 'Remove Credits' : 'Use Credits'}
                </Button>
            </div>

            <h3 className='text-sm font-normal mt-4'>Enter promo code</h3>
            <div className='flex w-full gap-2 mt-2 items-center'>
                <Input
                    type='text'
                    name="promoCode"
                    className='flex-1 focus-visible:ring-0'
                    placeholder='Enter promo code'
                />
                <Button
                    type="button"
                    className='bg-primary-400 text-background text-base font-medium'
                >
                    Apply
                </Button>
            </div>
        </div>
    );
};

export default CreditsSection; 