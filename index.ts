import express from 'express';

const PORT =5050;

const app =express();

app.use(express.json());
app.get('/',(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    res.send("app running")
})

app.listen(PORT,()=>{
    console.log(`app running at port: ${PORT}`)
})

export default app;