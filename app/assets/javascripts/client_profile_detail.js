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

var newAppointment = function(appointment_id) {
	
};

var changeAppointment = function(appointment_id) {
	
};

var deleteAppointment = function(appointment_id) {
	
	$.ajax({
		type: 'GET',
		url: '/client_delete_appointment_ajax',
		dataType: "json",
		data: {
			'appointment_id': appointment_id
		},
		success: function(data) {
			if (data.status == "success") {
				$("#appointment_" + appointment_id).animate( {backgroundColor:'yellow'}, 1000).fadeOut(1000,function() {
					$("#appointment_" + appointment_id).remove();
				});
				alertMessage("client_edit_alert", "Appointment successfully removed.", "success", false);
			}
			else if (data.status == "fail") {
				alertMessage("client_edit_alert", "Fail delete appointment, please try again.", "danger", false);
			}
			else if (data.status == "not_found") {
				alertMessage("client_edit_alert", "Appointment not found.", "warning", false);
			}
			else if (data.status == "not_allowed") {
				alertMessage("client_edit_alert", "You have no permission to delete this appointment.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("client_edit_alert", "Error, please contact us.", "danger", false);
		}
	});
};