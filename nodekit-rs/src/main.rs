use std::path::Path;
use std::thread::spawn;
use clap::Parser;
use tokio::sync::mpsc::{unbounded_channel, UnboundedReceiver, UnboundedSender};
use nodekit_rs_net::{Connection, Received};
use nodekit_rs_state::{State, TickResult};
use crate::args::Args;

mod args;

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
async fn main() {
    let args = Args::parse();
    // Create a connection.
    let mut connection = Connection::new(&args.socket).unwrap();
    let mut state = None;
    loop {
        let received = connection.receive().await.unwrap();
        on_receive(&mut state, received).await;
    }
}

fn on_receive<'s>(state: &'s mut Option<State<'s>>, received: Received, board: &mut [u8], directory: &Path) -> TickResult {
    match received {
        Received::Graph(graph) => {
            *state = Some(State::new(&graph, directory).unwrap());
            TickResult::default()
        }
        Received::Tick => {
            match state.as_mut() {
                Some(state) => state.tick().unwrap(),
                None => TickResult::default()
            }
        }
    }
}