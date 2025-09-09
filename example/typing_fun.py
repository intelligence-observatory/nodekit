from typing import TypedDict, Annotated
import pydantic


# %%
class Movie(TypedDict):
    __pydantic_config__ = pydantic.ConfigDict(extra='forbid')
    name: Annotated[str, pydantic.Field(
        description="The name of the movie",
        min_length=2,
    )]


class MyMod(pydantic.BaseModel):
    movie: Movie

x = MyMod(
    movie={
        "name": "Inception",
         #"year": 2010  # This would raise a validation error due to 'extra=forbid'
    }
)

schema = MyMod.model_json_schema()
print(schema)