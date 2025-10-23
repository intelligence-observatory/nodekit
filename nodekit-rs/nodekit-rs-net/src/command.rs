use nodekit_rs_action::Action;
use nodekit_rs_graph::Graph;

pub enum Command {
    Graph(Graph),
    Tick(Option<Action>),
}
