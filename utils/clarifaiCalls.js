const returnClarifaiRequestOptions = (imageURL) => {
  const PAT = process.env.PAT;
  const USER_ID = process.env.USER_ID;
  const APP_ID = process.env.APP_ID;
  const MODEL_ID = 'face-detection';
  // const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';    
  const IMAGE_URL = imageURL;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  return requestOptions
};

module.exports = {
    returnClarifaiRequestOptions
};