
To end the Node at a particular time if the agent has not generated an Action, simply set the Sensor's `duration_msec` field to an integer value.

???+ info "Example of adding a time limit to a Node"

    ```python hl_lines="8" linenums="1"
    import nodekit as nk
    
    # The Node's KeySensor will time out with a WaitAction after 5000 msec:
    node = nk.Node(
        stimulus=nk.cards.TextCard(text='Hello, world!'),
        sensor=nk.sensors.KeySensor(
            keys=['f', 'j'],
            duration_msec=5000 
        )
    )
    ```

    Note that by default, the Sensor's `duration_msec` is set to None, which means the agent has an unlimited amount of time to generate an Action for the Sensor.

