import axios from 'axios';
export default axios.create({
    baseURL: 'http://localhost:3000',
    // headers: {
    //     Authorization: process.env.API_KEY
    // }
});