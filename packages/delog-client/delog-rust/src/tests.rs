use super::*;
use std::io::{Read, Write};
use std::net::TcpListener;
use std::thread;

fn receiver(status: u16, body: &'static str) -> (String, thread::JoinHandle<String>) {
    let listener = TcpListener::bind("127.0.0.1:0").unwrap();
    let endpoint = format!("http://{}/graphql", listener.local_addr().unwrap());
    let handle = thread::spawn(move || {
        let (mut stream, _) = listener.accept().unwrap();
        stream
            .set_read_timeout(Some(Duration::from_secs(5)))
            .unwrap();
        let mut bytes = Vec::new();
        let mut buffer = [0; 4096];
        loop {
            let count = stream.read(&mut buffer).unwrap();
            if count == 0 {
                break;
            }
            bytes.extend_from_slice(&buffer[..count]);
            let request = String::from_utf8_lossy(&bytes);
            if let Some(header_end) = request.find("\r\n\r\n") {
                let content_length: usize = request[..header_end]
                    .lines()
                    .find_map(|line| {
                        line.to_lowercase()
                            .strip_prefix("content-length: ")
                            .map(|value| value.parse().unwrap())
                    })
                    .unwrap();
                if bytes.len() >= header_end + 4 + content_length {
                    break;
                }
            }
        }
        let response = format!(
            "HTTP/1.1 {status} Test\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{body}",
            body.len(),
        );
        stream.write_all(response.as_bytes()).unwrap();
        String::from_utf8(bytes).unwrap()
    });
    (endpoint, handle)
}

#[tokio::test]
async fn sends_explicit_units_and_checks_acknowledgement() {
    let (endpoint, handle) = receiver(200, r#"{"data":{"delogMutationRecord":{"status":true}}}"#);
    let client = Client::new(&endpoint, "test-token").unwrap();
    client
        .record(&Record::new("hello", DelogLevel::Warn))
        .await
        .unwrap();
    let request = handle.join().unwrap();
    assert!(request.contains("Bearer test-token"));
    let body: Value = serde_json::from_str(request.split("\r\n\r\n").nth(1).unwrap()).unwrap();
    assert_eq!(body["variables"]["input"]["unit"], "us");
    assert_eq!(body["variables"]["input"]["level"], 4);
}

#[tokio::test]
async fn surfaces_graphql_and_http_failures() {
    for (status, body) in [
        (401, r#"{"error":"unauthorized"}"#),
        (200, r#"{"data":{"delogMutationRecord":{"status":false}}}"#),
        (200, r#"{"errors":[{"message":"rejected"}]}"#),
    ] {
        let (endpoint, handle) = receiver(status, body);
        let client = Client::new(&endpoint, "test-token").unwrap();
        assert!(
            client
                .record(&Record::new("failure", DelogLevel::Error))
                .await
                .is_err()
        );
        handle.join().unwrap();
    }
}

#[test]
fn validates_endpoint_without_network() {
    assert!(Client::new("file:///tmp/record", "token").is_err());
    assert!(Client::new("https://user:secret@example.com", "token").is_err());
}

#[test]
fn retains_numeric_level_serialization() {
    assert_eq!(serde_json::to_string(&DelogLevel::Error).unwrap(), "5");
    assert_eq!(
        serde_json::from_str::<DelogLevel>("5").unwrap(),
        DelogLevel::Error
    );
    assert!(serde_json::from_str::<DelogLevel>("7").is_err());
}
