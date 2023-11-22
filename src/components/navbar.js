import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const Navbar = () => {
  const [cookies, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();
  const logout = () => {
    setCookies("access_token", "");
    window.localStorage.removeItem("userID");
    navigate("/auth");
  };

  return (
    <div className="navbar">
      <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/create-recipe">Create Recipe</a></li>
      <li><a href="/update-recipe">Update Recipe</a></li>
      <li><a href="/saved-recipes">Saved Recipes</a></li>
      {!cookies.access_token ? (
        <li><a href="/auth">Login</a></li>
      ) : (
        <div className="logout">

          <li><button onClick={logout}>Logout</button></li>
        </div>
      )}
      </ul>
    </div>
    
  );
};
