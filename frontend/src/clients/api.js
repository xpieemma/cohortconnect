import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const token = () => localStorage.getItem('token')

export const userClient = axios.create({
    baseURL: BASE_URL+'/api/users'/* ,
    headers: {
        Authorization: `Bearer ${token()}`
    } */
})

export const projectClient = axios.create({
    baseURL: BASE_URL+'/api/projects'
})

export const taskClient = axios.create({
    baseURL: BASE_URL+'/api/tasks'
})

const waitTime = 2000;

userClient.interceptors.request.use(async (req) => {
    await new Promise(resolve => setTimeout(resolve, waitTime))
    if (token()) {
        req.headers.Authorization = `Bearer ${token()}`
    }
    return req
})

projectClient.interceptors.request.use(async (req) => {
    await new Promise(resolve => setTimeout(resolve, waitTime))
    if (token()) {
        req.headers.Authorization = `Bearer ${token()}`
    }
    return req
})

taskClient.interceptors.request.use(async (req) => {
    await new Promise(resolve => setTimeout(resolve, waitTime))
    if (token()) {
        req.headers.Authorization = `Bearer ${token()}`
    }
    return req
})