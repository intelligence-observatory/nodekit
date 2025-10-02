# Node

## Board

The Board is the square region of the Participant's display on which the Graph unfolds. Points on the Board are given using _Board coordinates_, where (0, 0) is the center of the Board and (0.5, 0.5) is the top right. 

NodeKit defines the **ideal Board** as 768 x 768 _reference pixels_. A reference pixel is a unit of _visual angle_ defined in the [W3C specification](https://www.w3.org/TR/css-values-3/#reference-pixel) as the visual angle of one pixel on a device with 96 [dpi](https://en.wikipedia.org/wiki/Dots_per_inch) at an arm's length. Given an arm's length of 28 inches, a reference pixel is ~0.0213° of visual angle, and the Board is ~16.26° x 16.26° of the Participant's visual field when viewed straight on. 

In practice, the Board is set to 768 x 768 _CSS pixels_, because the W3C spec _recommends_ that browsers [map a single CSS pixel to a single reference pixel](https://www.w3.org/TR/css-values-3/#absolute-lengths). This mapping is always approximate, in that the Participant's viewing position is not known by the browser. 

## Cards

## Sensors 

## Outcomes

## Effects

# Action
