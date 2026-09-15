import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMyOrders } from '../services/orderService';
import Loader from '../components/Loader';
import StatusTimeline from '../components/StatusTimeline';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading your orders..." />;
  if (error) return <div className="page-container"><p className="error-text">{error}</p></div>;

  if (orders.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h2>No orders yet</h2>
          <p>You haven't placed any orders. Start exploring our menu!</p>
          <Link to="/menu" className="btn btn-primary">Explore Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">My Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-card-header">
              <div>
                <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                <p className="muted">{new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <span className={`badge ${order.status === 'Cancelled' ? 'badge-unavailable' : 'badge-available'}`}>
                {order.status}
              </span>
            </div>

            <StatusTimeline status={order.status} />

            <div className="review-items">
              {order.items.map((item) => (
                <div className="review-item" key={item.food}>
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="order-card-footer">
              <span>Payment: {order.paymentMethod}</span>
              <span>Delivering to: {order.deliveryAddress.city}, {order.deliveryAddress.pincode}</span>
              <span className="order-total">Total: ₹{order.totalAmount}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
