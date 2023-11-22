import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

export const UpdateRecipe = () => {
  const [fetchRecipeName, setFetchRecipeName] = useState("");
  const [recipe, setRecipe] = useState(null); // Start with null, will hold the full recipe object once fetched
  const [cookies, _] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const handleFetchRecipe = async () => {
    try {
      const response = await axios.post(
        `https://recipe-island-backend.onrender.com/recipes/fetch`,
        { name: fetchRecipeName },
        { headers: { Authorization: cookies.access_token } }
      );
      setRecipe({ ...response.data, userOwner: response.data._id }); // Assuming the recipe data includes a userOwner field
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    const ingredients = [...recipe.ingredients, ""];
    setRecipe({ ...recipe, ingredients });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `https://recipe-island-backend.onrender.com/recipes/update`,
        { ...recipe },
        { headers: { Authorization: cookies.access_token } }
      );
      alert("Recipe Updated");
      navigate("/");
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  return (
    <div className="create-recipe">
      <div className="box">
      {!recipe && (
        <div className="update">
          <input
            type="text"
            placeholder="Enter recipe name to fetch"
            value={fetchRecipeName}
            onChange={(e) => setFetchRecipeName(e.target.value)}
          />
          <button onClick={handleFetchRecipe}>Fetch Recipe</button>
        </div>
      )}
    </div>
      {recipe && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleChange}
          />
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={recipe.description}
            onChange={handleChange}
          ></textarea>
          <label htmlFor="ingredients">Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <input
              key={index}
              type="text"
              name="ingredients"
              value={ingredient}
              onChange={(event) => handleIngredientChange(event, index)}
            />
          ))}
          <button type="button" onClick={handleAddIngredient}>
            Add Ingredient
          </button>
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
          ></textarea>
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={recipe.imageUrl}
            onChange={handleChange}
          />
          <img src={recipe.imageUrl} alt={recipe.name} />
          <label htmlFor="cookingTime">Cooking Time (minutes)</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={recipe.cookingTime}
            onChange={handleChange}
          />
          <button type="submit">Update Recipe</button>
        </form>
      )}
    </div>
  );
};
