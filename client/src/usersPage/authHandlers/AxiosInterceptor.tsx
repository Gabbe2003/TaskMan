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
        tokenRefreshAttempted = true; // Mark that a token refresh attempt is being made

        try {
          const refreshResponse = await plainHttp.post('/refresh');
          if (refreshResponse.status === 200) {
            setUser(refreshResponse.data); // Update user with new token data
            tokenRefreshAttempted = false; // Reset flag on successful refresh
            return plainHttp(originalRequest); // Retry the original request with the new token
          } else {
            // If refresh wasn't successful, handle appropriately without retrying
            console.log('Unable to refresh token, handling failure...');
            return Promise.reject(); // Stop further attempts by rejecting the promise
          }
        } catch (refreshError) {
          console.log('Token refresh failed:', refreshError);
          // Handle the failure (e.g., logout or redirect to login) without retrying
          return Promise.reject(refreshError); // Reject the promise to stop further attempts
        }
      }

      // For other errors or conditions, simply reject the promise
      return Promise.reject(error);
    }
  );
};



export { plainHttp, setupInterceptors };