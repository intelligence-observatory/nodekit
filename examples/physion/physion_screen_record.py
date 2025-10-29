import nodekit as nk
graph = nk.load_graph(path='physion-demo.nkg')
trace = nk.play(graph)
print(trace)