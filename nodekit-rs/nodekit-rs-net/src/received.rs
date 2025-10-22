use nodekit_rs_graph::Graph;
use crate::Action;

pub enum Received {
    Graph(Graph),
    Tick(Option<Action>)
}
