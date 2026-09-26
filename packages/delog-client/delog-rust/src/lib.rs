//! Typed client for Delog. A successful call means the server accepted the record.

use serde::{Deserialize, Serialize};
use serde_json::{Value, json};
use std::fmt;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

pub const DELOG_RECORD: &str = "mutation DelogMutationRecord($input: DelogInputRecord!) { delogMutationRecord(input: $input) { status error { code message } } }";

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
#[serde(try_from = "u8", into = "u8")]
#[repr(u8)]
pub enum DelogLevel {
    Trace = 1,
    Debug = 2,
    #[default]
    Info = 3,
    Warn = 4,
    Error = 5,
    Fatal = 6,
}

impl From<DelogLevel> for u8 {
    fn from(level: DelogLevel) -> Self {
        level as u8
    }
}

impl TryFrom<u8> for DelogLevel {
    type Error = &'static str;

    fn try_from(value: u8) -> Result<Self, &'static str> {
        match value {
            1 => Ok(Self::Trace),
            2 => Ok(Self::Debug),
            3 => Ok(Self::Info),
            4 => Ok(Self::Warn),
            5 => Ok(Self::Error),
            6 => Ok(Self::Fatal),
            _ => Err("Level must be between 1 and 6."),
        }
    }
}

#[derive(Debug)]
pub enum DelogError {
    Configuration(String),
    Transport(reqwest::Error),
    Rejected(String),
    InvalidResponse(serde_json::Error),
}

impl fmt::Display for DelogError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Configuration(message) | Self::Rejected(message) => formatter.write_str(message),
            Self::Transport(error) => write!(formatter, "Delog transport failed: {error}"),
            Self::InvalidResponse(error) => write!(formatter, "Invalid Delog response: {error}"),
        }
    }
}

impl std::error::Error for DelogError {}

impl From<reqwest::Error> for DelogError {
    fn from(error: reqwest::Error) -> Self {
        Self::Transport(error)
    }
}

#[derive(Debug, Clone, Serialize)]
pub struct Record {
    pub text: String,
    pub time: u64,
    pub unit: String,
    pub level: u8,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub project: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub space: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub format: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub method: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extradata: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub context: Option<Value>,
}

impl Record {
    pub fn new(text: impl Into<String>, level: DelogLevel) -> Self {
        let time = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_micros() as u64;
        Self {
            text: text.into(),
            time,
            unit: "us".into(),
            level: level as u8,
            project: None,
            space: None,
            format: None,
            method: None,
            error: None,
            extradata: None,
            context: None,
        }
    }
}

#[derive(Debug, Clone)]
pub struct Client {
    http: reqwest::Client,
    endpoint: reqwest::Url,
    token: String,
}

#[derive(Deserialize)]
struct GraphqlEnvelope {
    data: Option<GraphqlData>,
    errors: Option<Vec<GraphqlError>>,
}

#[derive(Deserialize)]
struct GraphqlData {
    #[serde(rename = "delogMutationRecord")]
    record: Option<RecordResponse>,
}

#[derive(Deserialize)]
struct RecordResponse {
    status: bool,
    error: Option<GraphqlError>,
}

#[derive(Deserialize)]
struct GraphqlError {
    message: String,
}

impl Client {
    pub fn new(endpoint: &str, token: impl Into<String>) -> Result<Self, DelogError> {
        let endpoint = reqwest::Url::parse(endpoint)
            .map_err(|_| DelogError::Configuration("Endpoint must be an HTTP(S) URL.".into()))?;
        if !matches!(endpoint.scheme(), "http" | "https")
            || !endpoint.username().is_empty()
            || endpoint.password().is_some()
        {
            return Err(DelogError::Configuration(
                "Endpoint must use HTTP(S) without URL credentials.".into(),
            ));
        }
        let http = reqwest::Client::builder()
            .timeout(Duration::from_secs(10))
            .redirect(reqwest::redirect::Policy::none())
            .build()?;
        Ok(Self {
            http,
            endpoint,
            token: token.into(),
        })
    }

    pub async fn record(&self, record: &Record) -> Result<(), DelogError> {
        if !(1..=6).contains(&record.level) || !matches!(record.unit.as_str(), "s" | "ms" | "us") {
            return Err(DelogError::Configuration(
                "Invalid record level or time unit.".into(),
            ));
        }
        let mut response = self
            .http
            .post(self.endpoint.clone())
            .bearer_auth(&self.token)
            .json(&json!({ "query": DELOG_RECORD, "variables": { "input": record } }))
            .send()
            .await?
            .error_for_status()?;
        if !response.status().is_success() {
            return Err(DelogError::Rejected(format!(
                "Delog returned HTTP {}.",
                response.status()
            )));
        }
        let mut body = Vec::new();
        while let Some(chunk) = response.chunk().await? {
            if body.len() + chunk.len() > 1_048_576 {
                return Err(DelogError::Rejected("Response exceeds 1 MiB.".into()));
            }
            body.extend_from_slice(&chunk);
        }
        let result: GraphqlEnvelope =
            serde_json::from_slice(&body).map_err(DelogError::InvalidResponse)?;
        if let Some(errors) = result.errors {
            if let Some(error) = errors.into_iter().next() {
                return Err(DelogError::Rejected(error.message));
            }
        }
        match result.data.and_then(|data| data.record) {
            Some(response) if response.status => Ok(()),
            Some(response) => Err(DelogError::Rejected(
                response
                    .error
                    .map(|error| error.message)
                    .unwrap_or_else(|| "Server rejected the record.".into()),
            )),
            None => Err(DelogError::Rejected(
                "Missing record acknowledgement.".into(),
            )),
        }
    }
}

/// The original borrowed configuration now accepts non-static strings too.
#[derive(Default)]
pub struct DelogData<'a> {
    pub text: &'a str,
    pub endpoint: Option<&'a str>,
    pub token: Option<&'a str>,
    pub project: Option<&'a str>,
    pub space: Option<&'a str>,
    pub format: Option<&'a str>,
    pub level: Option<DelogLevel>,
    pub method: Option<&'a str>,
    pub extradata: Option<&'a str>,
}

pub enum DelogCall<'a> {
    Str(&'a str),
    Data(DelogData<'a>),
}

pub async fn delog(data: DelogCall<'_>) -> Result<(), DelogError> {
    let data = match data {
        DelogCall::Str(text) => DelogData {
            text,
            ..Default::default()
        },
        DelogCall::Data(data) => data,
    };
    let environment = |name: &str| std::env::var(name).unwrap_or_default();
    let endpoint = data
        .endpoint
        .map(str::to_owned)
        .unwrap_or_else(|| environment("DELOG_ENDPOINT"));
    let token = data
        .token
        .map(str::to_owned)
        .unwrap_or_else(|| environment("DELOG_TOKEN"));
    let mut record = Record::new(data.text, data.level.unwrap_or_default());
    record.project = Some(
        data.project
            .map(str::to_owned)
            .unwrap_or_else(|| environment("DELOG_PROJECT")),
    );
    record.space = Some(
        data.space
            .map(str::to_owned)
            .unwrap_or_else(|| environment("DELOG_SPACE")),
    );
    record.format = Some(
        data.format
            .map(str::to_owned)
            .unwrap_or_else(|| environment("DELOG_FORMAT")),
    );
    record.method = data.method.map(str::to_owned);
    record.extradata = data.extradata.map(str::to_owned);
    Client::new(&endpoint, token)?.record(&record).await
}

#[cfg(test)]
mod tests;
