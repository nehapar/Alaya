var reschedule = function(appointment_id) {
	var content = "";
	
	content = content + "<div class=\"row\">";
	content = content + "    <div class=\"col-md-10 col-md-offset-1\">";
	content = content + "        <p class=\"lead\">Would you like to...</p>";
	content = content + "    </div>";
	content = content + "</div>";
	content = content + "<div class=\"row\">";
	content = content + "    <div class=\"col-md-10 col-md-offset-1\">";
	content = content + "        <a href=\"#\" class=\"btn btn-primary\">... modify this schedule?</a>";
	content = content + "        <a href=\"#\" class=\"btn btn-success pull-right\">... create a new one?</a>";
	content = content + "    </div>";
	content = content + "</div>";
	
	$("#reschedules_title").html("Rescheduling appointment");
	$("#reschedulse_modal_content").html(content);
	$('#reschedules_modal').modal('show');
};
