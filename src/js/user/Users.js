import api from '../api.js';

// Get users from backend
export const getUsers = async () => {
    const res = await api.get("/users")
    // console.log(res, 'res');
    return res.data;
}