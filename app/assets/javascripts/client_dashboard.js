/**
 * this function opens a modal containing a form for the client
 * request a new time for the provider
 * 
 * @params: [appointment_id] is the underlying appointment's id
 * @author: Thiago Melo
 * @version: 2015-03-15
 */
var reschedule = function(appointment_id) {
	clearMessages();
	$("#reschedules_modal_content")
		.html(
			$("<div/>")
				.append(
					$('<div/>')
						.addClass('row')
						.append(
							$('<div/>')
								.addClass('col-md-10 col-md-offset-1')
								.append(
									$('<p/>').append(
										'Please use the following field to request a new appointment, we are going to get in touch with you as soon as possible.'
									)
								)
								.append(
									$('<p/>').append(
										$('<strong/>')
											.append(
												'We are going to keep your appointment until you agree in change it to another time.'
											)
									)
								)
								.append(
									$('<textarea/>')
										.addClass('form-control')
										.prop('name', 'reschedule_message')
										.prop('id', 'reschedule_message')
										.prop('placeholder', 'Reschedule message')
										.prop('rows', '3')
								)
								
						)
				)
				.append($('<br>'))
				.append(
					$('<div/>')
						.addClass('row')
						.append(
							$('<div/>')
								.addClass('col-md-10 col-md-offset-1')
								.append(
									$('<a/>')
										.addClass('btn btn-danger pull-right')
										.click(function() {
											sendRescheduleRequest(appointment_id);
										})
										.append('Send request')
								)
						)
				)
				.append($('<hr>'))
				.append(
					$('<div/>')
						.addClass('row')
						.append(
							$('<div/>')
								.addClass('col-md-10 col-md-offset-1')
								.append(
									$('<p/>')
										.append(
											'If you prefer, you can just cancel the appointment.'
										)
									)
								.append(
									$('<p/>')
										.append(
											$('<strong/>')
												.append(
													'After canceling, this time will be available and can be booked for someone else.'
												)
										)
								)
						)
				)
				.append(
					$('<div/>')
						.addClass('row')
						.append(
							$('<div/>')
								.addClass('col-md-10 col-md-offset-1')
								.append(
									$('<a/>')
										.addClass('btn btn-danger pull-right')
										.click(function() {
											askCancelingAgreement(appointment_id);
										})
										.append('Cancel appointment')
								)
						)
				)
		);
	$("#reschedules_title").html("Rescheduling appointment");
	$('#reschedules_modal').modal('show');
};

/**
 * this function should change the reschedule box to a message showing 
 * the current appointment and asking if the client agree with
 * the canceling poins
 * 
 * @params: [appointment_id] is the corresponding appointment's id
 * 
 * @author: Thiago Melo
 * @version: 2015-03-16
 */
var askCancelingAgreement = function(appointment_id) {
	clearMessages();
	$('#reschedules_modal_content')
		.empty()
		.append(
			$('<div/>')
				.addClass('row')
				.append(
					$('<div/>')
						.addClass('col-md-10 col-md-offset-1')
						.append(
							$('<p/>').append(
								$('<strong/>')
									.append(
										'By canceling this booking, you agree in left it available to be booked by someone else.'
									)
							)
						)
						.append($('<br>'))
						.append(
							$('<a/>')
								.addClass('btn btn-default pull-left')
								.click(function() {
								  $('#reschedules_modal').modal('hide');
								})
								.append('Keep my booking')
						)
						.append(
							$('<a/>')
								.addClass('btn btn-danger pull-right')
								.click(function() {
									cancelAppointment(appointment_id);
								})
								.append('Yes, cancel my booking')
						)
				)
		);
	
	$("#reschedules_title").html('Canceling booking');
	$('#reschedules_modal').modal('show');
};

/**
 * this functions should perform an ajax request with must cancel the
 * appointment
 * 
 * the [working_on_canceling_appointment] is a variable that avoids
 * the method to be executed twice
 * 
 * @params: [appointment_id] the corresponding appointment's id
 * 
 * @author: Thiago Melo
 * @version: 2015-03-16
 * 
 */
