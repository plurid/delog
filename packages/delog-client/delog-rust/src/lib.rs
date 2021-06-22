use serde_repr::{ 
    Serialize_repr, 
    Deserialize_repr,
};



static DELOG_RECORD: &str = "mutation DelogMutationRecord ($input: DelogInputRecord!) { delogMutationRecord(input: $input) { status }}";


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
    
    /// Log level:
    ///
    /// + FATAL: 6
    /// + ERROR: 5
    /// + WARN: 4
    /// + INFO: 3
    /// + DEBUG: 2
    /// + TRACE: 1
    level: Option<DelogLevel>,

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


async fn delog_call (
    text: String,
    level: DelogLevel,
    endpoint: String,
    token: String,
    project: String,
    space: String,
    format: String,
    method: String,
    extradata: String,
) -> Result<(), reqwest::Error> {
    use serde_json::json;
    use std::time::{SystemTime, UNIX_EPOCH};
    
    // println!(
    //     "\ntext: {}\nlevel: {:?}\nendpoint: {}\ntoken: {}\nproject: {}\nspace: {}\nformat {}\nmethod: {}\nextradata {}\n", 
    //     text, 
    //     level,
    //     endpoint,
    //     token,
    //     project,
    //     space,
    //     format,
    //     method,
    //     extradata,
    // );

    let time = SystemTime::now().duration_since(UNIX_EPOCH).unwrap().as_secs();
    // println!("{:?}\n", time);

    let data = json!({
        "query": DELOG_RECORD,
        "variables": {
            "input": {
                "text": text,
                "time": time,
                "level": level,

                "project": project,
                "space": space,

                "format": format,

                "method": method,
                "error": "",
                "extradata": extradata
            }
        }
    });
    // println!("{:?}\n", data);
    let body = serde_json::to_string(&data).unwrap_or("".to_string());
    // println!("{:?}\n", body);

    if body.is_empty() {
        // return error
        return Ok(());
    }
 
    let _response = reqwest::Client::new()
        .post(endpoint)
        .header("Content-Type", "application/json")
        .header("Authorization", format!("Bearer {}", token))
        .body(body)
        .send()
        .await?;
    // println!("{:?}", _response);

    Ok(())
}


pub async fn delog(
    data: DelogCall,
) -> Result<(), reqwest::Error> {
    use std::env;
    use DelogCall::*;

    // let level = env::var("DELOG_DEFAULT_LEVEL").unwrap_or("3".to_string()).parse().unwrap_or(DelogLevel::Info);
    let level = DelogLevel::Info;

    let endpoint: String = env::var("DELOG_ENDPOINT").unwrap_or("".to_string());
    let token: String = env::var("DELOG_TOKEN").unwrap_or("".to_string());

    let project: String = env::var("DELOG_PROJECT").unwrap_or("".to_string());
    let space: String = env::var("DELOG_SPACE").unwrap_or("".to_string());
    let format: String = env::var("DELOG_FORMAT").unwrap_or("".to_string());
  
    let method: String = env::var("DELOG_METHOD").unwrap_or("".to_string());
    let extradata: String = env::var("DELOG_EXTRADATA").unwrap_or("".to_string());

    match data {
        Str(data) => {
            delog_call(
                String::from(data),
                level,
                endpoint,
                token,
                project,
                space,
                format,
                method,
                extradata,
            ).await?;
        }
        Data(data) => {
            let data_level: DelogLevel = data.level.unwrap_or(level);

            let data_endpoint = String::from(data.endpoint.unwrap_or(&endpoint));
            let data_token = String::from(data.token.unwrap_or(&token));

            let data_project = String::from(data.project.unwrap_or(&project));
            let data_space = String::from(data.space.unwrap_or(&space));
            let data_format = String::from(data.format.unwrap_or(&format));
          
            let data_method = String::from(data.method.unwrap_or(&method));
            let data_extradata = String::from(data.extradata.unwrap_or(&extradata));

            delog_call(
                String::from(data.text),
                data_level,
                data_endpoint,
                data_token,
                data_project,
                data_space,
                data_format,
                data_method,
                data_extradata,
            ).await?;
        }
    }

    Ok(())
}



#[cfg(test)]
mod tests {
    use super::delog;
    use super::DelogCall;
    use super::DelogData;
    use super::DelogLevel;

    // #[tokio::test]
    // async fn it_works_string() {
    //     let _sent = delog(DelogCall::Str("it works with string")).await;
    //     // assert_eq!(sent, true);
    // }

    // #[tokio::test]
    // async fn it_works_data() {
    //     let delog_data = DelogData {
    //         text: "it works with data",
    //         ..Default::default()
    //     };
    //     let _sent = delog(DelogCall::Data(delog_data)).await;
    //     // assert_eq!(sent, true);
    // }

    #[tokio::test]
    async fn it_works_with_test_token() {
        let delog_data = DelogData {
            text: "it works with test token",
            level: Some(DelogLevel::Trace),
            endpoint: Some("http://localhost:56365/delog"),
            token: Some("__TEST_MODE__"),
            ..Default::default()
        };
        let _sent = delog(DelogCall::Data(delog_data)).await;
        // assert_eq!(sent, true);
    }
}
