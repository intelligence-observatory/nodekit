import nodekit as nk


if __name__ == '__main__':
    node = nk.Node(
        stimulus=nk.cards.ImageCard(
            image=nk.assets.Image.from_path('./images/avatar_000_room_L0R1.jpg'),
        ),
        sensor=nk.sensors.KeySensor(keys=[' '])
    )

    trace = nk.play(node)