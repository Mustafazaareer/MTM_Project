import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv'
import { DynamoDB } from "@aws-sdk/client-dynamodb";

dotenv.config()

import { config } from 'aws-sdk';
 

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
console.log(region);
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY
const { RekognitionClient, DetectLabelsCommand } = require("@aws-sdk/client-rekognition");


const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

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
      
      async function detectObjectsAndLog(imageFilePath: string) {
        const imageBuffer = fs.readFileSync(imageFilePath);
      
        const params = {
          Image: {
            Bytes: imageBuffer,
          },
        };
      
        try {
          const command = new DetectLabelsCommand(params);
          const response = await rekognitionClient.send(command);
          const result = JSON.stringify(response.Labels, null, 2)
          console.log(`Detected objects:${result}`);
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


