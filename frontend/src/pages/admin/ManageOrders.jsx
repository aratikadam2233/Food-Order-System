import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/Loader';
import ConfirmDialog from '../../components/ConfirmDialog';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);
  const { showToast } = useToast();

  const fetchOrders = () => {
    setLoading(true);
    getAllOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    if (newStatus === 'Cancelled') {
      setCancelTarget(orderId);
      return;
    }
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast('Order status updated');
      fetchOrders();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const confirmCancel = async () => {
    try {
      await updateOrderStatus(cancelTarget, 'Cancelled');
      showToast('Order cancelled');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setCancelTarget(null);
      fetchOrders();
    }
  };

  if (loading) return <Loader label="Loading orders..." />;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div>
      <h1 className="page-title">Manage Orders</h1>

      {orders.length === 0 && <p className="muted">No orders have been placed yet.</p>}

      <div className="admin-orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order._id}>
            <div className="order-card-header" onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}>
              <div>
                <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                <p className="muted">
                  {order.user?.name} • {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="admin-order-controls" onClick={(e) => e.stopPropagation()}>
                <select
                  className="input status-select"
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="order-total">₹{order.totalAmount}</span>
              </div>
            </div>

            {expandedId === order._id && (
              <div className="order-expanded">
                <div className="review-items">
                  {order.items.map((item) => (
                    <div className="review-item" key={item.food}>
                      <span>{item.name} x{item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="order-address">
                  <p><strong>Customer:</strong> {order.deliveryAddress.fullName} ({order.deliveryAddress.mobile})</p>
                  <p><strong>Address:</strong> {order.deliveryAddress.address}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}</p>
                  <p><strong>Payment:</strong> {order.paymentMethod}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel Order"
        message="Are you sure you want to cancel this order? The customer will see this update immediately."
        confirmLabel="Cancel Order"
        onConfirm={confirmCancel}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
};

export default ManageOrders;
