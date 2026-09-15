import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getFoodById } from '../services/foodService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';

const FoodDetails = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    setError('');
    getFoodById(id)
      .then((res) => setFood(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader label="Loading food details..." />;
  if (error)
    return (
      <div className="page-container">
        <p className="error-text">{error}</p>
        <Link to="/menu" className="btn btn-outline">Back to Menu</Link>
      </div>
    );
  if (!food) return null;

  const handleAddToCart = () => {
    addToCart(food, quantity);
    showToast(`${quantity} x ${food.name} added to cart`);
  };

  return (
    <div className="page-container">
      <div className="food-details">
        <div className="food-details-image">
          <img src={food.image} alt={food.name} />
        </div>
        <div className="food-details-info">
          <span className="badge badge-category">{food.category}</span>
          <h1>{food.name}</h1>
          <p className="rating">⭐ {food.rating?.toFixed(1) ?? '4.0'} Rating</p>
          <p className="food-details-desc">{food.description}</p>

          <div className="food-details-ingredients">
            <h4>Ingredients</h4>
            <div className="tag-list">
              {(food.ingredients || []).map((ing) => (
                <span key={ing} className="tag">{ing}</span>
              ))}
            </div>
          </div>

          <div className="food-details-meta">
            <span className={`badge ${food.available ? 'badge-available' : 'badge-unavailable'}`}>
              {food.available ? 'Available' : 'Out of stock'}
            </span>
            <span className="price price-lg">₹{food.price}</span>
          </div>

          <div className="quantity-selector">
            <button
              className="qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              className="qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <button
            className="btn btn-primary btn-lg"
            onClick={handleAddToCart}
            disabled={!food.available}
          >
            Add to Cart - ₹{food.price * quantity}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;
