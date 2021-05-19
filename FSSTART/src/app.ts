import express from "express";
import dotenv from "dotenv";
import path from "path"
dotenv.config()
const app = express()

import friendRoutes from "./routes/FriendRoutes";

const debug = require("debug")("app")

import { Request, Response } from "express";

import logger, { stream } from "./middleware/logger";
const morganFormat = process.env.NODE_ENV == "production" ? "combined" : "dev"
app.use(require("morgan")(morganFormat, { stream }));

app.set("logger", logger) //This line sets the logger with a global key on the application object
//You can now use it from all your middlewares like this req.app.get("logger").log("info","Message")
//Level can be one of the following: error, warn, info, http, verbose, debug, silly
//Level = "error" will go to the error file in production
logger.log("info", "Server started"); //Example of how to use the logger
logger.log("error", "Ups");

/* 
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server started, listening on PORT: ${PORT}`))
 */

console.log(process.env.DEBUG)

app.use((req, res, next) => {
  debug(new Date().toLocaleDateString(), req.method, req.originalUrl, req.ip)
  next()
})

app.use(express.static(path.join(process.cwd(), "public"))) //betyder, at alt hvad der liggger i public mappe kan tilgås udefra.Hvis den udkommenteres, 
// kan vi ikke længere se indholdet i browseren

/* app.get("/demo", (req, res) => {
  let a = 123;
  debug(a)
  res.send("Server is up");
}) */


//Viser meget om middleware:
app.use((req, res, next) => {
    //debug(new Date().toLocaleDateString(), req.method, req.originalUrl, req.ip)
    if (req.originalUrl.startsWith("/api")) {
      res.status(404).json({ errorcode: 404, msg: "not found" })
    } else {
    next()
}
})

app.use("/api/friends", friendRoutes) 
//betyder, at alt, hvad der ligger i friendroutes vil starte med at kigge på api/frineds

//404 handlers for api requests
app.use("/api", (req: any, res:any, next) =>{
  res.status(404).json({ errorCode: 404, msg: "not found" })
})

app.use((err:any, req:Request, res:Response, next:Function) => {
  
})


import authMiddleware from "./middleware/basic-auth"
import { ApiError } from "./errors/apiError";
app.use("/demo", authMiddleware)

app.get("/demo", (req, res) =>{
  res.send("Server is up")
})
app.get("/me", (req:any, res) => {
  const user = req.credentials;
  console.log(user);
})



app.use((err: any, req: Request, res: Response, next: Function) => {
  if(err instanceof (ApiError)){
    const e:ApiError = err;
    res.status(e.errorCode).json({ errorCode: 404, msg: "not found" })

  } else {
    next(err)
  }
})



export default app;

