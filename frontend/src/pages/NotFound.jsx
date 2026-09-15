import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page-container">
    <div className="empty-state">
      <span className="empty-icon">🍽️</span>
      <h2>404 - Page Not Found</h2>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </div>
  </div>
);

export default NotFound;
