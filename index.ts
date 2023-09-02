import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv'
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
const { fromIni } = require('@aws-sdk/credential-provider-ini');
dotenv.config()

import AWS, { config } from 'aws-sdk';
 

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
console.log(region);
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");

const rekognition = new AWS.Rekognition();


const PORT =5050;

const app =express();

app.use(express.json());


import fs from 'fs';
// const unlinkFile = util.promisify(fs.unlink)

const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require('./s3')

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'uploads/');
    },
    filename: (req, file, callback) => {
      callback(null, Date.now() + '-' + file.originalname)
    }
  });
  


// app.get('/images/:key', (req, res) => {
//   console.log(req.params)
//   const key = req.params.key
//   const readStream = getFileStream(key)

//   readStream.pipe(res)
// })

// app.post('/images', upload.single('image'), async (req:express.Request, res:express.Response) => {
//   const file = req.file
//   console.log(file)


//   const result = await uploadFile(file)
// //   await unlinkFile(file.path)
//   console.log(result)
//   const description = req.body.description
//   res.send({imagePath: `/images/${result.Key}`})
// })

app.get('/',(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    res.send("app running")
})



app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      res.status(500).send("Failed Upload File!");
      return;
    }
    const fileURL = req.file.destination + req.file.filename;




    const rekognitionClient = new RekognitionClient({
        region: region, // Replace with your AWS region
        credentials: {
          accessKeyId: accessKeyId,
          secretAccessKey: secretAccessKey,
        },
      });


      const s3Client = new AWS.S3({
        region: region, 
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey, // Replace with your AWS CLI profile name or provide accessKeyId and secretAccessKey directly
      });
      
      async function uploadImageToS3(imageFilePath:any, bucketName:any, objectKey:any) {
        const imageBuffer = fs.readFileSync(imageFilePath);
      
        
        const params = {
          Bucket: bucketName,
          Key: objectKey,
          Body: imageBuffer,
        };
      
        try {
          const command = new PutObjectCommand(params);
          const response = await s3Client.putObject(command);
          console.log('Image uploaded successfully:', response);
        } catch (err) {
          console.error('Error uploading image to S3:', err);
        }
      }
      
      // Usage
      const imageFilePath = fileURL; // Replace with the actual image file path
      const bucketNa = bucketName; // Replace with your S3 bucket name
      const objectKey = req.file?.filename; // Replace with the desired object key
      
      uploadImageToS3(imageFilePath, bucketNa, objectKey);
      
      
      async function detectObjectsAndLog(imageFilePath: string) {
        const imageBuffer = fs.readFileSync(imageFilePath);
      
        const params = {
          Image: {
            S3Object: {
                Bucket: bucketName, 
                Name: "mmm.jpg"
               }          
            },
        };
      
        try {
          const command = new DetectLabelsCommand(params);
          const response = await rekognitionClient.send(command);

          const result = JSON.stringify(response.Labels, null, 2)
          console.log(`Detected objects:${result}`);

          let detectedTXT:string;

          rekognition.detectText(params, function(err:any, data:any) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
        
            //console.log(data.TextDetections);
        
        
            for(var i = 0; i < data.TextDetections.length;i++){
        
              //console.log(data.TextDetections[i].Type)
        
              if(data.TextDetections[i].Type === 'LINE')
              {
                detectedTXT = data.TextDetections[i].DetectedText;
              }
            }
        
            console.log(detectedTXT);
        
          });
        } catch (err) {
          console.error('Error detecting objects:', err);
        }
      }

    detectObjectsAndLog(fileURL);

    res.send({
      message: 'File Uploaded Successfully!',
      file: fileURL
    });
  });
  
  app.get('/file', (req, res) => {
    const fileName = req.query.name?.toString() || '';
    try {
      const data = fs.readFileSync('uploads/' + fileName, 'utf-8');
      const JSONData = JSON.parse(data) as any[];
      console.log("-----------------------");
      console.log(JSONData[0].author);
      console.log("-----------------------");
      res.send(JSONData);
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong");
    }
  });
  
  // catch 404 and forward to error handler
  
  // error handler
  app.use((err: any, req: any, res: any, next: any) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  
  

app.listen(PORT,()=>{
    console.log(`app running at port: ${PORT}`)
})

export default app;







// Usage


