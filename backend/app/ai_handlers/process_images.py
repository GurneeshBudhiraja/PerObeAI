from .image_vector import get_image_vector
from .image_tag import get_image_tag
from utils import validate_tag, format_image_data, logger


async def process_images(images: list[dict]) -> list:
    """
    Processes a list of image URLs, validates their tags, generates vectors, and stores them in the vector store.

    Args:
        images_url (list[dict]): List of dictionaries containing image URLs.

    Returns:
        list: List of dictionaries containing image data.

    Raises:
        Exception: If an error occurs while processing the images.
    """
    try:
        images_data = []
        for image in images:

            image_url = str(image.url)

            image_tag = await get_image_tag(image_url=image_url)

            is_valid_tag = validate_tag(tag=image_tag)

            if not is_valid_tag:
                continue

            image_vector = get_image_vector(image_url=image_url)

            if not image_vector:
                continue

            formatted_data = format_image_data(
                image_url=image_url, image_tag=image_tag, image_vector=image_vector
            )

            images_data.append(formatted_data)

        return images_data

    except Exception as e:
        raise Exception(f"Process Images Error: {e}")
