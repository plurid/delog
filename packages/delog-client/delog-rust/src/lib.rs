pub struct DelogData {
    // Required.
    text: &'static str,


    // Configuration optionals.
    // graphql_client?: ApolloClient<NormalizedCacheObject>,

    // endpoint?: &'static str,
    // token?: &'static str,

    // project?: &'static str,
    // space?: &'static str,

    // format?: &'static str,


    // Logging optionals.
    // /**
    // * Log level:
    // *
    // * + NONE: 7;
    // * + FATAL: 6;
    // * + ERROR: 5;
    // * + WARN: 4;
    // * + INFO: 3;
    // * + DEBUG: 2;
    // * + TRACE: 1;
    // * + ALL: 0.
    // */
    // level?: number;

    // /**
    // * To be used if the `delog` is meant to be fired only in 'TESTING' `mode` (`context.mode`),
    // * and the `mode` is set dinamically/from outside the enclosing function.
    // */
    // tester?: boolean;

    // /**
    // * Name of the method from where the log originates.
    // */
    // method?: &'static str,

    // error?: Error;

    // /**
    // * Arbitrary data: a simple string, stringified JSON or deon.
    // */
    // extradata?: &'static str,

    // context?: DelogContext;
}


pub enum DelogCall {
    Str(&'static str),
    Data(DelogData),
}


fn delog_call (
    text: &'static str,
) {
    println!("{}", text);
}


pub fn delog(
    data: DelogCall,
) -> bool {
    use DelogCall::*;

    match data {
        Str(data) => {
            delog_call(
                data,
            );
        }
        Data(data) => {
            delog_call(
                data.text,
            );
        }
    }

    true
}



#[cfg(test)]
mod tests {
    use super::delog;
    use super::DelogCall;
    use super::DelogData;

    #[test]
    fn it_works_string() {
        let sent = delog(DelogCall::Str("it works with string"));
        assert_eq!(sent, true);
    }

    #[test]
    fn it_works_data() {
        let delog_data = DelogData {
            text: "it works with data",
        };
        let sent = delog(DelogCall::Data(delog_data));
        assert_eq!(sent, true);
    }
}
