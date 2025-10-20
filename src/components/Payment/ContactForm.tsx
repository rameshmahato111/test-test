import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/ui/phone-input';

interface ContactFormProps {
    errors: Record<string, string>;
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string,

}

const ContactForm = ({ errors, firstName, lastName, email, phone }: ContactFormProps) => {
    return (
        <div>
            <h4 className='text-foreground text-xl font-semibold pb-4'>Contact Details</h4>
            <p className='text-sm font-normal pb-6 text-gray-800'>
                Please enter your contact information for booking confirmation.
            </p>

            <div className='grid grid-cols-2 gap-5'>
                <div>
                    <Label htmlFor='firstName' className='text-sm font-medium text-gray-800'>First Name</Label>
                    <Input
                        id='firstName'
                        name='firstName'
                        defaultValue={firstName}
                        required
                        minLength={2}
                        placeholder='First Name'
                        className={`mt-2 focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:ring-offset-0 
                            ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor='lastName' className='text-sm font-medium text-gray-800'>Last Name</Label>
                    <Input
                        id='lastName'
                        name='lastName'
                        required
                        defaultValue={lastName}
                        minLength={2}
                        placeholder='Last Name'
                        className={`mt-2 focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:ring-offset-0
                            ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor='email' className='text-sm font-medium text-gray-800'>Email</Label>
                    <Input
                        id='email'
                        name='email'
                        type='email'
                        required
                        defaultValue={email}
                        placeholder='Email'
                        className={`mt-2 focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:ring-offset-0
                            ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor='phone' className='text-sm font-medium text-gray-800'>Phone</Label>
                    <PhoneInput
                        id='phone'
                        name='phone'
                        required
                        initialPhoneNumber={phone || '+977'}
                        className={`focus-visible:ring-0 pl-0 focus-visible:ring-offset-0
                            ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                </div>

                {/* <div>
                    <Label htmlFor='address' className='text-sm font-medium text-gray-800'>Address</Label>
                    <Input
                        id='address'
                        name='address'
                        required
                        placeholder='Address'
                        className={`mt-2 focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:ring-offset-0
                            ${errors.address ? 'border-red-500' : ''}`}
                    />
                    {errors.address && (
                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor='zipCode' className='text-sm font-medium text-gray-800'>ZIP Code</Label>
                    <Input
                        id='zipCode'
                        name='zipCode'
                        required
                        placeholder='ZIP Code'
                        className={`mt-2 focus-visible:ring-1 focus-visible:ring-primary-400 focus-visible:ring-offset-0
                            ${errors.zipCode ? 'border-red-500' : ''}`}
                    />
                    {errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                    )}
                </div> */}
            </div>
        </div>
    );
};

export default ContactForm; 