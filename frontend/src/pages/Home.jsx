import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFoods } from '../services/foodService';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';

const CATEGORIES = [
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burger', icon: '🍔' },
  { name: 'Indian', icon: '🍛' },
  { name: 'Chinese', icon: '🥡' },
  { name: 'Snacks', icon: '🍟' },
  { name: 'Desserts', icon: '🍰' },
  { name: 'Beverages', icon: '🥤' },
];

const Home = () => {
  const [popularFoods, setPopularFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    getFoods({ sort: 'rating_desc' })
      .then((res) => {
        if (mounted) setPopularFoods(res.data.slice(0, 4));
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      <section className="hero">
        <div className="hero-content">
          <h1>Delicious Food, <span>Delivered Fast</span></h1>
          <p>Order your favorite meals from the best kitchens near you. Fresh ingredients, fast delivery, unbeatable taste.</p>
          <Link to="/menu" className="btn btn-primary btn-lg">
            Order Now
          </Link>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800"
            alt="Delicious food spread"
          />
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Popular Categories</h2>
        <div className="category-grid">
          {CATEGORIES.map((cat) => (
            <Link to={`/menu?category=${cat.name}`} key={cat.name} className="category-card">
              <span className="category-icon">{cat.icon}</span>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <h2 className="section-title">Popular Food Items</h2>
        {loading && <Loader label="Fetching popular dishes..." />}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && (
          <div className="food-grid">
            {popularFoods.map((food) => (
              <FoodCard key={food._id} food={food} />
            ))}
          </div>
        )}
        <div className="section-cta">
          <Link to="/menu" className="btn btn-outline">
            View Full Menu
          </Link>
        </div>
      </section>

      <section className="section why-us">
        <h2 className="section-title">Why Choose Us</h2>
        <div className="why-grid">
          <div className="why-card">
            <span className="why-icon">🚀</span>
            <h3>Fast Delivery</h3>
            <p>Hot, fresh food delivered to your door in record time.</p>
          </div>
          <div className="why-card">
            <span className="why-icon">🥗</span>
            <h3>Quality Ingredients</h3>
            <p>We partner with kitchens that use only fresh, quality ingredients.</p>
          </div>
          <div className="why-card">
            <span className="why-icon">💳</span>
            <h3>Easy Payments</h3>
            <p>Pay with Cash on Delivery, UPI, or Card - whatever suits you.</p>
          </div>
          <div className="why-card">
            <span className="why-icon">📍</span>
            <h3>Live Order Tracking</h3>
            <p>Track your order status from kitchen to doorstep in real time.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
