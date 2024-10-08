from pinecone.grpc import PineconeGRPC as Pinecone
import os
from app.constants import PINECONE_INDEX_NAME
from app.ai_handlers import get_image_vector


class VectorStore:
    try:

        def __init__(self, user_id: str) -> None:

            # Initializes the Pinecone vector store for a specific user.
            # The user_id is used to create the namespace and query vectors in the store.
            # A Pinecone instance is created using the API key from environment variables.
            # An index object is obtained for interacting with the specified Pinecone index.

            self.user_id = user_id

            self.pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

            self.index = self.pc.Index(PINECONE_INDEX_NAME)

        def insert_vectors(self, images_vector_data: list[dict]) -> int:
            """
            Inserts the vectors into the vector store

            Args:
                images_vector_data (list): The list of vectors to be inserted

            Returns:
                int: The number of vectors inserted
            """
            try:

                insert_response = self.index.upsert(
                    vectors=images_vector_data,
                    namespace=self.user_id,
                )

                return insert_response.upserted_count

            except Exception as e:
                raise Exception(
                    f"Error while inserting the vectors into the vector store: {str(e)}"
                )

        def fetch_similar_vectors(
            self,
            vector_list: list[float | int],
            top_k: int = 3,
            include_values: bool = False,
            filter: dict = {},
            include_metadata: bool = False,
        ):
            """
            Fetches the similar vectors from the vector store

            Args:
                vector_list (list): The vector for which the similar vectors are to be fetched
                top_k (int, optional): The number of similar vectors to be fetched. Defaults to 3.
                include_values (bool, optional): Whether to include the vector values. Defaults to False.
                filter (dict, optional): The filter(metadata) to be applied to the query. Defaults to {}.
                include_metadata (bool, optional): Whether to include the metadata in the response. Defaults to False.

            Returns:

            """
            try:

                similar_vectors = self.index.query(
                    namespace=self.user_id,
                    vector=vector_list,
                    filter=filter,
                    top_k=top_k,
                    include_values=include_values,
                    include_metadata=include_metadata,
                )

                return similar_vectors

            except Exception as e:

                raise Exception(
                    f"Error while fetching the similar vectors from the vector store: {str(e)}"
                )

        def delete_vector(self, image_url: str) -> dict:
            """
            Deletes the vector from the vector store

            Args:
                image_url: str: The image url for which the vector is to be deleted

            Returns:
                dict: The response
            """
            try:

                image_embedding = get_image_vector(image_url=image_url)

                filter_criteria = {"url": image_url}

                vector_data = self.fetch_similar_vectors(
                    vector_list=image_embedding,
                    filter=filter_criteria,
                    include_metadata=True,
                )["matches"]

                if not vector_data:
                    return {"vectors_deleted": 0}

                vector_id = [vector["id"] for vector in vector_data]

                self.index.delete(ids=vector_id, namespace=self.user_id)

                return {"vectors_deleted": len(vector_id)}

            except Exception as e:

                raise Exception(
                    f"Error while deleting the vector from the vector store: {str(e)}"
                )

    except Exception as e:
        raise Exception
