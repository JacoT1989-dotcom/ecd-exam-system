import { UserRole } from "@prisma/client";

// Student data for form population
export interface StudentData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  suburb?: string | null;
  townCity: string;
  postcode: string;
  country: string;
  avatarUrl?: string | null;
  backgroundUrl?: string | null;
  role: UserRole;
}

// Update DTOs for different sections
export interface UpdateStudentInfoValues {
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  phoneNumber: string;
}

export interface UpdateAddressValues {
  streetAddress: string;
  suburb?: string;
  townCity: string;
  postcode: string;
  country: string;
}

export interface UpdateImagesValues {
  avatarImage?: File;
  backgroundImage?: File;
}

export interface UpdatePasswordValues {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Combined values for partial updates
export type StudentProfileUpdateValues = UpdateStudentInfoValues &
  UpdateAddressValues;

// Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface ImageUploadResult {
  url: string;
  fileName: string;
}

export interface UpdateStatus {
  success?: boolean;
  error?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
