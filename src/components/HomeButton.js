import { Link } from "react-router-dom";
function HomeButton() {
  return (
    <div>
      <div className="backButton">
        <Link to={`/`} className="mainButton">
        Back Home
        </Link>
      </div>
    </div>
  );
}

export default HomeButton;