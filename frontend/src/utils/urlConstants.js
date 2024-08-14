/* 
URL constants for making requests to the backend API
*/

// Endpoint for the outfit recommendation
const recommendationUrl =
  "https://perobeai-bhgx.onrender.com/api/web/v1/recommend";

// Endpoint for generating and storing the image embeddings
const imageEmbeddingsURL =
  "https://perobeai-bhgx.onrender.com/api/web/v1/image-embeddings";

// Endpoint for fetching images based on recommendations
const getImagesURL = "https://perobeai-bhgx.onrender.com/api/web/v1/get-images";

export { recommendationUrl, imageEmbeddingsURL, getImagesURL };
