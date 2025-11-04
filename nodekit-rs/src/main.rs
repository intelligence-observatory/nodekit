mod args;
mod connection;

use crate::args::Args;
use clap::Parser;
use connection::Connection;
use nodekit_rs_request::Request;
use nodekit_rs_response::Response;
use nodekit_rs_state::State;

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
        let result = on_receive(&mut state, received).await;
        // Send the tick result.
        connection
            .send(
                result,
                state.as_ref().map(|state| state.nodekit_version.as_str()),
            )
            .await
            .unwrap();
    }
}

async fn on_receive(state: &mut Option<State>, received: Request) -> Response {
    match received {
        Request::Graph(graph) => {
            // Convert the graph into stateful information.
            let s = State::new(graph).unwrap();
            // Store the state.
            *state = Some(s);
            // Nothing has happened yet.
            Response::default()
        }
        Request::Tick(action) => match state.as_mut() {
            Some(state) => state.tick(action).unwrap(),
            None => Response::default(),
        },
        Request::Reset => {
            *state = None;
            Response::default()
        }
    }
}
