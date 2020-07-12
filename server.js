const express = require("express");
const app = express();
const PORT =  process.env.PORT || 5000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));


const routes = require("./controllers/routes.js");

app.use(routes);

app.listen(PORT, function(){
	console.log(`listening on port ${PORT}`);
});
