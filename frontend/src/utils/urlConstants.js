/* 
URL constants for making requests to the backend API
*/

// Getting the URL from the environment variables imported from keys.js
import keys from "../keys/keys";

// Endpoint for the outfit recommendation
const getRecommendationUrl = keys.getRecommendationUrl;

// Endpoint for generating and storing the image embeddings
const imageEmbeddingsURL = keys.imageEmbeddingsURL;

// Endpoint for fetching images based on recommendations
const getImagesURL = keys.getImagesURL;

export { getRecommendationUrl, imageEmbeddingsURL, getImagesURL };
