import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';
import { useToast } from '../context/ToastContext';

const Checkout = () => {
  const { items, subtotal, deliveryFee, tax, discount, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    fullName: user?.name || '',
    mobile: user?.phone || '',
    email: user?.email || '',
    address: '',
    city: '',
    pincode: '',
    paymentMethod: 'Cash on Delivery',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add some delicious food before checking out.</p>
          <Link to="/menu" className="btn btn-primary">Explore Menu</Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!/^\d{10}$/.test(form.mobile)) errs.mobile = 'Enter a valid 10-digit mobile number';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    if (!form.address.trim()) errs.address = 'Delivery address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!/^\d{6}$/.test(form.pincode)) errs.pincode = 'Enter a valid 6-digit pincode';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload = {
        items: items.map((i) => ({ foodId: i._id, quantity: i.quantity })),
        deliveryAddress: {
          fullName: form.fullName,
          mobile: form.mobile,
          email: form.email,
          address: form.address,
          city: form.city,
          pincode: form.pincode,
        },
        paymentMethod: form.paymentMethod,
        discount,
      };
      const res = await placeOrder(payload);
      clearCart();
      showToast('Order placed successfully!');
      navigate(`/order-confirmation/${res.data._id}`);
    } catch (err) {
      setServerError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h3>Delivery Details</h3>

          <label>Full Name</label>
          <input className="input" name="fullName" value={form.fullName} onChange={handleChange} />
          {errors.fullName && <p className="field-error">{errors.fullName}</p>}

          <label>Mobile Number</label>
          <input className="input" name="mobile" value={form.mobile} onChange={handleChange} placeholder="10-digit number" />
          {errors.mobile && <p className="field-error">{errors.mobile}</p>}

          <label>Email</label>
          <input className="input" name="email" type="email" value={form.email} onChange={handleChange} />
          {errors.email && <p className="field-error">{errors.email}</p>}

          <label>Delivery Address</label>
          <textarea className="input" name="address" value={form.address} onChange={handleChange} rows={3} />
          {errors.address && <p className="field-error">{errors.address}</p>}

          <div className="form-row">
            <div>
              <label>City</label>
              <input className="input" name="city" value={form.city} onChange={handleChange} />
              {errors.city && <p className="field-error">{errors.city}</p>}
            </div>
            <div>
              <label>Pincode</label>
              <input className="input" name="pincode" value={form.pincode} onChange={handleChange} placeholder="6-digit pincode" />
              {errors.pincode && <p className="field-error">{errors.pincode}</p>}
            </div>
          </div>

          <label>Payment Method</label>
          <div className="payment-options">
            {['Cash on Delivery', 'UPI', 'Card'].map((method) => (
              <label key={method} className={`payment-option ${form.paymentMethod === method ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method}
                  checked={form.paymentMethod === method}
                  onChange={handleChange}
                />
                {method}
              </label>
            ))}
          </div>

          {serverError && <p className="error-text">{serverError}</p>}

          <button className="btn btn-primary btn-lg btn-full" type="submit" disabled={submitting}>
            {submitting ? 'Placing Order...' : `Place Order - ₹${totalAmount}`}
          </button>
        </form>

        <div className="order-summary">
          <h3>Order Review</h3>
          <div className="review-items">
            {items.map((item) => (
              <div className="review-item" key={item._id}>
                <span>{item.name} x{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="summary-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
          <div className="summary-row"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
          <div className="summary-row"><span>Tax</span><span>₹{tax}</span></div>
          <div className="summary-row"><span>Discount</span><span>-₹{discount}</span></div>
          <hr />
          <div className="summary-row summary-total"><span>Total</span><span>₹{totalAmount}</span></div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
