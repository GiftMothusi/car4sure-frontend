import useSWR from 'swr'
import axios from '@/lib/axios'
import { useState } from 'react'
import { Policy, PolicyFormData, PolicyListResponse, BackendPolicyData } from '@/types/policy'

interface PolicyFilters {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

interface ErrorResponse {
  response: {
    status: number;
    data: {
      message: string;
      errors: Record<string, string[]>;
    };
  };
}

export const usePolicy = (filters: PolicyFilters = {}) => {
  const [loading, setLoading] = useState(false)

  const queryParams = new URLSearchParams()
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      queryParams.append(key, value.toString())
    }
  })
  const queryString = queryParams.toString()
  const swrKey = queryString ? `/policies?${queryString}` : '/policies'

  const { data: policiesData, error, mutate } = useSWR<PolicyListResponse>(
    swrKey,
    () => axios.get(swrKey).then(res => res.data)
  )

  const createPolicy = async ({
    data,
    setErrors
  }: {
    data: PolicyFormData;
    setErrors: (errors: Record<string, string[]>) => void;
  }) => {
    setErrors({})
    setLoading(true)

    try {
      const backendData = {
        policy_status: data.policyStatus,
        policy_type: data.policyType,
        policy_effective_date: data.policyEffectiveDate,
        policy_expiration_date: data.policyExpirationDate,
        policy_holder: data.policyHolder,
        drivers: data.drivers,
        vehicles: data.vehicles,
      }

      const response = await axios.post('/policies', backendData)
      await mutate() 
      setLoading(false)
      return response.data.data
    } catch (error) {
      setLoading(false)
      if ((error as ErrorResponse).response?.status !== 422) throw error
      setErrors((error as ErrorResponse).response.data.errors)
      throw error
    }
  }

  const updatePolicy = async ({
    id,
    data,
    setErrors
  }: {
    id: number;
    data: Partial<PolicyFormData>;
    setErrors: (errors: Record<string, string[]>) => void;
  }) => {
    setErrors({})
    setLoading(true)

    try {
      const backendData: BackendPolicyData = {}
      if (data.policyStatus) backendData.policy_status = data.policyStatus
      if (data.policyType) backendData.policy_type = data.policyType
      if (data.policyEffectiveDate) backendData.policy_effective_date = data.policyEffectiveDate
      if (data.policyExpirationDate) backendData.policy_expiration_date = data.policyExpirationDate
      if (data.policyHolder) backendData.policy_holder = data.policyHolder
      if (data.drivers) backendData.drivers = data.drivers
      if (data.vehicles) backendData.vehicles = data.vehicles

      const response = await axios.put(`/policies/${id}`, backendData)
      await mutate()
      setLoading(false)
      return response.data.data
    } catch (error) {
      setLoading(false)
      if ((error as ErrorResponse).response?.status !== 422) throw error
      setErrors((error as ErrorResponse).response.data.errors)
      throw error
    }
  }

  const deletePolicy = async (id: number) => {
    setLoading(true)
    try {
      await axios.delete(`/policies/${id}`)
      await mutate() 
      setLoading(false)
      return true
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const generatePolicyPdf = async (id: number) => {
    setLoading(true)
    try {
      const response = await axios.post(`/policies/${id}/pdf`)
      setLoading(false)
      return response.data.download_url
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  return {
    policies: policiesData?.data || [],
    pagination: policiesData?.meta || {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
      from: 1,
      to: 15,
    },
    loading: loading || (!policiesData && !error),
    error,
    mutate,
    createPolicy,
    updatePolicy,
    deletePolicy,
    generatePolicyPdf,
  }
}

export const usePolicyDetail = (id: number | null) => {
  const [loading, setLoading] = useState(false)

  const { data: policyData, error, mutate } = useSWR<{ data: Policy }>(
    id ? `/policies/${id}` : null,
    () => axios.get(`/policies/${id}`).then(res => res.data)
  )

  const updatePolicy = async ({
    data,
    setErrors
  }: {
    data: Partial<PolicyFormData>;
    setErrors: (errors: Record<string, string[]>) => void;
  }) => {
    if (!id) throw new Error('Policy ID is required')

    setErrors({})
    setLoading(true)

    try {
      const backendData: BackendPolicyData = {}
      if (data.policyStatus) backendData.policy_status = data.policyStatus
      if (data.policyType) backendData.policy_type = data.policyType
      if (data.policyEffectiveDate) backendData.policy_effective_date = data.policyEffectiveDate
      if (data.policyExpirationDate) backendData.policy_expiration_date = data.policyExpirationDate
      if (data.policyHolder) backendData.policy_holder = data.policyHolder
      if (data.drivers) backendData.drivers = data.drivers
      if (data.vehicles) backendData.vehicles = data.vehicles

      const response = await axios.put(`/policies/${id}`, backendData)
      await mutate()
      setLoading(false)
      return response.data.data
    } catch (error) {
      setLoading(false)
      if ((error as ErrorResponse).response?.status !== 422) throw error
      setErrors((error as ErrorResponse).response.data.errors)
      throw error
    }
  }

  const deletePolicy = async () => {
    if (!id) throw new Error('Policy ID is required')

    setLoading(true)
    try {
      await axios.delete(`/policies/${id}`)
      setLoading(false)
      return true
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  const generatePolicyPdf = async () => {
    if (!id) throw new Error('Policy ID is required')

    setLoading(true)
    try {
      const response = await axios.post(`/policies/${id}/pdf`)
      setLoading(false)
      return response.data.download_url
    } catch (error) {
      setLoading(false)
      throw error
    }
  }

  return {
    policy: policyData?.data || null,
    loading: loading || (!policyData && !error && id),
    error,
    mutate,
    updatePolicy,
    deletePolicy,
    generatePolicyPdf,
  }
}