from pydantic import BaseModel, Field


class RecommendOutfit(BaseModel):
    description: str = Field(
        None,
        title="The description of the outfit",
        description="""
            Given a list of clothing items and user-specific preferences—including visual impairment status, preferred style, weather, and any additional requirements—generate outfit recommendations. Accessibility needs will determine how the recommendations are presented, not the outfit choices themselves. Always select clothing items from the provided data, ensuring no two items of the same category (e.g., two tops or two bottoms) are recommended together.

            For users without visual impairments, provide outfit recommendations that help them easily visualize the ensemble. Descriptions should be concise, engaging, empathetic, and positive, clearly indicating which clothing items are recommended and how they can be combined to form a cohesive outfit. Limit the description such that the user is able to get what clothing items have been recommended to the user.

            For users with color blindness, describe the tangible qualities of the clothing items, such as texture and pattern, while mentioning colors where necessary. Ensure the description is enough to get the color blind person know exactly what has been referred to, remains clear and concise, and is empathetic. If colors are mentioned, consider the specific type of color blindness when describing them.

            For users who are blind, the desciption should cover all the attributes of the recommended outfit. Since the user cannot see the outfit due to blindness, the description should include any pattern, texture, feel, any logos or designs, any unique features that stands out and will be helpful for the user to identify the clothing item by the sense of touch. Make sure that to mention the description of the clothing items in a way that the user can easily find them using the sense of touch. The description can include anything that is unique to the clothing item that will help the user to identify the clothing item.

            Also, irrespective of the user's accessibility needs, make sure to be specific about the clothing items being described. For instance, if you mention blue denim jeans, ensure to elaborate on that so the user could know exactly what type of denim jeans have been referred to. Also, if it mentions a white t-shirt, ensure to elaborate on that so the user could know exactly what type of white t-shirt has been referred to.

            Maintain a friendly and engaging tone throughout. Descriptions should be clear, concise, and tailored to the user's preferences and provided data. If an outfit cannot be recommended, return a positive message stating that no suitable options were found, and offer brief, helpful tips instead.
        """,
    )
