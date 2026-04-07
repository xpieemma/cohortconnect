import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const token = () => localStorage.getItem('token')

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