/* 
URL constants for making requests to the backend API
*/

// Getting the URL from the environment variables imported from keys.js
import keys from "../keys/keys";

// Endpoint for the outfit recommendation
const getRecommendationUrl = `${keys.serverURL}/api/web/v1/recommend`;

// Endpoint for generating and storing the image embeddings
const imageEmbeddingsURL = `${keys.serverURL}/api/web/v1/image-embeddings`;

// Endpoint for fetching images based on recommendations
const getImagesURL = `${keys.serverURL}/api/web/v1/get-images`;

export { getRecommendationUrl, imageEmbeddingsURL, getImagesURL };
