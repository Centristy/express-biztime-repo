/** BizTime express application. */

const express = require("express");
const app = express();
const ExpressError = require("./expressError")



// Parse requests bodies for JSON

app.use(express.json());



const cRoutes = require("./routes/companies"); // cRoutes: company route
app.use("/companies", cRoutes);

const iRoutes = require("./routes/invoices"); // iRoutes: invoice route
app.use("/invoices", iRoutes);


app.listen(3000, function () {
  console.log("Listening on 3000");
});


module.exports = app;
