import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

const FoodCard = ({ food }) => {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!food.available) return;
    addToCart(food, 1);
    showToast(`${food.name} added to cart`);
  };

  return (
    <div className="food-card">
      <Link to={`/food/${food._id}`} className="food-card-image-wrap">
        <img src={food.image} alt={food.name} className="food-card-image" loading="lazy" />
        <span className={`badge ${food.available ? 'badge-available' : 'badge-unavailable'}`}>
          {food.available ? 'Available' : 'Out of stock'}
        </span>
        <span className="badge badge-category">{food.category}</span>
      </Link>
      <div className="food-card-body">
        <div className="food-card-title-row">
          <h3>{food.name}</h3>
          <span className="rating">⭐ {food.rating?.toFixed(1) ?? '4.0'}</span>
        </div>
        <p className="food-card-desc">{food.description}</p>
        <div className="food-card-footer">
          <span className="price">₹{food.price}</span>
          <div className="food-card-actions">
            <Link to={`/food/${food._id}`} className="btn btn-outline btn-sm">
              View Details
            </Link>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddToCart}
              disabled={!food.available}
              title={food.available ? 'Add to cart' : 'Currently unavailable'}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
