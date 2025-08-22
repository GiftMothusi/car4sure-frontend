import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  User,
  LoginCredentials,
  RegisterData,
} from '@/types/auth'

interface AuthProps {
  middleware?: 'auth' | 'guest';
  redirectIfAuthenticated?: string;
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

export const useAuth = ({
  middleware,
  redirectIfAuthenticated
}: AuthProps = {}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const { data: user, error, mutate } = useSWR<User>(
    typeof window !== 'undefined' && localStorage.getItem('auth_token') ? '/user' : null,
    () => axios.get('/user').then(res => res.data),
    {
      onError: (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
        }
      }
    }
  )

  const register = async ({
    setErrors,
    ...props
  }: RegisterData & {
    setErrors: (errors: Record<string, string[]>) => void;
  }) => {
    setErrors({})
    setLoading(true)

    try {
      const response = await axios.post('/register', props)
      
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      await mutate(response.data.user)
      setLoading(false)
      return response.data
    } catch (error) {
      setLoading(false)
      if ((error as ErrorResponse).response?.status !== 422) throw error
      setErrors((error as ErrorResponse).response.data.errors)
      throw error
    }
  }

  const login = async ({
    setErrors,
    ...props
  }: LoginCredentials & {
    setErrors: (errors: Record<string, string[]>) => void;
  }) => {
    setErrors({})
    setLoading(true)

    try {
      const response = await axios.post('/login', props)
      
      localStorage.setItem('auth_token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      
      await mutate(response.data.user)
      setLoading(false)
      return response.data
    } catch (error) {
      setLoading(false)
      if ((error as ErrorResponse).response?.status !== 422) throw error
      setErrors((error as ErrorResponse).response.data.errors)
      throw error 
    }
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
    } catch (error) {
      console.error('Logout failed:', error)
      toast.error('Logout failed', {
        description: 'An error occurred while logging out. Please try again.',
      })
    }
    
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    
    await mutate(undefined, false)
    
    router.push('/login')
  }

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user && !loading) {
      router.push(redirectIfAuthenticated)
    } else if (middleware === 'auth' && !user && !loading && error?.response?.status === 401) {
      router.push('/login')
    }
  }, [user, error, middleware, redirectIfAuthenticated, router, loading])

  return {
    user,
    mutate,
    loading: loading || (!user && !error && typeof window !== 'undefined' && localStorage.getItem('auth_token')),
    isAuthenticated: !!user,
    register,
    login,
    logout,
  }
}