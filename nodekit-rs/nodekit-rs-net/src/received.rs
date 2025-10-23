use crate::Action;
use nodekit_rs_graph::Graph;

pub enum Received {
    Graph(Graph),
    Tick(Option<Action>),
}
