import React, { useReducer, useContext } from 'react'
import { CLEAR_ALERT, DISPLAY_ALERT, CLEAR_VALUES, LOGOUT_USER, SETUP_USER_BEGIN, SETUP_USER_ERROR, SETUP_USER_SUCCESS, TOGGLE_SIDEBAR, UPDATE_USER_BEGIN, UPDATE_USER_SUCCESS, UPDATE_USER_ERROR, HANDLE_CHANGE, CREATE_JOB_BEGIN, CREATE_JOB_ERROR, CREATE_JOB_SUCCESS, GET_JOBS_BEGIN, GET_JOBS_SUCCESS, SET_EDIT_JOB, DELETE_JOB_BEGIN, EDIT_JOB_BEGIN, EDIT_JOB_SUCCESS, EDIT_JOB_ERROR, SHOW_STATS_BEGIN, SHOW_STATS_SUCCESS, CLEAR_FILTERS, CHANGE_PAGE } from './actions'
import reducer from './reducer'
import axios from 'axios'


const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')
export const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    token,
    userLocation: userLocation || '',
    showSidebar: false,
    isEditing: false,
    EditJobId: '',
    jobLocation: userLocation || '',
    company: '',
    position: '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['pending', 'interview', 'declined'],
    status: 'pending',
    jobs: [],
    numOfPages: 1,
    page: 1,
    totalJobs: 0,
    stats: {},
    monthlyApplications: [],
    search: '',
    searchStatus: 'all',
    searchType: 'all',
    sort: 'latest',
    sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],

}


const AppContext = React.createContext()

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const authFetch = axios.create({
        baseURL: '/api/v1'
    })
    authFetch.interceptors.request.use(
        (config) => {
            config.headers.common['Authorization'] = `Bearer ${state.token}`
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )
    authFetch.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            console.log(error.response)
            if (error.response.status === 401) {
                logoutUser()
            }
            return Promise.reject(error)
        }
    )
    const clearAlert = () => {
        setTimeout(() => {
            dispatch({ type: CLEAR_ALERT })
        }, [3000])
    }
    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
        clearAlert()
    }
    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR })
    }
    const handleChange = ({ name, value }) => {
        dispatch({
            type: HANDLE_CHANGE,
            payload: { name, value },
        })
    }
    const clearValues = () => {
        dispatch({ type: CLEAR_VALUES })
    }
    const addUserToLocalStorage = ({ user, token, location }) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('location', location)
    }
    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('location')
    }
    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
    }
    const setupUser = async (currentUser, endPoint, alertText) => {
        dispatch({ type: SETUP_USER_BEGIN })
        try {
            const response = await axios.post('/api/v1/auth/' + endPoint, currentUser)
            const { user, token, location } = response.data
            dispatch({
                type: SETUP_USER_SUCCESS,
                payload: {
                    user,
                    token,
                    location,
                    alertText
                }
            })
            addUserToLocalStorage({
                user,
                token,
                location,
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type: SETUP_USER_ERROR,
                payload: {
                    msg: error.response.data.msg
                }
            })
        }
        clearAlert()
    }
    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
            const { data } = await authFetch.patch('/auth/updateUser', currentUser)

            // no token
            const { user, location } = data

            dispatch({
                type: UPDATE_USER_SUCCESS,
                payload: { user, location, token },
            })

            addUserToLocalStorage({ user, location, token: initialState.token })
        } catch (error) {
            if (error.response.status !== 401) {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: { msg: error.response.data.msg },
                })
            }
        }
        clearAlert()
    }
    const createJob = async () => {
        dispatch({ type: CREATE_JOB_BEGIN })
        try {
            const { company, position, status, jobLocation, jobType } = state
            await authFetch.post('/jobs', {
                company,
                position,
                status,
                jobLocation,
                jobType
            })
            dispatch({ type: CREATE_JOB_SUCCESS })
            clearValues()
        } catch (error) {
            if (error.status !== 401) return
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: error.response.data.msg
            })
        }
        clearAlert()
    }
    const getJobs = async () => {
        const { searchStatus, searchType, sort, search, page } = state
        let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
        if (search) {
            url = `${url}&search=${search}`
        }
        dispatch({ type: GET_JOBS_BEGIN })
        try {
            const { data: { jobs, totalJobs, numOfPages } } = await authFetch.get(url)
            dispatch({
                type: GET_JOBS_SUCCESS,
                payload: { jobs, totalJobs, numOfPages }
            })
        } catch (error) {
            logoutUser()
        }
        clearAlert()
    }
    const setEditJob = (id) => {
        console.log(id);
        dispatch({ type: SET_EDIT_JOB, payload: { id } })
    }
    const deleteJob = async (id) => {
        dispatch({ type: DELETE_JOB_BEGIN })
        try {
            await authFetch.delete(`/jobs/${id}`)
            getJobs()
        } catch (error) {
            logoutUser()
        }
    }
    const editJob = async () => {
        dispatch({ type: EDIT_JOB_BEGIN })
        try {
            const {
                EditJobId,
                company,
                jobLocation,
                position,
                status,
                jobType
            } = state
            await authFetch.patch('/jobs/' + EditJobId, {
                company,
                jobLocation,
                position,
                status,
                jobType
            })
            dispatch({ type: EDIT_JOB_SUCCESS })
            clearValues()
        } catch (error) {
            if (error.status === 401) return
            dispatch({
                type: EDIT_JOB_ERROR,
                payload: { msg: error.response.data.msg }
            })
        }
        clearAlert()
    }
    const showStats = async () => {
        dispatch({ type: SHOW_STATS_BEGIN })
        try {
            const { data } = await authFetch('/jobs/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications,
                },
            })
        } catch (error) {

            logoutUser()
        }

        clearAlert()
    }
    const clearFilters = () => {
        dispatch({ type: CLEAR_FILTERS })
    }
    const changePage = (pageNumber) => {
        dispatch({ type: CHANGE_PAGE, payload: { page: pageNumber } })
    }
    return <AppContext.Provider value={{
        ...state,
        displayAlert,
        setupUser,
        logoutUser,
        addUserToLocalStorage,
        removeUserFromLocalStorage,
        toggleSidebar,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage
    }} >
        {children}
    </AppContext.Provider>
}
export const useAppContext = () => {
    return useContext(AppContext)
}

export { AppProvider }

