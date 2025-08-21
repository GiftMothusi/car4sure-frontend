import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().min(1, 'Street is required').max(255),
  city: z.string().min(1, 'City is required').max(100),
  state: z.string().min(1, 'State is required').max(50),
  zip: z.string().min(1, 'ZIP code is required').max(10),
});

export const policyHolderSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  address: addressSchema,
});

export const driverSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  age: z.number().min(16, 'Driver must be at least 16 years old').max(100),
  gender: z.enum(['Male', 'Female']),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  licenseNumber: z.string().min(1, 'License number is required').max(50),
  licenseState: z.string().min(1, 'License state is required').max(10),
  licenseStatus: z.enum(['Valid', 'Expired', 'Suspended', 'Revoked']),
  licenseEffectiveDate: z.string(),
  licenseExpirationDate: z.string(),
  licenseClass: z.string().min(1, 'License class is required').max(10),
});

export const coverageSchema = z.object({
  type: z.enum(['Liability', 'Collision', 'Comprehensive']),
  limit: z.number().min(0, 'Limit must be a positive number'),
  deductible: z.number().min(0, 'Deductible must be a positive number'),
});

export const vehicleSchema = z.object({
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  make: z.string().min(1, 'Make is required').max(50),
  model: z.string().min(1, 'Model is required').max(50),
  vin: z.string().length(17, 'VIN must be exactly 17 characters'),
  usage: z.enum(['Pleasure', 'Commuting', 'Business', 'Farm']),
  primaryUse: z.string().min(1, 'Primary use is required').max(100),
  annualMileage: z.number().min(0).max(200000),
  ownership: z.enum(['Owned', 'Leased', 'Financed']),
  garagingAddress: addressSchema,
  coverages: z.array(coverageSchema).min(1, 'At least one coverage is required'),
});

export const policySchema = z.object({
  policyStatus: z.enum(['Active', 'Inactive', 'Cancelled', 'Expired', 'Pending']),
  policyType: z.string().min(1, 'Policy type is required').max(50),
  policyEffectiveDate: z.string(),
  policyExpirationDate: z.string(),
  policyHolder: policyHolderSchema,
  drivers: z.array(driverSchema).min(1, 'At least one driver is required'),
  vehicles: z.array(vehicleSchema).min(1, 'At least one vehicle is required'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});