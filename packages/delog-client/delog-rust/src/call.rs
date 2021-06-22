use super::data::{
    DelogLevel,
    DELOG_RECORD,
};



pub async fn delog_call (
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
