import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
})

//req Interceptor :auto-inject access token 
api.interceptors.request.use((config) => {
  /* As we are injecting the token in the config authHeader,
  we need to access it from localStorage  */
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config //now config is updated with injected token
})

//res Interceptor :handle 401 and refresh acces token if expired 
api.interceptors.response.use(
  //if token not exppired , directly return the response
  (response) => {
    return response.data
  },

  //if error occours,go to this functionality
  async (error) => {
    /*here originaRequest is like we tried to call api/getJobs and failed
    whereas error.config is that request api/getjobs
    so we strored that failed request in the originalRequest so that
    when we will get a new token , we will retry the same request
    and the user wont feel any server crash */

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        console.log('Token Expired..attempting refresh new Access Token');
        const res = await api.post('/auth/token/refresh/', {})
        const { newAccessToken } = res;
        localStorage.setItem('token', newAccessToken)
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (e) {
        console.log('Refresh Token Failed:', e);
        localStorage.removeItem('token')
        window.location.href = '/login';
        return Promise.reject(e);
      }
    }
    // Log other errors (like 400) for debugging
    if (error.response) {
      console.error(`API Error [${error.response.status}]:`, error.response.data);
    }
    return Promise.reject(error);
  })


//Authentication routes

// Login — validates credentials and stores token on success directly
export async function loginUser(email, password) {
  const data = await api.post('/auth/login/', { email, password });
  if (data.accessToken) {
    localStorage.setItem("token", data.accessToken);
    if (data.user) { localStorage.setItem("user", JSON.stringify(data.user)); }
  }
  return data;
}

// Signup — sends OTP to email, returns requiresOtp: true
export async function signupUser({ username, email, password }) {
  return api.post('/auth/signup/', { username, email, password });
}

// Verify Signup OTP — marks user as verified on success
export async function verifySignupOtp(email, otp) {
  return api.post('/auth/verify-signup-otp/', { email, otp });
}

export async function forgotPassword(email) {
  return api.post('/auth/forgot-password/', { email });
}
export async function resetPassword(token, password) {
  return api.post('/auth/reset-password/', { token, newPassword: password });
}

export default api;
