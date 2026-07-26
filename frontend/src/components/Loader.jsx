import "./Loader.css";

const Loader = ({ label = "Loading..." }) => (
  <div className="loader">
    <span className="loader__spinner" aria-hidden="true" />
    <span className="loader__label">{label}</span>
  </div>
);

export default Loader;
