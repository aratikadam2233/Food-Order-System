import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFoods } from '../services/foodService';
import FoodCard from '../components/FoodCard';
import Loader from '../components/Loader';

const CATEGORIES = ['All', 'Pizza', 'Burger', 'Indian', 'Chinese', 'Snacks', 'Desserts', 'Beverages'];

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const category = searchParams.get('category') || 'All';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';

  const fetchFoods = useCallback(() => {
    setLoading(true);
    setError('');
    getFoods({ category, search, sort })
      .then((res) => setFoods(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [category, search, sort]);

  useEffect(() => {
    fetchFoods();
  }, [fetchFoods]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Food Menu</h1>

      <div className="menu-controls">
        <input
          type="text"
          placeholder="Search food..."
          defaultValue={search}
          onChange={(e) => updateParam('search', e.target.value)}
          className="input search-input"
        />

        <select value={sort} onChange={(e) => updateParam('sort', e.target.value)} className="input">
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating_desc">Rating: High to Low</option>
        </select>
      </div>

      <div className="category-filters">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`chip ${category === cat ? 'chip-active' : ''}`}
            onClick={() => updateParam('category', cat === 'All' ? '' : cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <Loader label="Loading menu..." />}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && foods.length === 0 && (
        <div className="empty-state">
          <p>No food items match your search.</p>
        </div>
      )}
      {!loading && !error && foods.length > 0 && (
        <div className="food-grid">
          {foods.map((food) => (
            <FoodCard key={food._id} food={food} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
