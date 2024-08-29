import { Link } from "react-router-dom";

function AppHeader() {
  return (
    <div className="flex justify-between items-center px-4 border-b-2 h-header">
      <Link to="/">
        <div>Fitness</div>
      </Link>
      <nav>
        <Link to="/">Home</Link>
      </nav>
    </div>
  );
}

export default AppHeader;
