const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <h3><span className="logo-icon">🍔</span> TastyGo</h3>
          <p>Delicious food, delivered fast to your doorstep. Order from your favorite restaurants in a few taps.</p>
        </div>
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/menu">Food Menu</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/orders">My Orders</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Categories</h4>
          <ul>
            <li>Pizza</li>
            <li>Burger</li>
            <li>Indian</li>
            <li>Chinese</li>
            <li>Desserts</li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>support@tastygo.example</li>
            <li>+91 98765 43210</li>
            <li>Mumbai, India</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} TastyGo Food Ordering System. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
