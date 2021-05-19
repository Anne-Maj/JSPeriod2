import app from "../app"
const debug = require("debug")("www")

debug.enabled = true;

const PORT = process.env.PORT || 3333;

//app.listen(PORT, () => console.log(`Server started, listening on PORT: ${PORT}`))

app.listen(PORT, () => debug(`Server started, listening on PORT: ${PORT}`))