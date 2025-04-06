import axios from 'axios';

const API_URL ='http://localhost:8080';


  
export const getChallengeByType = async (type: 'daily' | 'weekly', userId?: string) => {
  const response = await axios.get(`${API_URL}/api/challenge-game/${type}`, {
    params: { userId }
  });
  return response.data;
};

export const completeChallenge = async (type: 'daily' | 'weekly', userId: string) => {
  const response = await axios.post(`${API_URL}/api/challenge-game/${type}/complete`, { userId });
  return response.data;
};