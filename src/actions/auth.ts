'use server'

import { z } from 'zod'
import { authApi } from '@/services/api/index'

// SCHEMAS
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  reenterPassword: z.string()
}).refine((data) => data.password === data.reenterPassword, {
  message: "Passwords don't match",
  path: ["reenterPassword"],
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(4, 'Password is required'),
});

const otpSchema = z.object({
  otp: z.string().min(1, 'OTP is required'),
  email: z.string().email('Invalid email address'),
});
const forgetPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// ACTIONS

export async function registerUser(prevState: any, formData: FormData) {
  try {
    const formDataObj = Object.fromEntries(formData.entries());
    console.log('Form data received:', formDataObj);
    
    const validatedData = registerSchema.parse({
      email: formData.get('email'),
      username: formData.get('username'),
      password: formData.get('password'),
      reenterPassword: formData.get('reenterPassword')
    });
    
    console.log('Validated data:', validatedData);
    
    const result = await authApi.register(
      validatedData.email, 
      validatedData.username, 
      validatedData.password
    );
    
    console.log('Registration API response:', result);
    return { 
      success: true, 
      error: null,
      data: result 
    };
  } catch (err: any) {
    console.error('Registration error:', err);
    
    // Handle Zod validation errors
    if (err instanceof z.ZodError) {
      const errorMessage = err.issues[0]?.message || 'Validation error';
      console.error('Validation error:', errorMessage);
      return { 
        success: false, 
        error: errorMessage,
        data: null 
      };
    } 
    
    // Handle API response errors from our auth service
    if (err?.response) {
      const errorData = err.response;
      console.error('API Error Response:', errorData);
      
      // Handle email already exists error
      if (errorData.email && Array.isArray(errorData.email)) {
        return { 
          success: false, 
          error: errorData.email[0],
          data: null 
        };
      }
      
      // Handle other field errors
      const firstError = errorData[Object.keys(errorData)[0]];
      const errorMessage = Array.isArray(firstError) 
        ? firstError[0] 
        : typeof firstError === 'string' 
          ? firstError 
          : 'Registration failed';
      
      return { 
        success: false, 
        error: errorMessage,
        data: null 
      };
    }
    
    // Handle other types of errors
    const errorMessage = err?.message || 'Registration failed. Please try again.';
    console.error('Registration error:', errorMessage);
    return { 
      success: false, 
      error: errorMessage,
      data: null 
    };
  }
}



export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  try {
    const validatedData = loginSchema.parse({ email, password })
    const token = await authApi.login(validatedData.email, validatedData.password)
    return { success: true, error: null, token: token }
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message, token: null }
    } else {
      // Use the error message from the API
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      return { success: false, error: errorMessage, token: null }
    }
  }
}


export async function verifyUserOTP(otp: string,email:string) {
  try{
    const validatedData = otpSchema.parse({otp,email});
    const result = await authApi.verifyOTP(validatedData.otp,validatedData.email);
    return { success: true, error: null };
  }catch(err){
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message }
    } else {
      return { success: false, error: 'OTP verification failed' }
    }
  }
}


export async function ResetUserPassword(email:string){
    try {
        const validatedData = forgetPasswordSchema.parse({email});
        const result = await authApi.forgetPassword(validatedData.email);
        return { success: true, error: null };
    } catch (err) {
       if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0].message }
    } else {
      return { success: false, error: 'Failed to rest password' }
    }
    }
}

