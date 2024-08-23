/* 
URL constants for making requests to the backend API
*/
// TODO: Change URLS back before pushing to production
// Endpoint for the outfit recommendation
const getRecommendationUrl =
  // "https://perobeai-bhgx.onrender.com/api/web/v1/recommend";
  "http://127.0.0.1:8000/api/web/v1/recommend";

// Endpoint for generating and storing the image embeddings
const imageEmbeddingsURL =
  // "https://perobeai-bhgx.onrender.com/api/web/v1/image-embeddings";
  "http://127.0.0.1:8000/api/web/v1/image-embeddings";

// Endpoint for fetching images based on recommendations
// const getImagesURL = "https://perobeai-bhgx.onrender.com/api/web/v1/get-images";
const getImagesURL = "http://127.0.0.1:8000/api/web/v1/get-images";

export { getRecommendationUrl, imageEmbeddingsURL, getImagesURL };
