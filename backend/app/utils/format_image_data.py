from uuid import uuid4


def format_image_data(
    image_url: str, image_tag: dict, image_vector: list
) -> dict[str, any]:
    """
    Formats image data into a dictionary containing a unique ID, image vector, and metadata.

    Args:
        image_url (str): The URL of the image.
        image_tag (dict): The tag of the image.
        image_vector (list): The vector representation of the image.

    Returns:
        Instance of ImageData class containing the unique ID, image vector, and metadata.
    """

    image_metadata = {
        "url": image_url,
        "tag": image_tag["tag"],
    }

    return {"id": str(uuid4()), "values": image_vector, "metadata": image_metadata}
