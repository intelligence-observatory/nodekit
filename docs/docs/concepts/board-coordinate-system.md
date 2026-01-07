

The Board is NodeKit's name for the region of the Agent's display where visual content is rendered. Locations on the Board are described using _Board coordinates_, where:

* (0, 0) is the center of the Agent's display.
* Positive increases in the first coordinate (x) causes movement in the **rightward** direction.
* Positive increases in the second coordinate (y) causes movement in the **upward** direction.
* Units are normatively specified as **reference pixels**. A reference pixel is a unit of _visual angle_ defined in the [W3C specification](https://www.w3.org/TR/css-values-3/#reference-pixel) as the visual angle of one pixel on a
  device with 96 [dpi](https://en.wikipedia.org/wiki/Dots_per_inch) at an arm's length. Given an arm's length of 28 inches, a reference pixel is ~0.0213° of visual angle. In practice, NodeKit interprets Board units as _CSS pixels_, which the W3C spec _recommends_ be mapped by the browser [1:1 with reference pixels](https://www.w3.org/TR/css-values-3/#absolute-lengths). Note that this mapping is always
  approximate, in that the browser 1) does not know the Agent's viewing position, and 2) does not know the physical size of _device pixels_.


Thus, a Board coordinate of (100, 100) would indicate a point that is 100 pixels to the right, and 100 pixels up from the Agent's display.

Long story short: the **NodeKit Board is the central 1024 x 768 pixel** region on the agent's display.

???+ info "Size of Board in visual degrees"
    The size of the normative Board (1024 x 768 _reference pixels_) is ~21.81° x 16.35° of the Agent's visual field when viewed straight on.
 