var working_on_canceling_appointment = false;
var cancelAppointment = function(appointment_id) {
	if (!working_on_canceling_appointment) {
		working_on_canceling_appointment = true;
		$.ajax({
			type: 'GET',
			url: '/cancel_appointment_by_client',
			dataType: "json",
			data: {
				'appointment_id': appointment_id
			},
			success: function(data) {
				if (data.status == "success") {
					$('#reschedule_message').val("");
					alertMessage("reschedules_alert", "Your booking has been canceled.", "success", false);
					setTimeout(function(){ location.reload(); }, 3000);
				}
				else if (data.status == "fail") {
					alertMessage("reschedules_alert", "Please try again.", "warning", false);
				}
				else if (data.status == "not_found") {
					alertMessage("reschedules_alert", "Appointment not found.", "warning", false);
				}
				else if (data.status == "not_allowed") {
					alertMessage("reschedules_alert", "You have no permission to reschedule this appointment.", "warning", false);
				}
				working_on_canceling_appointment = false;
			},
			error: function(data) {
				console.log("error");
				console.log(data);
				alertMessage("reschedules_alert", "Error, please contact us.", "danger", false);
				working_on_canceling_appointment = false;
			}
		});
	}
};

/**
 * send the reschedule request message
 * 
 * it is going to access the parameter with id [reschedule_message]
 * in the reschedule window
 * 
 * it would be better if the [reschedule_message] was a parameter
 * to this function, do this later if you could.
 * 
 * the variable [working_on_reschedule_request] avoids the message to be
 * send twice due to some delay, it means, due to some delay, sometimes
 * the user clicks again and the message could be sent twice
 * it would be better if there was some loading wheel spinning
 * 
 * @params: [appointment_id] is the underlying appointment's id
 * @author: Thiago Melo
 * @version: 2015-03-16
 *
 */
var working_on_reschedule_request = false;
var sendRescheduleRequest = function(appointment_id) {
	var reschedule_message = $('#reschedule_message').val();
	if (validNotEmpty(reschedule_message)) {
		if (!working_on_reschedule_request) {
			working_on_reschedule_request = true;
			$.ajax({
				type: 'GET',
				url: '/reschedule_request_by_client',
				dataType: "json",
				data: {
					'appointment_id': appointment_id,
					'reschedule_message': reschedule_message
				},
				success: function(data) {
					if (data.status == "success") {
						$('#reschedule_message').val("");
						alertMessage("reschedules_alert", "Your reschedule message has been sent. Please wait for our contact.", "success", false);
					}
					else if (data.status == "fail") {
						alertMessage("reschedules_alert", "Please try again.", "warning", false);
					}
					else if (data.status == "not_found") {
						alertMessage("reschedules_alert", "Appointment not found.", "warning", false);
					}
					else if (data.status == "not_allowed") {
						alertMessage("reschedules_alert", "You have no permission to reschedule this appointment.", "warning", false);
					}
					working_on_reschedule_request = false;
				},
				error: function(data) {
					console.log("error");
					console.log(data);
					alertMessage("reschedules_alert", "Error, please contact us.", "danger", false);
					working_on_reschedule_request = false;
				}
			});
		}
	}
	else {
		alertMessage("reschedules_alert", "Please fill out some reschedule message.", "warning", false);
	}
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
		$("#client_first_name").prop("disabled", false);
		$("#client_last_name").prop("disabled", false);
		$("#client_address").prop("disabled", false);
		$("#client_phone").prop("disabled", false);
		$("#client_weeks_pregnant").prop("disabled", false);
		
		$("#edit_client_button").html("<i class=\"fa fa-toggle-on\"></i> Cancel");
		$("#save_client_button").show();
	}
	else {
		resetClientInfo();
		$("#client_first_name").prop("disabled", true);
		$("#client_last_name").prop("disabled", true);
		
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
				'client[first_name]': $("#client_first_name").val(),
				'client[last_name]': $("#client_last_name").val(),
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
				$("#client_first_name").val(data.client.first_name);
				$("#client_last_name").val(data.client.last_name);
				
				$("#client_address").val(data.client.address);
				$("#client_phone").val(data.client.phone);
				$("#client_weeks_pregnant").val(data.client.weeks_pregnant);
				
				$("#client_first_name").prop("disabled", true);
				$("#client_last_name").prop("disabled", true);
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

