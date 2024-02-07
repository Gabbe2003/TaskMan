import { useContext } from 'react';
import AuthContext from './authHandlers/authContext';

const Dashboard = () => {
  // Use AuthContext to access user information if needed
  const { user } = useContext(AuthContext);

  // Optionally, you can handle the case where user is null (not authenticated)
  if (!user) {
    return <div>Please log in to view this page.</div>;
  }

  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
};

export default Dashboard;
