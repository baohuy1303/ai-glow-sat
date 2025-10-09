import axios from 'axios';
const URL = 'http://localhost:3000/api';

export const registerUser = async (user) => {
    try {
        const response = await axios.post(`${URL}/user/register`, user);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const loginUser = async (user) => {
    try {
        const response = await axios.post(`${URL}/user/login`, user);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
