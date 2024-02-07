import { useState, useEffect } from 'react';
import axios from 'axios';

const UserDataDisplay = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/get', {
          withCredentials: true,
        });
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setError('Failed to fetch user data');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div>Loading user data...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>User Data</h2>
      {/* Render user data here. Example: */}
      <pre>{JSON.stringify(userData, null, 2)}</pre>
      {/* You can customize this part to render the data as needed */}
    </div>
  );
};

export default UserDataDisplay;
