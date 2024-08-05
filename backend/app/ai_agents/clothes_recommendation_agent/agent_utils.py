from utils import logger


def format_clothes_data(clothes_data: dict) -> list[dict]:
    """
    Formats the clothes collection data to a proper format

    Args:
      collection_data : list[dict] : The collection data either upperwear or lowerwear.

    Returns:
      list[dict] : The formatted collection data.
    """
    try:
        if "matches" not in clothes_data:
            return [{}]
        clothes_list = clothes_data["matches"]

        return [
            {"type": "image_url", "image_url": collection["metadata"]["url"]}
            for collection in clothes_list
        ]

    except Exception as e:

        logger.error(f"Error in formatting the clothes data {e} in {function.__name__}")

        return [{}]
