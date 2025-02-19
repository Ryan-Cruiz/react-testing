import Axios from 'axios';
export default Axios.create({
    baseURL: 'http://localhost:3000',
    // headers: {
    //     Authorization: process.env.API_KEY
    // }
});