from nodekit import Region
import nodekit_rs

def test_region_mask():
    region = Region(x=0, y=0, w=1, h=1, z_index=None)
    nodekit_rs.testing.test_region(region)
    region.z_index = 1
    nodekit_rs.testing.test_region(region)
    try:
        nodekit_rs.testing.test_region('invalid')
    except AttributeError:
        pass
