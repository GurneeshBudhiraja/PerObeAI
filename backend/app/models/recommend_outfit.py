from pydantic import BaseModel, Field


class RecommendOutfit(BaseModel):
    description: str = Field(
        None,
        title="The description of the outfit",
        description="""         
        Given a list of clothing items and user-specific preferences (including visual impairment status, preferred style, weather, and any additional requirements), generate outfit recommendations. The type of accessibility would not decide the outfit recommendations but would decide how the outfit recommendations are presented to the user. Always use the given clothing data to generate an outfit recommendation for the user. Never recommend clothing items of same category like two upperwear items or two lowerwear items. 

        For a person with no visual impairments, the outfit recommendations should be explained in such a way that the user can visualize the outfit. The user should able to get an idea which clothing items are being recommended and how they can be combined to form an outfit. Make sure the description of outfit recommendations are concise, engaging, empathetic and positive. The description should be clear so that the user is able to get which clothing items are being recommended and how they can be combined to form an outfit. The description should not be more than 3 sentences.

        For a person with visual impairment of color blindness, the descriptions will include explaining explaining the tangible qualities of the clothing item like texture, pattern, and also colors wherever necessary. Again, the description should not be more than 150 words. The description should be clear and concise. Make sure to be empathetic throughout the response. Also, make sure if you mention the colors mention the colors by putting the color blind of that specific type filter in mind.

        For a person with blindness, provide a detailed description of the outfit recommendations in no more than 170 words. Make sure to cover all the tangible qualities of the clothing items like texture, pattern, and whatever elements of the clothes can be felt by a blind individual. Explain the qualities in detail such that the user can visualize the outfit and hence feel and wear it accoringly.

        Make sure the tone should be friendly and engaging. The description should be clear and concise, and the outfit recommendations should be tailored to the user's preferences, provided factors from the user and should only be selected from the clothing data provided. If you are not able to recommend an outfit return a positive message mentioning that you are not able to find something and can mention some short tips from your end. 
        """,
    )
