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

/* ------------------------------------------------------------------- */

var enableEditClient = function() {
	if ($("#client_address").prop("disabled")) {
		//$("#client_first_name").prop("disabled", false);
		//$("#client_last_name").prop("disabled", false);
		$("#client_address").prop("disabled", false);
		$("#client_phone").prop("disabled", false);
		$("#client_weeks_pregnant").prop("disabled", false);
		
		$("#edit_client_button").html("<i class=\"fa fa-toggle-on\"></i> Cancel");
		$("#save_client_button").show();
	}
	else {
		resetClientInfo();
		//$("#client_first_name").prop("disabled", true);
		//$("#client_last_name").prop("disabled", true);
		
		$("#client_address").prop("disabled", true);
		$("#client_phone").prop("disabled", true);
		$("#client_weeks_pregnant").prop("disabled", true);
		
		$("#edit_client_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Info");
		$("#save_client_button").hide();
	}
};

var saveEditClient = function() {
	if (!$("#client_address").prop("disabled") && validateClientUpdateInfoShort()) {
		$.ajax({
			type: 'GET',
			url: '/update_client_information',
			dataType: "json",
			data: {
				'client_id': $("#client_id").val(),
				//'client[first_name]': $("#client_first_name").val(),
				//'client[last_name]': $("#client_last_name").val(),
				'client[address]': $("#client_address").val(),
				'client[phone]': $("#client_phone").val(),
				'client[weeks_pregnant]': $("#client_weeks_pregnant").val()
			},
			success: function(data) {
				if (data.status == "success") {
					enableEditClient();
				}
				else if (data.status == "fail") {
					alertMessage("client_edit_alert", "Please, try again.", "warning", false);
				}
			},
			error: function(data) {
				console.log("error");
				console.log(data);
				alertMessage("client_edit_alert", "Error, please contact us.", "danger", false);
			}
		});
	}
};

var resetClientInfo = function() {
	if (!$("#client_address").prop("disabled")) {
		$.ajax({
		type: 'GET',
		url: '/client_simple_info',
		dataType: "json",
		data: {
			'client_id': $("#client_id").val()
		},
		success: function(data) {
			if (data.status == "success") {
				//$("#client_first_name").val(data.client.first_name);
				//$("#client_last_name").val(data.client.last_name);
				
				$("#client_address").val(data.client.address);
				$("#client_phone").val(data.client.phone);
				$("#client_weeks_pregnant").val(data.client.weeks_pregnant);
				
				//$("#client_first_name").prop("disabled", true);
				//$("#client_last_name").prop("disabled", true);
				$("#client_address").prop("disabled", true);
				$("#client_phone").prop("disabled", true);
				$("#client_weeks_pregnant").prop("disabled", true);
				
				$("#edit_client_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Info");
				$("#save_client_button").hide();
			}
			else if (data.status == "fail") {
				alertMessage("client_edit_alert", "Please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("client_edit_alert", "Error, please contact us.", "danger", false);
		}
	});
	}
};

