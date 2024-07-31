# Utils function for the vector store insertion
from vector_store import insert_vectors

# Utils functions for the image tag validation and formatting the image data into a dictionary
from utils import validate_tag, format_image_data

# Function to get the image vector of the image from the image URL
from image_vector import get_image_vector

# Function to get the tag of the image from the image URL
from image_tag import get_image_tag

async def process_images(images_url: list[dict], user_id: str) -> dict:
    """
    Processes a list of image URLs, validates their tags, generates vectors, and stores them in the vector store.

    Args:
        images_url (list[dict]): List of dictionaries containing image URLs.
        user_id (str): The user ID for namespace and querying vectors.

    Returns:
        dict: A dictionary
    """
    try:
        
        images_data = []

        # Loop through all the image URLs dictionary
        for image in images_url:
            image_url = image["url"]

            # Get the image tag
            image_tag = await get_image_tag(image_url=image_url)

            # Check the tag of the image
            is_valid_image = validate_tag(tag=image_tag)

            # Skip the iteration if the image["tag"] is none
            if not is_valid_image:
                print(f"Item is of {image_tag['tag']}")
                continue
            
            # Generate the vector of the image
            image_vector = await get_image_vector(image_url=image_url)
            
            # TODO: Will remove the print statement later on
            print(f"Image vector generated for the image :: {len(image_vector)} :: {image_vector[:5]}")
            if not image_vector:
                # TODO: Will handle the error later on with different approach
                raise ValueError("Error in generating the image description")
            
            # Format the image data into a dictionary
            formatted_data = format_image_data(image_url=image_url, image_tag=image_tag, image_vector=image_vector)

            # Append the image data dictionary to the list
            images_data.append(formatted_data)

        # Check if the images_vector_list is empty
        if not images_data:
            # TODO: will handle this differently later on
            return {}
        
        # Insert the vectors into the vector store
        total_vectors_stored = insert_vectors(images_vector_data=images_data, user_id=user_id)

        # TODO: will handle this differntly later on
        print(total_vectors_stored)
        return {"total vectors stored": total_vectors_stored}
        
    
    except Exception as e:
        # TODO: Add logging and change the error handling later on
        return []






