"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config({ path: "".concat(__dirname, "/.env") });
var bucketName = process.env.AWS_BUCKET_NAME;
var region = process.env.AWS_BUCKET_REGION;
console.log(region);
var accessKeyId = process.env.AWS_ACCESS_KEY;
var secretAccessKey = process.env.AWS_SECRET_KEY;
var _a = require("@aws-sdk/client-rekognition"), RekognitionClient = _a.RekognitionClient, DetectLabelsCommand = _a.DetectLabelsCommand;
// const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
// const fs = require("fs");
// const rekognitionClient = new RekognitionClient({
//   region: region, // Replace with your AWS region
//   credentials: {
//     accessKeyId: accessKeyId,
//     secretAccessKey: secretAccessKey,
//   },
// });
// async function detectObjectsAndLog(imageFilePath: string) {
//   const imageBuffer = fs.readFileSync(imageFilePath);
//   const params = {
//     Image: {
//       Bytes: imageBuffer,
//     },
//   };
//   try {
//     const command = new DetectLabelsCommand(params);
//     const response = await rekognitionClient.send(command);
//     console.log('Detected objects:', JSON.stringify(response.Labels, null, 2));
//   } catch (err) {
//     console.error('Error detecting objects:', err);
//   }
// }
// // Usage
// const imageFilePath = __dirname+'/mmm.jpg'; // Replace with the actual image file path
// detectObjectsAndLog(imageFilePath);
//import required packages
var AWS = require('aws-sdk');
//AWS access details
AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: region
});
//input parameters
var params = {
    Image: {
        S3Object: {
            Bucket: bucketName,
            Name: "untitled-1.jpg"
        }
    }
};
//Call AWS Rekognition Class
var rekognition = new AWS.Rekognition();
var detectedTXT;
//Detect text
rekognition.detectText(params, function (err, data) {
    if (err)
        console.log(err, err.stack); // an error occurred
    else
        console.log(data); // successful response
    //console.log(data.TextDetections);
    for (var i = 0; i < data.TextDetections.length; i++) {
        //console.log(data.TextDetections[i].Type)
        if (data.TextDetections[i].Type === 'LINE') {
            detectedTXT = data.TextDetections[i].DetectedText;
        }
    }
    console.log(detectedTXT);
});
// end code
