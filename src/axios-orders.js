import axios from 'axios';

const instance = axios.create({
    baseURL: "https://react-my-burguer-3d025.firebaseio.com/"
});

export default instance;