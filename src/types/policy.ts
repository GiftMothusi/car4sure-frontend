export interface Address {
    street: string;
    city: string;
    state: string;
    zip: string;
  }
  
  export interface PolicyHolder {
    firstName: string;
    lastName: string;
    address: Address;
  }
  
  export interface Driver {
    firstName: string;
    lastName: string;
    age: number;
    gender: "Male" | "Female";
    maritalStatus: "Single" | "Married" | "Divorced" | "Widowed";
    licenseNumber: string;
    licenseState: string;
    licenseStatus: "Valid" | "Expired" | "Suspended" | "Revoked";
    licenseEffectiveDate: string;
    licenseExpirationDate: string;
    licenseClass: string;
  }
  
  export interface Coverage {
    type: "Liability" | "Collision" | "Comprehensive";
    limit: number;
    deductible: number;
  }
  
  export interface Vehicle {
    year: number;
    make: string;
    model: string;
    vin: string;
    usage: "Pleasure" | "Commuting" | "Business" | "Farm";
    primaryUse: string;
    annualMileage: number;
    ownership: "Owned" | "Leased" | "Financed";
    garagingAddress: Address;
    coverages: Coverage[];
  }
  
  export interface Policy {
    id?: number;
    policyNo?: string;
    policyStatus: "Active" | "Inactive" | "Cancelled" | "Expired" | "Pending";
    policyType: string;
    policyEffectiveDate: string;
    policyExpirationDate: string;
    policyHolder: PolicyHolder;
    drivers: Driver[];
    vehicles: Vehicle[];
    createdAt?: string;
    updatedAt?: string;
    policyHolderName?: string;
  }
  
  export interface PolicyFormData {
    policyStatus: Policy['policyStatus'];
    policyType: string;
    policyEffectiveDate: string;
    policyExpirationDate: string;
    policyHolder: PolicyHolder;
    drivers: Driver[];
    vehicles: Vehicle[];
  }
  
  export interface BackendPolicyData {
    policy_status?: Policy['policyStatus'];
    policy_type?: string;
    policy_effective_date?: string;
    policy_expiration_date?: string;
    policy_holder?: PolicyHolder;
    drivers?: Driver[];
    vehicles?: Vehicle[];
  }
  
  export interface PolicyListResponse {
    data: Policy[];
    meta: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
      from: number;
      to: number;
    };
  }