import { useEffect, useState } from 'react';
import { getFoods, createFood, updateFood, deleteFood } from '../../services/foodService';
import { useToast } from '../../context/ToastContext';
import Loader from '../../components/Loader';
import ConfirmDialog from '../../components/ConfirmDialog';

const CATEGORIES = ['Pizza', 'Burger', 'Indian', 'Chinese', 'Snacks', 'Desserts', 'Beverages'];

const emptyForm = {
  name: '',
  description: '',
  category: 'Pizza',
  price: '',
  image: '',
  ingredients: '',
  rating: 4,
  available: true,
};

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { showToast } = useToast();

  const fetchFoods = () => {
    setLoading(true);
    getFoods()
      .then((res) => setFoods(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormErrors({});
    setShowForm(true);
  };

  const openEditForm = (food) => {
    setForm({
      name: food.name,
      description: food.description,
      category: food.category,
      price: food.price,
      image: food.image,
      ingredients: (food.ingredients || []).join(', '),
      rating: food.rating,
      available: food.available,
    });
    setEditingId(food._id);
    setFormErrors({});
    setShowForm(true);
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Food name is required';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.price || Number(form.price) <= 0) errs.price = 'Enter a valid price';
    if (!form.image.trim()) errs.image = 'Image URL is required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { ...form, price: Number(form.price), rating: Number(form.rating) };
      if (editingId) {
        await updateFood(editingId, payload);
        showToast('Food item updated successfully');
      } else {
        await createFood(payload);
        showToast('Food item added successfully');
      }
      setShowForm(false);
      fetchFoods();
    } catch (err) {
      setFormErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleAvailability = async (food) => {
    try {
      await updateFood(food._id, { available: !food.available });
      showToast(`${food.name} marked as ${!food.available ? 'available' : 'unavailable'}`);
      fetchFoods();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteFood(deleteTarget._id);
      showToast(`${deleteTarget.name} deleted successfully`);
      setDeleteTarget(null);
      fetchFoods();
    } catch (err) {
      showToast(err.message, 'error');
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="admin-header">
        <h1 className="page-title">Manage Food Menu</h1>
        <button className="btn btn-primary" onClick={openAddForm}>+ Add Food</button>
      </div>

      {loading && <Loader label="Loading foods..." />}
      {error && <p className="error-text">{error}</p>}

      {!loading && !error && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id}>
                  <td><img src={food.image} alt={food.name} className="admin-table-img" /></td>
                  <td>{food.name}</td>
                  <td>{food.category}</td>
                  <td>₹{food.price}</td>
                  <td>⭐ {food.rating?.toFixed(1)}</td>
                  <td>
                    <button
                      className={`badge-btn ${food.available ? 'badge-available' : 'badge-unavailable'}`}
                      onClick={() => handleToggleAvailability(food)}
                    >
                      {food.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="admin-table-actions">
                    <button className="btn btn-outline btn-sm" onClick={() => openEditForm(food)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(food)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box modal-box-lg" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit Food Item' : 'Add New Food Item'}</h3>
            <form onSubmit={handleSubmit} className="admin-form">
              <label>Food Name</label>
              <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              {formErrors.name && <p className="field-error">{formErrors.name}</p>}

              <label>Description</label>
              <textarea className="input" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              {formErrors.description && <p className="field-error">{formErrors.description}</p>}

              <div className="form-row">
                <div>
                  <label>Category</label>
                  <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Price (₹)</label>
                  <input className="input" type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
                  {formErrors.price && <p className="field-error">{formErrors.price}</p>}
                </div>
              </div>

              <label>Image URL</label>
              <input className="input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              {formErrors.image && <p className="field-error">{formErrors.image}</p>}

              <label>Ingredients (comma separated)</label>
              <input className="input" value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />

              <div className="form-row">
                <div>
                  <label>Rating (0-5)</label>
                  <input className="input" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </div>
                <div className="checkbox-row">
                  <label>
                    <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
                    {' '}Available
                  </label>
                </div>
              </div>

              {formErrors.submit && <p className="error-text">{formErrors.submit}</p>}

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Saving...' : editingId ? 'Update Food' : 'Add Food'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Food Item"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ManageFoods;
