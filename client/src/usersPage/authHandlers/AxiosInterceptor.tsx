import axios from 'axios';

const plainHttp = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

let tokenRefreshAttempted = false; // Global flag to track refresh attempts
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const setupInterceptors = (setUser:any) => {
  plainHttp.interceptors.response.use(
    response => response,
    async (error) => {
      const originalRequest = error.config;

      // Check for 401 error, if we haven't already tried to refresh the token, and if a refresh hasn't failed before
      if (error.response && error.response.status === 401 && !originalRequest._retry && !tokenRefreshAttempted) {
        originalRequest._retry = true;
        tokenRefreshAttempted = true; 

        try {
          const refreshResponse = await plainHttp.post('/refresh');
          if (refreshResponse.status === 200) {
            setUser(refreshResponse.data); 
            tokenRefreshAttempted = false; 
            return plainHttp(originalRequest);
          } else {
            // If refresh wasn't successful, handle appropriately without retrying
            console.log('Unable to refresh token, handling failure...');
            return Promise.reject(); 
          }
        } catch (refreshError) {
          console.log('Token refresh failed:', refreshError);
          return Promise.reject(refreshError); 
        }
      }

      return Promise.reject(error);
    }
  );
};



export { plainHttp, setupInterceptors };