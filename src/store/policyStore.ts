import { create } from 'zustand';
import { Policy, PolicyFormData, PolicyListResponse } from '@/types/policy';
import { policyApi } from '@/lib/api';

// Backend policy data type for API calls
interface BackendPolicyData {
  policy_status: 'Active' | 'Inactive' | 'Cancelled' | 'Expired' | 'Pending';
  policy_type: string;
  policy_effective_date: string;
  policy_expiration_date: string;
  policy_holder: any;
  drivers: any[];
  vehicles: any[];
}

interface PolicyState {
  policies: Policy[];
  currentPolicy: Policy | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  filters: {
    search: string;
    status: string;
    page: number;
    per_page: number;
  };
}

interface PolicyActions {
  fetchPolicies: () => Promise<void>;
  fetchPolicy: (id: number) => Promise<void>;
  createPolicy: (data: PolicyFormData) => Promise<Policy>;
  updatePolicy: (id: number, data: Partial<PolicyFormData>) => Promise<Policy>;
  deletePolicy: (id: number) => Promise<void>;
  generatePolicyPdf: (id: number) => Promise<string>;
  setFilters: (filters: Partial<PolicyState['filters']>) => void;
  clearError: () => void;
  clearCurrentPolicy: () => void;
}

export const usePolicyStore = create<PolicyState & PolicyActions>((set, get) => ({
  // State
  policies: [],
  currentPolicy: null,
  isLoading: false,
  error: null,
  pagination: {
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    from: 1,
    to: 15,
  },
  filters: {
    search: '',
    status: '',
    page: 1,
    per_page: 15,
  },

  // Actions
  fetchPolicies: async () => {
    set({ isLoading: true, error: null });
    try {
      const { filters } = get();
      const response = await policyApi.getAll(filters);
      set({
        policies: response.data,
        pagination: response.meta,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch policies',
        isLoading: false,
      });
    }
  },

  fetchPolicy: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await policyApi.getOne(id);
      set({
        currentPolicy: response.data,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch policy',
        isLoading: false,
      });
    }
  },

  createPolicy: async (data: PolicyFormData) => {
    set({ isLoading: true, error: null });
    try {
      // Convert camelCase to snake_case for backend
      const backendData: BackendPolicyData = {
        policy_status: data.policyStatus,
        policy_type: data.policyType,
        policy_effective_date: data.policyEffectiveDate,
        policy_expiration_date: data.policyExpirationDate,
        policy_holder: data.policyHolder,
        drivers: data.drivers,
        vehicles: data.vehicles,
      };

      const response = await policyApi.create(backendData as any);
      const newPolicy = response.data!;
      
      set((state) => ({
        policies: [newPolicy, ...state.policies],
        isLoading: false,
      }));
      
      return newPolicy;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create policy',
        isLoading: false,
      });
      throw error;
    }
  },

  updatePolicy: async (id: number, data: Partial<PolicyFormData>) => {
    set({ isLoading: true, error: null });
    try {
      // Convert camelCase to snake_case for backend
      const backendData: Partial<BackendPolicyData> = {};
      if (data.policyStatus) backendData.policy_status = data.policyStatus;
      if (data.policyType) backendData.policy_type = data.policyType;
      if (data.policyEffectiveDate) backendData.policy_effective_date = data.policyEffectiveDate;
      if (data.policyExpirationDate) backendData.policy_expiration_date = data.policyExpirationDate;
      if (data.policyHolder) backendData.policy_holder = data.policyHolder;
      if (data.drivers) backendData.drivers = data.drivers;
      if (data.vehicles) backendData.vehicles = data.vehicles;

      const response = await policyApi.update(id, backendData as any);
      const updatedPolicy = response.data!;
      
      set((state) => ({
        policies: state.policies.map((policy) =>
          policy.id === id ? updatedPolicy : policy
        ),
        currentPolicy: state.currentPolicy?.id === id ? updatedPolicy : state.currentPolicy,
        isLoading: false,
      }));
      
      return updatedPolicy;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to update policy',
        isLoading: false,
      });
      throw error;
    }
  },

  deletePolicy: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      await policyApi.delete(id);
      set((state) => ({
        policies: state.policies.filter((policy) => policy.id !== id),
        currentPolicy: state.currentPolicy?.id === id ? null : state.currentPolicy,
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to delete policy',
        isLoading: false,
      });
      throw error;
    }
  },

  generatePolicyPdf: async (id: number) => {
    try {
      const response = await policyApi.generatePdf(id);
      return response.download_url;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to generate PDF',
      });
      throw error;
    }
  },

  setFilters: (newFilters: Partial<PolicyState['filters']>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
  },

  clearError: () => set({ error: null }),

  clearCurrentPolicy: () => set({ currentPolicy: null }),
}));