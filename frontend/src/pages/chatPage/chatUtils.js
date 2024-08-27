import {
  getImagesURL,
  getRecommendationUrl,
} from "../../utils/urlConstants.js";

// Get recommendation based on the user input
const getRecommendation = async (
  prompt,
  setImages,
  setError,
  setLoading,
  city,
  preferred_fashion_style,
  accessibility,
  inputRef,
  accessToken,
  setRecommendation,
  setPrompt,
  setUnmountRecommendation
) => {
  try {
    setLoading(true);

    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    // Request body for the recommendation
    const requestBody = JSON.stringify({
      user_prompt: prompt.trim(),
      city,
      preferred_fashion_style,
      accessibility,
    });

    const response = await fetch(getRecommendationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: requestBody,
    });

    const data = await response.json();

    if (!data?.response) {
      throw new Error("Something went wrong. Please try again later.");
    }

    // Replace the old recommendation with the new one
    setUnmountRecommendation(true);

    setTimeout(() => {
      setImages([]);
      setRecommendation(data);
      setUnmountRecommendation(false);
    }, 450);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
    setPrompt("");

    // Focusing the input field
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 0);
  }
};

// Get the images based on the recommendation
const getImages = async ({
  recommendation,
  accessToken,
  setLoading,
  setError,
  setImages,
  inputRef,
}) => {
  try {
    setLoading(true);

    const outfit_description = recommendation;

    const url = getImagesURL;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ outfit_description }),
    });

    const imagesData = await response.json();

    if (imagesData?.image_urls?.length) {
      setLoading(false);

      setImages(imagesData.image_urls);
    } else {
      setLoading(false);

      setError("No images found. Please try again.");
    }
  } catch (error) {
    setLoading(false);
    setError("Error in getting images. Please try again later.");
  } finally {
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 0);
  }
};

export { getImages, getRecommendation };
