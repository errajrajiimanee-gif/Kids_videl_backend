export interface User {
  id: number;
  createdAt: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  resetToken?: string;
  resetTokenExpires?: string;
}

