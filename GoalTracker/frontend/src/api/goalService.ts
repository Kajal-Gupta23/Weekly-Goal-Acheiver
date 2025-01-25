import axios from './axios';

export const getGoals = async () => {
  try {
    const response = await axios.get('/goals/');
    return response.data;
  } catch (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
};

export const createGoal = async (goalData) => {
  try {
    const response = await axios.post('/goals/', goalData);
    return response.data;
  } catch (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
};
