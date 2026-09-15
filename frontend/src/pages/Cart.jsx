import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const { items, increaseQuantity, decreaseQuantity, removeFromCart, subtotal, deliveryFee, tax, discount, totalAmount } =
    useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet. Let's fix that!</p>
          <Link to="/menu" className="btn btn-primary">
            Explore Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <div className="cart-item" key={item._id}>
              <img src={item.image} alt={item.name} className="cart-item-image" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="price">₹{item.price}</p>
              </div>
              <div className="quantity-selector">
                <button className="qty-btn" onClick={() => decreaseQuantity(item._id)}>
                  −
                </button>
                <span className="qty-value">{item.quantity}</span>
                <button className="qty-btn" onClick={() => increaseQuantity(item._id)}>
                  +
                </button>
              </div>
              <div className="cart-item-subtotal">₹{item.price * item.quantity}</div>
              <button className="btn-icon-remove" onClick={() => removeFromCart(item._id)} title="Remove item">
                🗑️
              </button>
            </div>
          ))}
        </div>

        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{deliveryFee}</span>
          </div>
          <div className="summary-row">
            <span>Tax</span>
            <span>₹{tax}</span>
          </div>
          <div className="summary-row">
            <span>Discount</span>
            <span>-₹{discount}</span>
          </div>
          <hr />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>₹{totalAmount}</span>
          </div>
          <button className="btn btn-primary btn-lg btn-full" onClick={handleCheckout}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
