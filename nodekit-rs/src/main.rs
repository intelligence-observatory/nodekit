mod args;

use crate::args::Args;
use clap::Parser;
use nodekit_rs_net::{Command, Connection};
use nodekit_rs_state::{State, TickResult};
use std::path::Path;

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
        let result = on_receive(&mut state, received, &args.asset_directory).await;
        // Send the tick result.
        connection.send(result).await.unwrap();
    }
}

async fn on_receive(state: &mut Option<State>, received: Command, directory: &Path) -> TickResult {
    match received {
        Command::Graph(graph) => {
            // Convert the graph into stateful information.
            let mut s = State::new(graph, directory).unwrap();
            // Move asset files into the cache directory.
            s.current_node().get_assets().await.unwrap();
            // Store the state.
            *state = Some(s);
            // Nothing has happened yet.
            TickResult::default()
        }
        Command::Tick(action) => match state.as_mut() {
            Some(state) => state.tick(action).unwrap(),
            None => TickResult::default(),
        },
    }
}
