import express from "express"
import cors from "cors"
const app= express();

app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}))

app.get('/home',(req,res) => {
  res.status(200).json({
    message : "server is up and running",
    uptime : process.uptime()
  })
})

app.listen(3000,()=>{
  console.log(`app is listening on port 3000`);
})
