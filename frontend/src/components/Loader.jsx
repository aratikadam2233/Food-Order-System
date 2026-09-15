const Loader = ({ label = 'Loading...' }) => (
  <div className="loader-wrap">
    <div className="spinner" />
    <p>{label}</p>
  </div>
);

export default Loader;
