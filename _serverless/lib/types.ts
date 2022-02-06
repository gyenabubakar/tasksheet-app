export interface SignupInfo {
  email: string;
  password: string;
  name: string;
}

export interface LoginInfo {
  email: string;
  password: string;
}

export interface ResetPasswordEmailInfo {
  email: string;
}

export interface VerificationCodeInfo {
  email: string;
  code: string;
}
