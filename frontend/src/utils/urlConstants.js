/* 
URL constants for making requests to the backend API
*/

// Endpoint for the outfit recommendation
const getRecommendationUrl = "http://127.0.0.1:8000/api/web/v1/recommend";

// Endpoint for generating and storing the image embeddings
const imageEmbeddingsURL = "http://127.0.0.1:8000/api/web/v1/image-embeddings";

// Endpoint for fetching images based on recommendations
const getImagesURL = "http://127.0.0.1:8000/api/web/v1/get-images";

export { getRecommendationUrl, imageEmbeddingsURL, getImagesURL };
