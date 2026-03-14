import { create } from 'zustand';

interface SignupState {
  email: string;
  username: string;
  password: string;
  full_name: string;
  referral_code_input: string;
  platform: string;
  isEmailVerified: boolean;

  setSignupData: (data: Partial<SignupState>) => void;
  clearSignupData: () => void;
}

export const useSignupStore = create<SignupState>((set) => ({
  email: '',
  username: '',
  password: '',
  full_name: '',
  referral_code_input: '',
  platform: 'mobile',
  isEmailVerified: false,

  setSignupData: (data) => set((state) => ({ ...state, ...data })),

  clearSignupData: () => set({
    email: '',
    username: '',
    password: '',
    full_name: '',
    referral_code_input: '',
    platform: 'mobile',
    isEmailVerified: false,
  })
}))
