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

export interface ResetPasswordPasswordsInfo {
  password: string;
  confirmPassword: string;
}

export interface VerificationCodeInfo {
  email: string;
  code: string;
}

export interface NewFolderInfo {
  title: string;
  category: string;
  colour: string;
}
