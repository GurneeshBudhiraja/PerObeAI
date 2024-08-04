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
            # TODO: will add logs here later on
            return [{}]

        clothes_list = clothes_data["matches"]

        return [
            {"type": "image_url", "image_url": collection["metadata"]["url"]}
            for collection in clothes_list
        ]

    except Exception as e:
        # TODO: will handle the error later on with proper logging and custom class
        return [{}]
