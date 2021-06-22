#[derive(Default)]
pub struct DelogData {
    /// Required.
    text: &'static str,


    // Configuration optionals.
    // graphql_client: ApolloClient<NormalizedCacheObject>,

    endpoint: Option<&'static str>,
    token: Option<&'static str>,

    project: Option<&'static str>,
    space: Option<&'static str>,

    format: Option<&'static str>,


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
    // level: i8,

    // /**
    // * To be used if the `delog` is meant to be fired only in 'TESTING' `mode` (`context.mode`),
    // * and the `mode` is set dinamically/from outside the enclosing function.
    // */
    // tester: bool,

    // /**
    // * Name of the method from where the log originates.
    // */
    method: Option<&'static str>,

    // error: Error,

    // /**
    // * Arbitrary data: a simple string, stringified JSON or deon.
    // */
    extradata: Option<&'static str>,

    // context: DelogContext,
}


pub enum DelogCall {
    Str(&'static str),
    Data(DelogData),
}


async fn delog_call (
    text: String,
    endpoint: String,
    token: String,
    project: String,
    space: String,
    format: String,
    method: String,
    extradata: String,
) -> Result<(), reqwest::Error> {
    println!(
        "{} {} {} {} {} {} {} {}", 
        text, 
        endpoint,
        token,
        project,
        space,
        format,
        method,
        extradata,
    );

    let p = "";

    let _response = reqwest::Client::new()
        .post(endpoint)
        .form(&p)
        .send()
        .await?;

    Ok(())
}


pub async fn delog(
    data: DelogCall,
) -> Result<(), reqwest::Error> {
    use std::env;
    use DelogCall::*;

    let endpoint: String = env::var("DELOG_ENDPOINT").unwrap_or("".to_string());
    let token: String = env::var("DELOG_TOKEN").unwrap_or("".to_string());

    let project: String = env::var("DELOG_PROJECT").unwrap_or("".to_string());
    let space: String = env::var("DELOG_SPACE").unwrap_or("".to_string());
    let format: String = env::var("DELOG_FORMAT").unwrap_or("".to_string());
  
    let method: String = env::var("DELOG_METHOD").unwrap_or("".to_string());
    let extradata: String = env::var("DELOG_EXTRADATA").unwrap_or("".to_string());

    match data {
        Str(data) => {
            let call = delog_call(
                String::from(data),
                endpoint,
                token,
                project,
                space,
                format,
                method,
                extradata,
            ).await;

            match call {
                Ok(_) => (),
                Err(_) => (),
            }
        }
        Data(data) => {
            let data_endpoint = String::from(data.endpoint.unwrap_or(&endpoint));
            let data_token = String::from(data.token.unwrap_or(&token));

            let data_project = String::from(data.project.unwrap_or(&project));
            let data_space = String::from(data.space.unwrap_or(&space));
            let data_format = String::from(data.format.unwrap_or(&format));
          
            let data_method = String::from(data.method.unwrap_or(&method));
            let data_extradata = String::from(data.extradata.unwrap_or(&extradata));

            let call = delog_call(
                String::from(data.text),
                data_endpoint,
                data_token,
                data_project,
                data_space,
                data_format,
                data_method,
                data_extradata,
            ).await;

            match call {
                Ok(_) => (),
                Err(_) => (),
            }
        }
    }

    Ok(())
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
            ..Default::default()
        };
        let sent = delog(DelogCall::Data(delog_data));
        assert_eq!(sent, true);
    }
}
