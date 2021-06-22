use serde_repr::{ 
    Serialize_repr, 
    Deserialize_repr,
};



pub static DELOG_RECORD: &str = "mutation DelogMutationRecord ($input: DelogInputRecord!) { delogMutationRecord(input: $input) { status }}";


#[derive(Default)]
pub struct DelogData {
    /// Required.
    pub text: &'static str,


    // Configuration optionals.
    // graphql_client: ApolloClient<NormalizedCacheObject>,

    pub endpoint: Option<&'static str>,
    pub token: Option<&'static str>,

    pub project: Option<&'static str>,
    pub space: Option<&'static str>,

    pub format: Option<&'static str>,


    // Logging optionals.
    
    /// Log level:
    ///
    /// + FATAL: 6
    /// + ERROR: 5
    /// + WARN: 4
    /// + INFO: 3
    /// + DEBUG: 2
    /// + TRACE: 1
    pub level: Option<DelogLevel>,

    // /**
    // * To be used if the `delog` is meant to be fired only in 'TESTING' `mode` (`context.mode`),
    // * and the `mode` is set dinamically/from outside the enclosing function.
    // */
    // tester: bool,

    // /**
    // * Name of the method from where the log originates.
    // */
    pub method: Option<&'static str>,

    // error: Error,

    // /**
    // * Arbitrary data: a simple string, stringified JSON or deon.
    // */
    pub extradata: Option<&'static str>,

    // context: DelogContext,
}


pub enum DelogCall {
    Str(&'static str),
    Data(DelogData),
}


#[derive(Serialize_repr, Deserialize_repr, PartialEq, Debug)]
#[repr(i8)]
pub enum DelogLevel {
    Trace = 1,
    Debug = 2,
    Info = 3,
    Warn = 4,
    Error = 5,
    Fatal = 6,
}
