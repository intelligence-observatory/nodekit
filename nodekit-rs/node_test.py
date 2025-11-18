from PIL import Image

from nodekit_rs import Card, Rect, Timer, JustificationHorizontal, JustificationVertical, State, Renderer

card_b = Card.video_card(
    rect=Rect(0, 0, 0.33, 0.25),
    timer=Timer(0, None),
    path="nodekit-rs-video/test-video.mp4",
    z_index=1,
    looped=False
)
card_c = Card.text_card(
    rect=Rect(-0.5, -0.5, 1, 0.1),
    timer=Timer(0, None),
    justification_horizontal=JustificationHorizontal.Left,
    justification_vertical=JustificationVertical.Top,
    background_color='#E6E6E600',
    font_size=0.02,
    text="Click the **test image**",
    text_color='#000000FF',
    z_index=2
)

state = State('#AAAAAAFF')
state.add_card(Card.image_card(
    rect=Rect(-0.25, -0.25, 0.25, 0.5),
    timer=Timer(0, None),
    path="nodekit-rs-image/test_image.png",
    z_index=0
))
state.add_card(Card.video_card(
    rect=Rect(0, 0, 0.33, 0.25),
    timer=Timer(0, None),
    path="nodekit-rs-video/test-video.mp4",
    z_index=1,
    looped=False
))
state.add_card(Card.text_card(
    rect=Rect(-0.5, -0.5, 1, 0.1),
    timer=Timer(0, None),
    justification_horizontal=JustificationHorizontal.Left,
    justification_vertical=JustificationVertical.Top,
    background_color='#E6E6E600',
    font_size=0.02,
    text="Click the **test image**",
    text_color='#000000FF',
    z_index=2
))

renderer = Renderer()
state.t_msec = 300
board = renderer.render(state)

# TODO wrap this elsewhere
Image.frombytes('RGBA', (768, 768), board).show()
