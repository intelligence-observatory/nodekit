import uuid

import pydantic


class MyModel(pydantic.BaseModel):
    id: int
    _my_secret: str


    @pydantic.model_validator(mode='after')
    def set_secret(self) -> 'MyModel':
        self._my_secret = str(uuid.uuid4())
        return self




# %%
m = MyModel(id = 3)
print(m._my_secret)
print(m.model_dump_json())
# %%

class MyModel2(pydantic.BaseModel):
    id: int
    _path: str

m2 = MyModel2(id = 3, path='5')

xdump = (m2.model_dump_json())
print(xdump)
m2_round = MyModel2.model_validate_json(xdump)
print(m2.model_json_schema())