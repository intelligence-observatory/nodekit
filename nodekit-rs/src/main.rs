mod args;

use crate::args::Args;
use clap::Parser;
use nodekit_rs_request::Request;
use nodekit_rs_response::Response;
use nodekit_rs_socket::*;
use nodekit_rs_state::State;

fn main() {
    let args = Args::parse();
    // Create a connection.
    let mut connection = Connection::new(&args.socket).unwrap();
    let mut state = None;
    let default_response = Response::default();
    loop {
        // Receive a command.
        let received = connection.receive().unwrap();
        // Execute the command or tick.
        let response = on_receive(&mut state, received, &default_response);
        // Send the tick result.
        connection.send(response).unwrap();
    }
}

fn on_receive<'r>(
    state: &'r mut Option<State>,
    received: Request,
    default_response: &'r Response,
) -> &'r Response {
    match received {
        Request::Graph(graph) => {
            // Convert the graph into stateful information.
            let s = state.insert(State::new(graph).unwrap());
            // Initial tick.
            s.tick(None).unwrap()
        }
        Request::Tick(action) => match state.as_mut() {
            Some(state) => state.tick(action).unwrap(),
            None => default_response,
        },
        Request::Reset => {
            *state = None;
            default_response
        }
    }
}
