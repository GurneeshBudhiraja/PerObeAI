"""
Contains the ImageData class representing image metadata, vector, and unique identifier.
"""

from dataclasses import dataclass
from uuid import uuid4

@dataclass
class ImageData:
  id: str = str(uuid4())
  values: list[int|float]
  metadata: dict[str,any]