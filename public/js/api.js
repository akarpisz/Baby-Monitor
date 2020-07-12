$("button.btn#off").on("click", function(event){
	event.preventDefault();
	let powerState = {
		state: false
		};
	console.log("button pushed");
	
	$.ajax("/api/power",
	{type: "POST",	
	data: powerState
	});
});

$("button#reboot").on("click", function(event){
		event.preventDefault();
		let powerState = {state: "reboot"};
		
		$.ajax("/api/power",
		{type: "POST",
		data: powerState	
		});
});
