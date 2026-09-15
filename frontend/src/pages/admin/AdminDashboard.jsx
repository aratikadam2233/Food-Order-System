import { useEffect, useState } from 'react';
import { getDashboardStats } from '../../services/dashboardService';
import StatCard from '../../components/StatCard';
import Loader from '../../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <div className="stats-grid">
        <StatCard icon="🍽️" label="Total Food Items" value={stats.totalFoodItems} accent="blue" />
        <StatCard icon="📦" label="Total Orders" value={stats.totalOrders} accent="purple" />
        <StatCard icon="⏳" label="Pending Orders" value={stats.pendingOrders} accent="orange" />
        <StatCard icon="✅" label="Completed Orders" value={stats.completedOrders} accent="green" />
        <StatCard icon="💰" label="Total Revenue" value={`₹${stats.totalRevenue}`} accent="pink" />
      </div>
    </div>
  );
};

export default AdminDashboard;
