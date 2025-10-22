use crate::args::Args;
use clap::Parser;
use nodekit_rs_net::{Connection, Received};
use nodekit_rs_state::{State, TickResult};
use std::path::Path;

mod args;

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
async fn main() {
    let args = Args::parse();
    // Create a connection.
    let mut connection = Connection::new(&args.socket).unwrap();
    let mut state = None;
    loop {
        // Receive a command.
        let received = connection.receive().await.unwrap();
        // Execute the command or tick.
        let result = on_receive(&mut state, received, &args.asset_directory);
        // Send the tick result.
        connection.send(result).await.unwrap();
    }
}

fn on_receive(state: &mut Option<State>, received: Received, directory: &Path) -> TickResult {
    match received {
        Received::Graph(graph) => {
            *state = Some(State::new(graph, directory).unwrap());
            TickResult::default()
        }
        Received::Tick => match state.as_mut() {
            Some(state) => state.tick().unwrap(),
            None => TickResult::default(),
        },
    }
}
