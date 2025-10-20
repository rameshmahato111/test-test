export interface LoginResponse {
  auth_token: string;
}

export interface RegisterResponse {
  email: string;
  username: string;
  id: number;
}

export interface OTPVerificationResponse {
  detail: string;
}

export interface ApiError {
  detail?: string;
  [key: string]: string | string[] | undefined;
}

export interface ForgetPasswordResponse {
  email: string;
}

export interface User {
  id: number;
    user: {
        id: number;
        email: string;
        username: string;
        is_active: boolean;
        is_staff: boolean;
        is_superuser: boolean;
    };
    city: {
      name:string;
    };
    first_name: string | null;
    last_name: string | null;
    profile_picture: string | null;
    login_type: string | null;
    dob: string | null;
    phone_number: string | null;
    full_name: string | null;
    date_joined: string;
}
