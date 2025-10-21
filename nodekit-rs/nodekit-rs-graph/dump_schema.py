from json import dumps
from nodekit import Graph

"""
Dump the Graph's schema to disk so that it can be converted into Rust code.
We need to make one slight change to the schema, which is described below.
"""

with open('schema.json', 'wt') as f:
    schema = Graph.model_json_schema()

    # Make a slight repair to the schema because Rust doesn't have string literals:
    keys = schema['$defs']['KeySensor']['properties']['key']['enum']
    for i in range(len(keys)):
        if keys[i] == ' ':
            keys[i] = 'space'
            break
    schema['$defs']['KeySensor']['properties']['key']['enum'] = keys

    f.write(dumps(schema, indent=2))
