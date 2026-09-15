import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrderById } from '../services/orderService';
import Loader from '../components/Loader';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Fetching your order..." />;
  if (error) return <div className="page-container"><p className="error-text">{error}</p></div>;
  if (!order) return null;

  return (
    <div className="page-container">
      <div className="confirmation-box">
        <span className="confirmation-icon">✅</span>
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. Your food is being prepared.</p>

        <div className="confirmation-details">
          <div className="summary-row"><span>Order ID</span><span>#{order._id.slice(-8).toUpperCase()}</span></div>
          <div className="summary-row"><span>Status</span><span className="badge badge-available">{order.status}</span></div>
          <div className="summary-row"><span>Total Amount</span><span>₹{order.totalAmount}</span></div>
        </div>

        <div className="review-items">
          {order.items.map((item) => (
            <div className="review-item" key={item.food}>
              <span>{item.name} x{item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="confirmation-actions">
          <Link to="/orders" className="btn btn-primary">View My Orders</Link>
          <Link to="/menu" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
