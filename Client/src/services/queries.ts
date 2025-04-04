import { useQuery } from '@tanstack/react-query';
import axios from '../Utils/axios';
import { useNavigate } from 'react-router-dom';

export const useGetMe = () => {
  const navigate=useNavigate();
  return  useQuery({
    queryKey: ['me'], // Unique query key
    queryFn: async () => {
      try {
        
        // API call to get user data
        const response = await axios.get('/api/auth/getMe', { withCredentials: true });
        if (!response.data.success ||!response) {
          navigate('/login');
          throw new Error(response.data.error || 'Something went wrong');
        }

        // Update user state in the store
        return response.data.user;
      } catch (error) {
        // Reset user state in case of an error

        // Throw error to be caught by the TanStack Query error handling
        throw new Error(error instanceof Error ? error.message : 'Unknown Error');
      }
    },
    retry: false, // Prevent retrying on failure
  });

};



export const useGetUserById = (userId:string|null) => {
    return  useQuery({
      queryKey: ['user', userId], // Unique query key including userId
      queryFn: async () => {
        if (!userId) {
          throw new Error('User ID is required');
        }
  
        try {
          // API call to fetch user by ID
          const response = await axios.get(`/api/user/get/${userId}`);
          if (!response.data.success) {
            throw new Error(response.data.message || 'Failed to fetch user');
          }
  
          return response.data.user;
        } catch (error:any) {
          // Handle errors and rethrow for React Query
          throw new Error(
            error.response?.data?.message || error.message || 'Unknown Error'
          );
        }
      },
      enabled: !!userId, // Only run the query if userId is provided
      retry: false, // Disable retries on failure
    });
  
  };