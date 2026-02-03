import nodekit as nk

card = nk.cards.TextCard(
    text='Hello world!',
    region=nk.Region(x=0, y=300, w=600, h=90),
)
sensor = nk.sensors.SliderSensor(
    duration_msec=10000,
    num_bins=6,
    initial_bin_index=0
)