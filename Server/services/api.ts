import axios from 'axios';

const API_URL ='http://localhost:8080/api';

export const getChallengeByType = async (type: 'daily' | 'weekly', userId?: string) => {
  const response = await axios.get(`${API_URL}/challenges/${type}`, {
    params: { userId }
  });
  return response.data;
};

export const completeChallenge = async (type: 'daily' | 'weekly', userId: string) => {
  const response = await axios.post(`${API_URL}/challenges/${type}/complete`, { userId });
  return response.data;
};