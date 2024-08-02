# Get the image vector of the image from the image URL
from .image_vector import get_image_vector

# Get the tag of the image from the image URL
from .image_tag import get_image_tag

# Utility functions for the image tag validation and formatting the image data into a dictionary
from utils import validate_tag, format_image_data


async def process_images(images: list[dict]) -> dict:
    """
    Processes a list of image URLs, validates their tags, generates vectors, and stores them in the vector store.

    Args:
        images_url (list[dict]): List of dictionaries containing image URLs.

    Returns:
        dict: A dictionary
    """
    try:        
        images_data = []

        for image in images:
            image_url = image["url"]

            image_tag = await get_image_tag(image_url=image_url)

            is_valid_tag = validate_tag(tag=image_tag)
            
            if not is_valid_tag:
                continue

            image_vector = get_image_vector(image_url=image_url)
            
            if not image_vector:
                # TODO: Will handle the error later on with different approach
                raise ValueError("Error in generating the image description")
            
            # Format the image vector and metadata into a dictionary
            formatted_data = format_image_data(image_url=image_url, image_tag=image_tag, image_vector=image_vector)

            # Append the formatted data into the images_data list
            images_data.append(formatted_data)
            
        # Check if the images_vector_list is empty
        if not images_data:
            # TODO: will handle this differently later on
            return []
        
        return images_data
        
    
    except Exception as e:
        # TODO: Add logging and change the error handling later on
        return []






