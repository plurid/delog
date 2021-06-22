mod call;
mod data;

use data::{
    DelogCall,
    DelogLevel,
};



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
            call::delog_call(
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

            call::delog_call(
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
    use super::{
        delog,
        DelogCall,
        DelogLevel,
        data,
    };
    use data::{
        DelogData,
    };

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
