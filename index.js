import express from 'express'
import * as dotenv from 'dotenv';
import cors from 'cors'
// import fileUpload from 'express-fileupload'
// import routes from './routes/index.route'
// import './config/database'

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

dotenv.config();

const app = express()
app.use(cors())
// const router = express.Router()
const port = process.env.PORT || 3001

app.use(express.json({limit: '50mb'}));

// app.use(express.urlencoded({limit: '50mb', extended: true}))
// app.use(fileUpload({
//   limits: { fileSize: 50000000 }
// }))
// app.use('/', routes)

app.post('/images', async (req, res) => {
  try {
    const response = await openai.createImage({
      prompt: "A cute baby sea otter",
      n: 2,
      size: "1024x1024",
    });
    console.log(response)
    res.send(response.data.data)
  } catch (error) {
    console.error(error)
  }
})

app.listen(port, () => {
  const date = new Date()
  console.log(`${date} - Server is running on port: ${port}`)
})