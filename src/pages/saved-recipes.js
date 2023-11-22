import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { useCookies } from "react-cookie";

export const SavedRecipes = () => {
  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();
  const [cookies, _] = useCookies(["access_token"]);

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `https://recipe-island-backend.onrender.com/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  const handleDeleteRecipe = async (recipeName) => {
    // Show a confirmation dialog
    if (
      window.confirm(
        `Are you sure you want to delete the recipe "${recipeName}"?`
      )
    ) {
      try {
        const response = await axios.post(
          `https://recipe-island-backend.onrender.com/recipes/delete`,
          { name: recipeName },
          { headers: { Authorization: cookies.access_token } }
        );
        if (response.data.message === "Recipe deleted successfully") {
          // Remove the recipe from the state to update the UI
          setSavedRecipes(
            savedRecipes.filter((recipe) => recipe.name !== recipeName)
          );
          alert("Recipe deleted successfully"); // Optional: Show a success message
        }
      } catch (err) {
        console.error("Error deleting the recipe:", err);
        alert("Failed to delete the recipe."); // Optional: Show an error message
      }
    }
  };

  return (
    <div className="container">
      <h1>Saved Recipes</h1>
      <ul>
        {savedRecipes.map((recipe) => (
          <li key={recipe._id}>
            <div>
              <h2>{recipe.name}</h2>
              <button onClick={() => handleDeleteRecipe(recipe.name)}className="savebtn">
                Delete
              </button>
            </div>
            <div className="description">
            <p>{recipe.description}</p>
            </div>            
            <img src={recipe.imageUrl} alt={recipe.name} className="image2" />
            <div className="info">
            <p>Cooking Time: {recipe.cookingTime} minutes</p>

            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
