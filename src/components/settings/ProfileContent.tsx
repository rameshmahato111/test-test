'use client';
import { Label } from '@radix-ui/react-label'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

import { CircleUserRound, Upload } from 'lucide-react'
import { ProfileApi } from '@/services/api/profile';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { ProfilePatch } from '@/types/api/profile';
import { CitySearchSuggestions } from '@/types/api/profile';

import ShimmerContainer from '../shimmers/ShimmerContainer';
import ShimmerImage from '../shimmers/ShimmerImage';
import ShimmerText from '../shimmers/ShimmerText';
import ShimmerButton from '../shimmers/ShimmerButton';
import CitySearchPopover from './CitySearchPopover';
import { PhoneInput } from '../ui/phone-input';

const ProfileContent = () => {
  const { token, user, isLoading, getUserData } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.profile_picture || undefined);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCity, setSelectedCity] = useState<CitySearchSuggestions | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Avatar section */}
        <div className='relative w-fit mb-9'>
          <ShimmerImage width='w-20' height='h-20' className="rounded-full" />
          <div className='absolute bottom-0 right-0 z-10 rounded-full p-1'>
            <ShimmerContainer width="24px" height="24px" className="rounded-full" />
          </div>
        </div>

        {/* User Info Title */}
        <ShimmerText width="w-40" height="h-8" className="mb-9" />

        {/* Form Fields */}
        <div className='grid lg:grid-cols-1 xl:grid-cols-2 gap-y-8 gap-x-6'>
          {/* Email Field */}
          <div>
            <ShimmerText width="w-16" height="h-5" className="mb-2" />
            <ShimmerContainer width="100%" height="40px" />
          </div>

          {/* Phone Field */}
          <div>
            <ShimmerText width="w-16" height="h-5" className="mb-2" />
            <ShimmerContainer width="100%" height="40px" />
          </div>

          {/* Username Field */}
          <div>
            <ShimmerText width="w-24" height="h-5" className="mb-2" />
            <ShimmerContainer width="100%" height="40px" />
          </div>
        </div>

        {/* City Field */}
        <div className="mt-8">
          <ShimmerText width="w-12" height="h-5" className="mb-2" />
          <ShimmerContainer width="100%" height="40px" className="max-w-[400px]" />
        </div>

        {/* Update Button */}
        <ShimmerButton className="mt-9" />
      </div>
    );
  }

  if (!token) {
    return (
      <div>
        <p className="text-center text-base text-foreground">  No token found login please</p>
        <Button className="bg-primary-400 text-background hover:bg-primary-500 font-semibold" onClick={() => router.push('/login')}>Login</Button>
      </div>
    );
  }

  console.log(user);

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const imageUrl = URL.createObjectURL(file);
      setAvatarUrl(imageUrl);
    }
  };

  const formValidation = (data: FormData) => {
    const formData = Object.fromEntries(data.entries());

    // Only validate email if it's provided and modified
    const email = formData.email as string;
    if (email && email !== user?.user.email) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
        toast({
          title: "Invalid Email",
          description: "Please enter a valid email address.",
          variant: "error"
        });
        return false;
      }
    }

    // Only validate phone if it's provided and modified
    const phone = formData.phone as string;
    if (phone && phone !== user?.phone_number) {
      if (isNaN(Number(phone))) {
        toast({
          title: "Invalid Phone Number",
          description: "Please enter a valid phone number.",
          variant: "error"
        });
        return false;
      }
    }

    // Only validate username if it's provided and modified
    const username = formData.username as string;
    if (username && username !== user?.full_name) {
      if (typeof username !== 'string' || username.trim() === '') {
        toast({
          title: "Invalid Username",
          description: "Please enter a valid username.",
          variant: "error"
        });
        return false;
      }
    }

    return true;
  }

  const handleCitySelect = (city: CitySearchSuggestions) => {
    setSelectedCity(city);
  };

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const formElement = e.target as HTMLFormElement;
      const formData = new FormData(formElement);

      // Get the phone input element and its full number
      const phoneInput = formElement.querySelector('input[name="phone"]') as HTMLInputElement;
      const fullPhoneNumber = phoneInput.dataset.fullNumber;

      if (!formValidation(formData)) {
        return;
      }

      let bodyData: Partial<ProfilePatch> | FormData = {};
      if (selectedFile) {
        const formDataWithFile = new FormData();
        formDataWithFile.append('profile_picture', selectedFile);
        formDataWithFile.append('email', formData.get('email') as string);
        formDataWithFile.append('phone_number', fullPhoneNumber || '');
        formDataWithFile.append('full_name', formData.get('username') as string);
        formDataWithFile.append('city', selectedCity?.id.toString() || '');
        formDataWithFile.append('first_name', formData.get('first_name') as string);
        formDataWithFile.append('last_name', formData.get('last_name') as string);
        bodyData = formDataWithFile;
      } else {
        bodyData = {
          email: formData.get('email') as string,
          phone_number: fullPhoneNumber || '',
          full_name: formData.get('username') as string,
          city: selectedCity?.id || undefined,
          first_name: formData.get('first_name') as string,
          last_name: formData.get('last_name') as string,
        };
      }

      await ProfileApi.patchProfile(token, bodyData);

      toast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success"
      });
      getUserData(token);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "error"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <div className='relative w-fit mb-9'>
        <Avatar className='w-20 h-20 border border-primary-200 shadow-xl'>
          <AvatarFallback>
            <CircleUserRound />
          </AvatarFallback>
          <AvatarImage
            className='object-cover overflow-hidden rounded-full shadow-cardShadow border-2 border-gray-200'
            src={user?.profile_picture || avatarUrl}
          />
        </Avatar>
        <div
          onClick={handleImageClick}
          className='cursor-pointer absolute bottom-0 border-2 border-primary-200 right-0 z-10 bg-background rounded-full p-1'
        >
          <Upload className='w-5 h-5 text-primary-400' />
        </div>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <div>
        <h1 className='text-2xl font-semibold text-foreground pb-9'>User Info</h1>
        <form onSubmit={formSubmit}>
          <div className='grid lg:grid-cols-1 xl:grid-cols-2 gap-y-8 gap-x-6'>
            <div>
              <Label htmlFor='first_name' className='text-base text-gray-700 font-medium '>First Name</Label>
              <Input id='first_name' name='first_name' placeholder='First Name' defaultValue={user?.first_name || ''} className='mt-2 focus-visible:border-primary-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background placeholder:text-gray-400 text-base text-foreground font-normal' />
            </div>
            <div>
              <Label htmlFor='last_name' className='text-base text-gray-700 font-medium '>Last Name</Label>
              <Input id='last_name' name='last_name' placeholder='Last Name' defaultValue={user?.last_name || ''} className='mt-2 focus-visible:border-primary-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background placeholder:text-gray-400 text-base text-foreground font-normal' />
            </div>
            <div>
              <Label htmlFor='email' className='text-base text-gray-700 font-medium '>Email</Label>
              <Input readOnly id='email' name='email' placeholder='Email' defaultValue={user?.user.email || ''} className='mt-2 focus-visible:border-primary-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background placeholder:text-gray-400 text-base text-foreground font-normal' />
            </div>
            <div>
              <Label htmlFor='phone' className='text-base text-gray-700 font-medium '>Phone</Label>
              <PhoneInput
                id='phone'
                name='phone'
                initialPhoneNumber={user?.phone_number || '+977'}
                className={`focus-visible:ring-0 pl-0 focus-visible:ring-offset-0`}
              />
            </div>
            <div>
              <Label htmlFor='username' className='text-base text-gray-700 font-medium '>Username</Label>
              <Input readOnly id='username' name='username' placeholder='Username' defaultValue={user?.user.username || ''} className='mt-2 focus-visible:border-primary-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background placeholder:text-gray-400 text-base text-foreground font-normal' />
            </div>
            {/* <div> 
              <Label htmlFor='password' className='text-base text-gray-700 font-medium '>Password</Label>
              <Input id='password' name='password' placeholder='Password' defaultValue={user?.password} className='mt-2 focus-visible:border-primary-400 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-offset-background placeholder:text-gray-400 text-base text-foreground font-normal' />
            </div> */}

          </div>
          <div className='mt-8'>
            <Label htmlFor='city' className='text-base text-gray-700 font-medium block mb-2'>City</Label>
            <CitySearchPopover

              initialCity={user?.city && user?.city.name || undefined}
              contentClassName='w-[300px] md:w-[400px]'
              className='w-full'
              onCitySelect={handleCitySelect}
            />
          </div>
          <Button
            type='submit'
            className='w-fit mt-9 bg-primary-400 text-background hover:bg-primary-500 font-semibold'
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </form>

      </div>
    </div>
  )
}

export default ProfileContent
