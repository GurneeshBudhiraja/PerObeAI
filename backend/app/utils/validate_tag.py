from enum import Enum


class TagType(Enum):
    UPPERWEAR = "upperwear"
    LOWERWEAR = "lowerwear"


def validate_tag(tag: dict) -> bool:
    """
    Validates if the tag is either 'upperwear' or 'lowerwear'.

    Args:
        tag (dict): The tag dictionary.

    Returns:
        bool: True if the tag is either 'upperwear' or 'lowerwear', False otherwise.
    """
    if "tag" not in tag:
        return False

    tag_value = tag["tag"]
    if tag_value not in [tag.value for tag in TagType]:
        return False

    return True
