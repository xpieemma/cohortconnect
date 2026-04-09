import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const token = () => localStorage.getItem('token')

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
});

apiClient.interceptors.response.use(
  (response) => response.data, // Strip away the Axios wrapper immediately
  (error) => {
    const customError = new Error(error.response?.data?.message || 'An unexpected error occurred');
    customError.status = error.response?.status;
    
    if (customError.status === 401) {
       window.location.href = '/login'; // Global unauthorized handler
    }
    
    return Promise.reject(customError);
  }
);

export const userClient = axios.create({
    baseURL: BASE_URL+'/api/users'
    /* ,
    headers: {
        Authorization: `Bearer ${token()}`
    } */
})

export const githubClient = axios.create({
    baseURL: BASE_URL+'/api/users/github'
})

export const organizationClient = axios.create({
    baseURL: BASE_URL+'/api/organizations'
})

export const cohortClient = axios.create({
    baseURL: BASE_URL+'/api/cohorts'
})

userClient.interceptors.request.use((req) => {
    if (token()) {
        req.headers.Authorization = `Bearer ${token()}`
    }
    return req
})

githubClient.interceptors.request.use((req) => {
    if (token()) {
        req.headers.Authorization = `Bearer ${token()}`
    }
    return req
})

organizationClient.interceptors.request.use((req) => {
    if (token()) {
        req.headers.Authorization = `Bearer ${token()}`
    }
    return req
})

cohortClient.interceptors.request.use((req) => {
    if (token()) {
        req.headers.Authorization = `Bearer ${token()}`
    }
    return req
})