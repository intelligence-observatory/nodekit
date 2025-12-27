Many task designs impose maximum and minimum time limits on the agent's choice.

### Setting a time limit for making an Action

To end the Node at a particular time if the agent has not generated an Action, simply set `duration_msec` to an integer value.

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

