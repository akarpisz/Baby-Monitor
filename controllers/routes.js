const express = require("express");
const exec = require("child_process").exec;
const router = express.Router();

router.get("/", function(req,res) {
	res.send("./public/index.html");	
	});

router.post("/api/power", function(req,res){
console.log(req.body);
let state = req.body.state;
if (state === "false"){
	exec("sudo shutdown now", function(err, stout, sterr) {
		if(err) {
		console.log(err);	
		} else if(stout){
		console.log(stout);
		} else if(sterr){
		console.log(sterr);
		}
		})
} else if (state==="reboot"){
	
	exec("sudo reboot now", function(err, stout, sterr) {
		if(err) {
		console.log(err);	
		} else if(stout){
		console.log(stout);
		} else if(sterr){
		console.log(sterr);
		}
		});
} else {
console.log("i dont know");	
}
});


module.exports = router;
