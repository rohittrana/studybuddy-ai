import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => (
  <div className="not-found">
    <p className="not-found__hand">Hmm, that page isn't in your notes.</p>
    <h1>404</h1>
    <Link to="/" className="btn btn--primary">
      Back home
    </Link>
  </div>
);

export default NotFound;
