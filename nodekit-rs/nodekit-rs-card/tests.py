from nodekit._internal.types.regions import Mask
import nodekit_rs

def test_region_mask():
    nodekit_rs.testing.test_region_mask("rectangle")
    nodekit_rs.testing.test_region_mask("ellipse")
    try:
        nodekit_rs.testing.test_region_mask("invalid")
    except ValueError:
        pass
    