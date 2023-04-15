import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from 'openai';
import fs from 'fs'
import multer from 'multer'
// import fileUpload from 'express-fileupload'
// import routes from './routes/index.route'
// import './config/database'



dotenv.config();

const app = express();
app.use(cors());
// const router = express.Router()
const port = process.env.PORT || 3001;


app.use(express.json({ limit: "50mb" }));

// app.use(express.urlencoded({limit: '50mb', extended: true}))
// app.use(fileUpload({
//   limits: { fileSize: 50000000 }
// }))
// app.use('/', routes)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '')
  },
  filename: (req, file, cb) => {
    console.log('file', file)
    cb(null, Date.now() + "-" + file.originalname)
  }
})
const upload = multer({ storage: storage }).single('file')

app.post("/images", async (req, res) => {
  const { message } = req.body
  try {
    const response = await openai.createImage({
      prompt: message,
      n: 4,
      size: "1024x1024",
    });
    console.log(response);
    res.send(response.data.data);
  } catch (error) {
    console.error(error);
  }
});

app.post("/upload", (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
    } else if (err) {
      return res.status(500).json(err)
    }
    console.log(req.file)
  })  
});

app.listen(port, () => {
  const date = new Date();
  console.log(`${date} - Server is running on port: ${port}`);
});
