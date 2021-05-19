import app from "../app"
const debug = require("debug")("www");

import { DbConnector } from "../config/dbConnector";

const PORT = process.env.PORT || 3333;

(async function connectToDb() {
    const connection = await DbConnector.connect();
    const db = connection.db(process.env.DB_NAME)
    app.set("db", db) //gør db tilgængelig for resten af app'en
    app.set("db-type", "REAL") // så relevente steder kan logge den brugte db
    app.listen(PORT, () => debug(`Server started, listening on PORT: ${PORT}`))
})()


//console.log(process.env.DEBUG)
//app.listen(PORT, () => debug(`Server started, listening on PORT: ${PORT}`))
