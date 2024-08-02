def format_collection_data(collection_data:list[dict])->list[dict]:
  """
  Formats the collection data to a proper format

  Args:
    collection_data : list[dict] : The collection data either upperwear or lowerwear.

  Returns:
    list[dict] : The formatted collection data.
  """
  try:
    collection_list = collection_data["matches"]

    formatted_collection = [{"image_url":collection["metadata"]["url"]} for collection in collection_list ]

    return formatted_collection
  except Exception:
    # TODO: will handle the error later on with proper logging and custom class
    print("Error in format_collection_data agent_utils")
    return []