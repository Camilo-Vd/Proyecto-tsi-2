import axios from "axios";

const axiosInstance = axios.create({
<<<<<<< HEAD
    baseURL: import.meta.env.VITE_API_URL,
=======
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
>>>>>>> 94e2bc5ce7b43e7faff708ddfd0d336c643f4862
})

axiosInstance.interceptors.request.use(config=>{
    const token = localStorage.getItem('token')
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default axiosInstance