## Building NodeKit
* Run `make build` from the repo root to build the Python package; this is the canonical build path.
* Note that `npm` is not used to distribute the NodeKit browser runtime (i.e. `nodekit.js` and `nodekit.css`; these ship with the Python build (see `_static`). 

## Documentation

* To view the MkDocs site on one's local machine with live reloading, run `make view-docs` from the root of this repository.
* Google-style docstrings are used in this project.
* Roughly structuring the documentation following guidance laid out in [Diátaxis](https://diataxis.fr). 
* The [griffe-pydantic](https://mkdocstrings.github.io/griffe-pydantic/) mkdocs extension is used to document pydantic models in NodeKit; see [StackOverflow](https://stackoverflow.com/questions/78281256/automatic-documentation-of-pydantic-basemodel-with-mkdocstrings) discussion 
