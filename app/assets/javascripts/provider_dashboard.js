/*
 * 
 */
 
var resetProviderDashBoard = function() {
  clearMessages();
};
 
var showAppointmentDetail = function(appointment_id, type, past) {
  past = typeof past !== 'undefined' ? past : false;
  $.ajax({
    type: 'GET',
    url: '/appointment_detail',
    dataType: "json",
    data: { 
    	'appointment_id': appointment_id
    },
    success: function(data) {
      if (data.status == "success") {
        var content = "";
        var footer = "";
        /*
        content += "<div class=\"row\">";
        content += "  <div class=\"col-md-10 col-md-offset-1\">";
        content += "    <div class=\"headline\"><h2>Appointment details</h2></div>";
        content += "  </div>";
        content += "</div>";
        */
        switch (type) {
          case 0:
            content = $('<div/>').append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<h2/>').append('Client Info')
                )
              )
            ).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<label/>').append('Appontment type')
                ).append($('<br>')).append(appointment_types[data.appointment.appointment_type])
              )
            ).append($('<br>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-5 col-md-offset-1').append(
                  $('<label/>').append('Client')
                ).append($('<br>')).append(data.client.first_name + " " + data.client.last_name)
              ).append(
                $('<div/>').addClass('col-md-5 col-md-offset-0').append(
                  $('<label/>').append('Weeks pregnant')
                ).append($('<br>')).append(data.client.weeks_pregnant)
              )
            ).append($('<br>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-5 col-md-offset-1').append(
                  $('<label/>').append('Email')
                ).append($('<br>')).append(data.client.email)
              ).append(
                $('<div/>').addClass('col-md-5 col-md-offset-0').append(
                  $('<label/>').append('Phone')
                ).append($('<br>')).append(data.client.phone)
              )
            ).append($('<br>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<label/>').append('Address')
                ).append($('<br>')).append(data.client.address)
              )
            ).append($('<hr>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<h2/>').append('Provider Info')
                )
              )
            ).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-5 col-md-offset-1').append(
                  $('<label/>').append('Provider')
                ).append($('<br>')).append(data.provider.first_name + " " + data.provider.last_name)
              ).append(
                $('<div/>').addClass('col-md-5 col-md-offset-0').append(
                  $('<label/>').append('Expertise')
                ).append($('<br>')).append(data.provider.expertise)
              )
            ).append($('<br>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-5 col-md-offset-1').append(
                  $('<label/>').append('Email')
                ).append($('<br>')).append(data.provider.email)
              ).append(
                $('<div/>').addClass('col-md-5 col-md-offset-0').append(
                  $('<label/>').append('Phone')
                ).append($('<br>')).append(data.provider.phone)
              )
            ).append($('<hr>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<h2/>').append('Appointment Info')
                )
              )
            ).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-5 col-md-offset-1').append(
                  $('<label/>').append('Date')
                ).append($('<br>')).append(data.date)
              ).append(
                $('<div/>').addClass('col-md-5 col-md-offset-0').append(
                  $('<label/>').append('Address')
                ).append($('<br>')).append(data.client.address)
              )
            ).append($('<br>')).append(
              $('<div/>').addClass('row').append(
                $('<div/>').addClass('col-md-10 col-md-offset-1').append(
                  $('<label/>').append('Observation')
                ).append($('<br>')).append(data.appointment.client_observation)
              )
            );
            footer = $('<button/>').addClass('btn btn-default').prop('type', 'button').append(
              $('<i/>').addClass('fa fa-remove')
            ).append(' Close').click(function() {
              $('#generic_modal').modal('hide');
            });
            break;
          case 1:
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>Appointment type:</label> " + appointment_types[data.appointment.appointment_type];
            content += "  </div>";
            content += "</div>";
            
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-5 col-md-offset-1\">";
            content += "    <label>Client:</label> " + data.client.first_name + " " + data.client.last_name;
            content += "  </div>";
            content += "  <div class=\"col-md-5\">";
            content += "    <label>Weeks pregnant:</label> " + data.client.weeks_pregnant;
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>When:</label> " + data.date;
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>Observations:</label>";
        		content += "    <p class=\"well\">" + data.appointment.client_observation + "</p>";
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <p class=\"lead\">Contact Info</p>";
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>Phone:</label> " + data.client.phone;
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>Email:</label> " + data.client.email;
            content += "  </div>";
            content += "</div>";
            content += "<div class=\"row\">";
            content += "  <div class=\"col-md-10 col-md-offset-1\">";
            content += "    <label>Address:</label> " + data.client.address;
            content += "  </div>";
            content += "</div>";
            footer += "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\"><i class=\"fa fa-remove\"></i> Close</button>";
            if (!past) {
              footer += "<a href=\"javascript: acceptAppointmentWizard(" + appointment_id + "," + type + ");\" class=\"btn btn-primary\" ><i class=\"fa fa-thumbs-o-up\"></i> Accept</a>";
              footer += "<a href=\"javascript: denyAppointmentWizard(" + appointment_id + "," + type + ");\" class=\"btn btn-danger\" ><i class=\"fa fa-thumbs-o-down\"></i> Deny</a>";
              //footer += "<a href=\"javascript: rescheduleAppointmentWizard(" + appointment_id + "," + type + ");\" class=\"btn btn-warning\" ><i class=\"fa fa-clock-o\"></i> Reschedule</a>";
            }
            break;
          case 2:
            // code
            break;
        }
        $("#generic_modal_title").html("Appointment details");
        $("#generic_modal_body").html(content);
        $("#generic_modal_footer").html(footer);
        $("#generic_modal").modal("show");
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Appointment not found.", "warning", false);
    	}
    },
    error: function(data) {
      alertMessage("top_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
};

var working_on_accepting = false;
var acceptAppointmentWizard = function(appointment_id, type) {
  $("#generic_modal").modal("hide");
  if (!working_on_accepting) {
    working_on_accepting = true;
    $.ajax({
      type: 'GET',
      url: '/accept_appointment',
      dataType: "json",
      data: { 
      	'appointment_id': appointment_id
      },
      success: function(data) {
        if (data.status == "success") {
          $("#generic_modal").modal("hide");
          switch (type) {
            case 0:
              reloadAdminAppointments();
              break;
            case 1:
              reloadProviderAppointments();
              break;
            case 2:
              // code
              break;
          }
      	}
      	else if (data.status == "fail") {
      	  alertMessage("top_page_message", "Appointment not found.", "warning", false);
      	}
      	working_on_accepting = false;
      },
      error: function(data) {
        alertMessage("top_page_message", "Some error happened.", "danger", false);
      	console.log("error");
      	console.log(data);
      	working_on_accepting = false;
      }
    });
  }
};

var denyAppointmentWizard = function(appointment_id, type) {
  var content = "";
  var footer = "";
  content += "<div class=\"row\">";
  content += "  <div class=\"col-md-10 col-md-offset-1\">";
  content += "    <p class=\"lead\">Please, give a brief explanation about why you are canceling this appointment:</p>";
  content += "    <textarea class=\"form-control\" id=\"deny_explanation\" placeholder=\"Brief explanation\" rows=\"8\"></textarea>"
  content += "  </div>";
  content += "</div>";
  footer += "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\"><i class=\"fa fa-remove\"></i> Close</button>";
  footer += "<a href=\"javascript: denyAppointment(" + appointment_id + "," + type + ");\" class=\"btn btn-danger\" >OK</a>";
  $("#generic_modal_title").html("Cancel appointment");
  $("#generic_modal_body").html(content);
  $("#generic_modal_footer").html(footer);
  $("#generic_modal").modal("show");
};

var working_on_denying = false;
var denyAppointment = function(appointment_id, type) {
  clearMessage();
  if (!validNotEmpty($("#deny_explanation").val())) {
    alertMessage("generic_modal_alert", "Please, give an explanation about why you are canceling this appointment.", "warning", false);
    $("#deny_explanation").focus();
  }
  else {
    if (!working_on_denying) {
      working_on_denying = true;
      $.ajax({
        type: 'GET',
        url: '/deny_appointment',
        dataType: "json",
        data: { 
        	'appointment_id': appointment_id,
        	'deny_explanation': $("#deny_explanation").val()
        },
        success: function(data) {
          if (data.status == "success") {
            $("#generic_modal").modal("hide");
            $("#deny_explanation").val("");
            switch (type) {
              case 0:
                reloadAdminAppointments();
                break;
              case 1:
                reloadProviderAppointments();
                break;
              case 2:
                // code
                break;
            }
        	}
        	else if (data.status == "fail") {
        	  alertMessage("generic_modal_alert", "Appointment not found.", "warning", false);
        	}
        	working_on_denying = false;
        },
        error: function(data) {
          alertMessage("generic_modal_alert", "Some error happened.", "danger", false);
        	console.log("error");
        	console.log(data);
        	working_on_denying = false;
        }
      });
    }
  }
};

var rescheduleAppointmentWizard = function(appointment_id, type) {
  var content = "";
  var footer = "";
  content += "<div class=\"row\">";
  content += "  <div class=\"col-md-10 col-md-offset-1\">";
  content += "    <p class=\"lead\">These must be used only in <span class=\"test-danger\"><b>URGENT</b></span> cases.</p>";
  content += "    <p class=\"lead\">Please, use the field below to suggest a new schedule for your client.</p>";
  content += "    <textarea class=\"form-control\" id=\"reschedule_explanation\" placeholder=\"Schedule suggestion\" rows=\"8\"></textarea>"
  content += "    <br>";
  content += "    <p class=\"lead\"><i class=\"fa fa-asterisk\"></i> These appointment will be canceled.</p>";
  content += "  </div>";
  content += "</div>";
  footer += "<button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\"><i class=\"fa fa-remove\"></i> Close</button>";
  footer += "<a href=\"javascript: rescheduleAppointment(" + appointment_id + "," + type + ");\" class=\"btn btn-warning\" ><i class=\"fa fa-clock-o\"></i> Reschedule</a>";
  $("#generic_modal_title").html("Reschedule appointment");
  $("#generic_modal_body").html(content);
  $("#generic_modal_footer").html(footer);
  $("#generic_modal").modal("show");
};

var working_on_rescheduling = false;
var rescheduleAppointment = function(appointment_id, type) {
  clearMessage();
  if (!validNotEmpty($("#reschedule_explanation").val())) {
    alertMessage("generic_modal_alert", "Please, give a suggestion of schedule this appointment.", "warning", false);
    $("#reschedule_explanation").focus();
  }
  else {
    if (!working_on_rescheduling) {
      working_on_rescheduling = true;
      $.ajax({
        type: 'GET',
        url: '/reschedule_appointment',
        dataType: "json",
        data: { 
        	'appointment_id': appointment_id,
        	'reschedule_explanation': $("#reschedule_explanation").val()
        },
        success: function(data) {
          if (data.status == "success") {
            $("#generic_modal").modal("hide");
            $("#reschedule_explanation").val("");
            switch (type) {
              case 0:
                reloadAdminAppointments();
                break;
              case 1:
                reloadProviderAppointments();
                break;
              case 2:
                // code
                break;
            }
        	}
        	else if (data.status == "fail") {
        	  alertMessage("generic_modal_alert", "Appointment not found.", "warning", false);
        	}
        	working_on_rescheduling = false;
        },
        error: function(data) {
          alertMessage("generic_modal_alert", "Some error happened.", "danger", false);
        	console.log("error");
        	console.log(data);
        	working_on_rescheduling = false;
        }
      });
    }
  }
};


/**
 * this function should reload the appointments
 * in the admin's dashboard
 * 
 * @author: Thiago Melo
 * @version: 2015-03-17
 */
var reloadAdminAppointments = function() {
  $.ajax({
    type: 'GET',
    url: '/provider_appointments',
    dataType: "json",
    data: { 
    	'provider_id': "0"
    },
    success: function(data) {
      var tbody_pending = $('<tbody/>');
      var tbody_confirmed = $('<tbody/>');
      var tbody_denied = $('<tbody/>');
      var has_pending = false;
      var has_confirmed = false;
      var has_denied = false;
      
      if (data.status == "success") {
        $.each(data.appointments, function(i, appointment) {
    		  if (appointment.accepted == 0) {
    		    has_pending = true;
    		    tbody_pending.append(
    		      $('<tr/>').append(
    		        $('<td/>').append(data.full_providers[i].first_name + " " + data.full_providers[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].first_name + " " + data.full_clients[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].email)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].phone)
    		      ).append(
    		        $('<td/>').append(data.dates[i])
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-primary').click(function() {
    		            acceptAppointmentWizard(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-thumbs-o-up'))
    		        )
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-danger').click(function() {
    		            denyAppointmentWizard(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-thumbs-o-down'))
    		        )
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-primary').click(function() {
    		            showAppointmentDetail(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-arrow-circle-right'))
    		        )
    		      )
    		    );
    		  }
    		  else if (appointment.accepted == 1) {
    		    has_confirmed = true;
    		    tbody_confirmed.append(
    		      $('<tr/>').append(
    		        $('<td/>').append(data.full_providers[i].first_name + " " + data.full_providers[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].first_name + " " + data.full_clients[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].email)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].phone)
    		      ).append(
    		        $('<td/>').append(data.dates[i])
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-danger').click(function() {
    		            denyAppointmentWizard(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-thumbs-o-down'))
    		        )
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-primary').click(function() {
    		            showAppointmentDetail(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-arrow-circle-right'))
    		        )
    		      )
    		    );
    		  }
    		  else if (appointment.accepted == 2) {
    		    has_denied = true;
    		    tbody_denied.append(
    		      $('<tr/>').append(
    		        $('<td/>').append(data.full_providers[i].first_name + " " + data.full_providers[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].first_name + " " + data.full_clients[i].last_name)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].email)
    		      ).append(
    		        $('<td/>').append(data.full_clients[i].phone)
    		      ).append(
    		        $('<td/>').append(data.dates[i])
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-primary').click(function() {
    		            acceptAppointmentWizard(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-thumbs-o-up'))
    		        )
    		      ).append(
    		        $('<td/>').prop('align', 'center').append(
    		          $('<a/>').addClass('text-primary').click(function() {
    		            showAppointmentDetail(appointment.id, 0);
    		          }).append($('<i/>').addClass('fa fa-arrow-circle-right'))
    		        )
    		      )
    		    );
    		  }
				});
				
        if (has_pending) {
          $("#pending_appointments").empty().append(
  		      $('<h2/>').append('Pending appointments')
  		    ).append(
		        $('<table/>').addClass('table table-striped table-hover').append(
	            $('<thead/>').append(
                $('<tr/>')
                  .append($('<th/>').append('Provider'))
                  .append($('<th/>').append('Client'))
                  .append($('<th/>').append('Email'))
                  .append($('<th/>').append('Phone'))
                  .append($('<th/>').append('Date '))
                  .append($('<th/>').prop('align', 'center').append('Accept'))
                  .append($('<th/>').prop('align', 'center').append('Deny'))
                  .append($('<th/>').prop('align', 'center').append('Details'))
              )
	          ).append(tbody_pending)
		      ).append($('<hr>'));
        }
        else {
          $("#pending_appointments").html("");
          $("#no_pending_appointments").html("<br><br><h2>There is no pending appointments.</h2>");
        }
        
        if (has_confirmed) {
          $("#confirmed_appointments").empty().append(
  		      $('<h2/>').append('Upcoming appointments')
  		    ).append(
		        $('<table/>').addClass('table table-striped table-hover').append(
	            $('<thead/>').append(
                $('<tr/>')
                  .append($('<th/>').append('Provider'))
                  .append($('<th/>').append('Client'))
                  .append($('<th/>').append('Email'))
                  .append($('<th/>').append('Phone'))
                  .append($('<th/>').append('Date '))
                  .append($('<th/>').prop('align', 'center').append('Deny'))
                  .append($('<th/>').prop('align', 'center').append('Details'))
              )
	          ).append(tbody_confirmed)
		      ).append($('<hr>'));
        }
        else {
          $("#confirmed_appointments").html("");
          $("#no_confirmed_appointments").html("<br><br><h2>There is no confirmed appointments.</h2>");
        }
        
        if (has_denied) {
          $("#denied_appointments").empty().append(
  		      $('<h2/>').append('Denied appointments')
  		    ).append(
		        $('<table/>').addClass('table table-striped table-hover').append(
	            $('<thead/>').append(
                $('<tr/>')
                  .append($('<th/>').append('Provider'))
                  .append($('<th/>').append('Client'))
                  .append($('<th/>').append('Email'))
                  .append($('<th/>').append('Phone'))
                  .append($('<th/>').append('Date '))
                  .append($('<th/>').prop('align', 'center').append('Accept'))
                  .append($('<th/>').prop('align', 'center').append('Details'))
              )
	          ).append(tbody_denied)
		      ).append($('<hr>'));
        }
        else {
          $("#denied_appointments").html("");
          $("#no_denied_appointments").html("<br><br><h2>There is no denied appointments.</h2>");
        }
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Appointment not found.", "warning", false);
    	}
    },
    error: function(data) {
      alertMessage("top_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
}

var reloadProviderAppointments = function() {
  $.ajax({
    type: 'GET',
    url: '/provider_appointments',
    dataType: "json",
    data: { 
    	'provider_id': $("#provider_id").val()
    },
    success: function(data) {
      if (data.status == "success") {
        var content_pending = "";
        var content_confirmed = "";
        var has_pending = false;
        var has_confirmed = false;
        content_confirmed += "<br><br>";
    		content_confirmed += "<h1><i class=\"fa fa-thumbs-o-up\"></i> Confirmed</h1>";
    		content_confirmed += "<table class=\"table table-striped table-hover\">";
    		content_confirmed += "	<thead>";
    		content_confirmed += "		<tr>";
    		content_confirmed += "			<th>Client</th>";
    		content_confirmed += "			<th>Date</th>";	
    		content_confirmed += "			<th align=\"center\">Deny</th>";
    		//content_confirmed += "			<th align=\"center\">Reschedule</th>";
    		content_confirmed += "		</tr>";
    		content_confirmed += "	</thead>";
    		content_confirmed += "	<tbody>";
    		
    		content_pending += "<br><br>";
    		content_pending += "<h1><i class=\"fa fa-inbox\"></i> Pending</h1>";
    		content_pending += "<table class=\"table table-striped table-hover\">";
    		content_pending += "	<thead>";
    		content_pending += "		<tr>";
    		content_pending += "			<th>Client</th>";
    		content_pending += "			<th>Date</th>";	
    		content_pending += "			<th align=\"center\">Accept</th>";
    		content_pending += "			<th align=\"center\">Deny</th>";
    		//content_pending += "			<th align=\"center\">Reschedule</th>";
    		content_pending += "		</tr>";
    		content_pending += "	</thead>";
    		content_pending += "	<tbody>";
    		$.each(data.appointments, function(i, appointment) {
    		  if (appointment.accepted == 0) {
    		    has_pending = true;
    		    content_pending += "<tr class=\"lead\">";
    				content_pending += "	<td><a href=\"javascript: showAppointmentDetail(" + appointment.id + ", 1);\" class=\"text-primary\">" + data.clients[i] + "</a></td>";
    				content_pending += "	<td>" + data.dates[i] + "</td>";
    				content_pending += "	<td align=\"center\"><a href=\"javascript: acceptAppointmentWizard(" + appointment.id + ", 1);\" class=\"text-primary\"><i class=\"fa fa-thumbs-o-up\"></i></a></td>";
    				content_pending += "	<td align=\"center\"><a href=\"javascript: denyAppointmentWizard(" + appointment.id + ", 1);\" class=\"text-danger\"><i class=\"fa fa-thumbs-o-down\"></i></a></td>";
    				//content_pending += "	<td align=\"center\"><a href=\"javascript: rescheduleAppointmentWizard(" + appointment.id + ", 1);\" class=\"text-warning\"><i class=\"fa fa-clock-o\"></i></a></td>";
    				content_pending += "</tr>";
    		  }
    		  else if (appointment.accepted == 1) {
    		    has_confirmed = true;
    		    content_confirmed += "<tr class=\"lead\">";
    				content_confirmed += "	<td><a href=\"javascript: showAppointmentDetail(" + appointment.id + ", 1);\" class=\"text-primary\">" + data.clients[i] + "</a></td>";
    				content_confirmed += "	<td>" + data.dates[i] + "</td>";
    				content_confirmed += "	<td align=\"center\"><a href=\"javascript: denyAppointmentWizard(" + appointment.id + ", 1);\" class=\"text-danger\"><i class=\"fa fa-thumbs-o-down\"></i></a></td>";
    				//content_confirmed += "	<td align=\"center\"><a href=\"javascript: rescheduleAppointmentWizard(" + appointment.id + ", 1);\" class=\"text-warning\"><i class=\"fa fa-clock-o\"></i></a></td>";
    				content_confirmed += "</tr>";
    		  }
				});
    		content_confirmed += "	</tbody>";
    		content_confirmed += "</table>";
        content_pending += "	</tbody>";
    		content_pending += "</table>";
        if (has_confirmed || has_pending) {
          $("#pending_appointments").html(has_pending ? content_pending : "");
          $("#confirmed_appointments").html(has_confirmed ? content_confirmed : "");
          $("#no_appointments").html("");
        }
        else {
          $("#pending_appointments").html("");
          $("#confirmed_appointments").html("");
          var no_appointments = "";
          no_appointments += "<br><br>";
          no_appointments += "<h1>You have no appointments booked.</h1>";
          $("#no_appointments").html(no_appointments);
        }
        
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Appointment not found.", "warning", false);
    	}
    },
    error: function(data) {
      alertMessage("top_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
};

/*
 * It is used for the provider change her or his password, it requires the
 * provider to be logged in to perform the change
 * Last update: 2015-02-19 by @thiago
 */
var selfChangeProviderPassword = function() {
	clearMessage("top_page_message");
	
	// validate password
	if (!validPassword($("#provider_old_password").val()) || !validPassword($("#provider_password").val()) || !validPassword($("#provider_password_confirmation").val())) {
		$("#provider_old_password").val("");
		$("#provider_password_confirmation").val("");
		$("#provider_password").val("");
		$("#provider_password").focus();
		alertMessage("top_page_message", "Invalid passwords. Password must be at least 6 characters long.", "warning", false);
		return;
	}
	
	if ($("#provider_password").val() != $("#provider_password_confirmation").val()) {
		$("#provider_old_password").val("");
		$("#provider_password_confirmation").val("");
		$("#provider_password").val("");
		$("#provider_password").focus();
		alertMessage("top_page_message", "Password don't match.", "warning", false);
		return;
	}
	
	$.ajax({
    type: 'GET',
    url: '/self_change_provider_password',
    dataType: "json",
    data: { 
    	'provider_id': $("#providers_list").val(),
    	'provider[old_password]': $("#provider_old_password").val(),
    	'provider[password]': $("#provider_password").val(),
    	'provider[password_confirmation]': $("#provider_password_confirmation").val()
    },
    success: function(data) {
      if (data.status == "success") {
        alertMessage("top_page_message", "Password updated.", "success", false);
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Provider not found.", "warning", false);
    	}
    	$("#provider_old_password").val("");
    	$("#provider_password").val("");
  		$("#provider_password_confirmation").val("");
    },
    error: function(data) {
      alertMessage("top_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
};

/* -------------------------------------------------------------------------- */

var enableEditProvider = function() {
	if ($("#provider_first_name").prop("disabled")) {
		$("#provider_first_name").prop("disabled", false);
		$("#provider_last_name").prop("disabled", false);
		$("#provider_email").prop("disabled", false);
		$("#provider_phone").prop("disabled", false);
		$("#provider_expertise").prop("disabled", false);
		$("#provider_abstract").prop("disabled", false);
		$("#provider_about").prop("disabled", false);
		
		$("#edit_provider_button").html("<i class=\"fa fa-toggle-on\"></i> Cancel");
		$("#save_provider_button").show();
	}
	else {
		resetProviderInfo();
		$("#provider_first_name").prop("disabled", true);
		$("#provider_last_name").prop("disabled", true);
		$("#provider_email").prop("disabled", true);
		$("#provider_phone").prop("disabled", true);
		$("#provider_expertise").prop("disabled", true);
		$("#provider_abstract").prop("disabled", true);
		$("#provider_about").prop("disabled", true);
		
		$("#edit_provider_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Info");
		$("#save_provider_button").hide();
	}
};

var saveEditProvider = function() {
	
	var dataToSend = [];
	
	dataToSend["provider_id"] = $("#provider_id").val();
	dataToSend["provider[first_name]"] = $("#provider_first_name").val();
	dataToSend["provider[last_name]"] = $("#provider_last_name").val();
	dataToSend["provider[email]"] = $("#provider_email").val();
	dataToSend["provider[phone]"] = $("#provider_phone").val();
	dataToSend["provider[expertise]"] = $("#provider_expertise").val();
	dataToSend["provider[about]"] = $("#provider_about").val();
	dataToSend["provider[abstract]"] = $("#provider_abstract").val();
	
	var formData = new FormData();
	formData.append("provider_id", $("#provider_id").val());
	formData.append("provider[first_name]", $("#provider_first_name").val());
	formData.append("provider[last_name]", $("#provider_last_name").val());
	formData.append("provider[email]", $("#provider_email").val());
	formData.append("provider[phone]", $("#provider_phone").val());
	formData.append("provider[expertise]", $("#provider_expertise").val());
	formData.append("provider[about]", $("#provider_about").val());
	formData.append("provider[abstract]", $("#provider_abstract").val());
	
	if (!$("#provider_first_name").prop("disabled") && validateProviderUpdateInfoShort()) {
		$.ajax({
			type: 'post',
			url: '/update_provider_information',
			data: formData,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			success: function(data) {
				if (data.status == "success") {
					enableEditProvider();
				}
				else if (data.status == "fail") {
					alertMessage("provider_edit_alert", "Please, try again.", "warning", false);
				}
			},
			error: function(data) {
				console.log("error");
				console.log(data);
				alertMessage("provider_edit_alert", "Error, please contact us.", "danger", false);
			}
		});
	}
};

var resetProviderInfo = function() {
	if (!$("#provider_first_name").prop("disabled")) {
		$.ajax({
		type: 'GET',
		url: '/provider_simple_info',
		dataType: "json",
		data: {
			'provider_id': $("#provider_id").val()
		},
		success: function(data) {
			if (data.status == "success") {
				$("#provider_first_name").val(data.provider.first_name);
				$("#provider_last_name").val(data.provider.last_name);
				$("#provider_phone").val(data.provider.phone);
				$("#provider_email").val(data.provider.email);
				$("#provider_expertise").val(data.provider.expertise);
				$("#provider_about").val(data.provider.about);
				$("#provider_abstract").val(data.provider.abstract);
				
				$("#provider_first_name").prop("disabled", true);
				$("#provider_last_name").prop("disabled", true);
				$("#provider_email").prop("disabled", true);
				$("#provider_phone").prop("disabled", true);
				$("#provider_expertise").prop("disabled", true);
				$("#provider_abstract").prop("disabled", true);
				$("#provider_about").prop("disabled", true);
				
				$("#edit_provider_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Info");
				$("#save_provider_button").hide();
			}
			else if (data.status == "fail") {
				alertMessage("provider_edit_alert", "Please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("provider_edit_alert", "Error, please contact us.", "danger", false);
		}
	});
	}
};

/* -------------------------------------------------------------------------- */

var enableEditPolicies = function() {
	if ($("#provider_policies").prop("disabled")) {
		$("#provider_policies").prop("disabled", false);
		
		$("#edit_policies_button").html("<i class=\"fa fa-toggle-on\"></i> Cancel");
		$("#save_policies_button").show();
	}
	else {
		resetPoliciesInfo();
		$("#provider_policies").prop("disabled", true);
		
		$("#edit_policies_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Policies");
		$("#save_policies_button").hide();
	}
};

var resetPoliciesInfo = function() {
	if (!$("#provider_policies").prop("disabled")) {
		$.ajax({
		type: 'GET',
		url: '/provider_simple_info',
		dataType: "json",
		data: {
			'provider_id': $("#provider_id").val()
		},
		success: function(data) {
			if (data.status == "success") {
				$("#provider_policies").val(data.provider.policies);
				$("#provider_policies").prop("disabled", true);
				
				$("#edit_policies_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Policies");
				$("#save_policies_button").hide();
			}
			else if (data.status == "fail") {
				alertMessage("provider_edit_alert", "Please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("provider_edit_alert", "Error, please contact us.", "danger", false);
		}
	});
	}
};


/* -------------------------------------------------------------------------- */

var enableEditServices = function() {
	if ($("#provider_service_text").prop("disabled")) {
		$("#provider_service_text").prop("disabled", false);
		
		$("#edit_services_button").html("<i class=\"fa fa-toggle-on\"></i> Cancel");
		$("#save_services_button").show();
	}
	else {
		resetServicesInfo();
		$("#provider_service_text").prop("disabled", true);
		
		$("#edit_services_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Services");
		$("#save_services_button").hide();
	}
};

var resetServicesInfo = function() {
	if (!$("#provider_service_text").prop("disabled")) {
		$.ajax({
		type: 'GET',
		url: '/provider_simple_info',
		dataType: "json",
		data: {
			'provider_id': $("#provider_id").val()
		},
		success: function(data) {
			if (data.status == "success") {
				$("#provider_service_text").val(data.provider.service_text);
				$("#provider_service_text").prop("disabled", true);
				
				$("#edit_services_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Services");
				$("#save_services_button").hide();
			}
			else if (data.status == "fail") {
				alertMessage("provider_edit_alert", "Please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("provider_edit_alert", "Error, please contact us.", "danger", false);
		}
	});
	}
};

/* -------------------------------------------------------------------------- */

var enableEditSpecialties = function() {
	if ($("#provider_specialty_text").prop("disabled")) {
		$("#provider_specialty_text").prop("disabled", false);
		
		$("#edit_specialties_button").html("<i class=\"fa fa-toggle-on\"></i> Cancel");
		$("#save_specialties_button").show();
	}
	else {
		resetSpecialtiesInfo();
		$("#provider_specialty_text").prop("disabled", true);
		
		$("#edit_specialties_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Specialties");
		$("#save_specialties_button").hide();
	}
};

var resetSpecialtiesInfo = function() {
	if (!$("#provider_specialty_text").prop("disabled")) {
		$.ajax({
  		type: 'GET',
  		url: '/provider_simple_info',
  		dataType: "json",
  		data: {
  			'provider_id': $("#provider_id").val()
  		},
  		success: function(data) {
  			if (data.status == "success") {
  				$("#provider_specialty_text").val(data.provider.specialty_text);
  				$("#provider_specialty_text").prop("disabled", true);
  				
  				$("#edit_specialties_button").html("<i class=\"fa fa-toggle-off\"></i> Edit Specialties");
  				$("#save_specialties_button").hide();
  			}
  			else if (data.status == "fail") {
  				alertMessage("provider_edit_alert", "Please try again.", "warning", false);
  			}
  		},
  		error: function(data) {
  			console.log("error");
  			console.log(data);
  			alertMessage("provider_edit_alert", "Error, please contact us.", "danger", false);
  		}
  	});
	}
};


/*
 *
 */
 
var parseDate = function (dateTime) {
	var yyyy = dateTime.substr(0, 4);
    var mm = dateTime.substr(5, 2);
    var dd = dateTime.substr(8, 2);

    var h = dateTime.substr(11, 2);
    var m = dateTime.substr(14, 2);
    var s = dateTime.substr(17, 2); 
    return new Date(yyyy, parseInt(mm, 10) - 1,dd,h,m,s);
};


/**
 * this function should switch the provider availability
 * for an specific time
 * 
 * @params: [provider_id] the provider's id
 *          [cell_id] the time in the shape W_HH_MM, w is the weekday, sunday = 0
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var switchProviderTimeAvailability = function(provider_id, cell_id) {
  var next = nextTimeCellID(cell_id);
  var prev = prevTimeCellID(cell_id);
  
  var prev_prev = prevTimeCellID(prevTimeCellID(cell_id));
  var next_next = nextTimeCellID(nextTimeCellID(cell_id));
  
  if ($("#" + cell_id).hasClass("schedule-free")) {
    $("#" + cell_id).removeClass("schedule-free");
    $("#" + cell_id).addClass("schedule-blocked").addClass("danger");
    
    if ($("#" + next_next).hasClass("schedule-blocked")) {
      $("#" + next).removeClass("schedule-free");
      $("#" + next).addClass("schedule-blocked").addClass("danger");
    }
    if ($("#" + prev_prev).hasClass("schedule-blocked")) {
      $("#" + prev).removeClass("schedule-free");
      $("#" + prev).addClass("schedule-blocked").addClass("danger");
    }
  } 
  else {
    $("#" + cell_id).addClass("schedule-free");
    $("#" + cell_id).removeClass("schedule-blocked").removeClass("danger");
    $("#" + next).addClass("schedule-free");
    $("#" + next).removeClass("schedule-blocked").removeClass("danger");
  }
  $.ajax({
		type: 'GET',
		url: '/toogle_provider_time_availability',
		dataType: "json",
		data: {
			'provider_id': provider_id,
			'timeid': cell_id
		},
		success: function(data) {
			if (data.status == "success") {
				
			}
			else if (data.status == "fail") {
				console.log("rapaz, voce ta fazendo merda em algum lugar ai...");
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Error, please contact us.", "danger", false);
		}
	});
};

/**
 * for an entry YYYY_MM_DD_ID_HH_MM
 * it return the ID of half hour before
 * 
 * For 2015_04_03_1_13_30, it returns 2015_04_03_1_13_00
 * For 2015_04_03_1_13_00, it returns 2015_04_03_1_12_30
 * 
 * @params: [id] the id of a cell to get the id of the cell before
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var prevTimeCellID = function(id) {
  var parts = id.split("_");
  var minutes = parseInt(parts.pop(), 10);
  var hour = parseInt(parts.pop(), 10);
  
  hour = minutes == 0 ? hour - 1 : hour;
  hour = hour >= 10 ? hour.toString() : "0" + hour.toString();
  minutes = minutes == 0 ? 30 : 0;
  minutes = minutes >= 10 ? minutes.toString() : "0" + minutes.toString();
  return parts.join('_') + "_" + hour + "_" + minutes;
};

/**
 * for an entry YYYY_MM_DD_ID_HH_MM
 * it return the ID of half hour after
 * 
 * For 2015_04_03_1_13_30, it returns 2015_04_03_1_14_00
 * For 2015_04_03_1_13_00, it returns 2015_04_03_1_13_30
 * 
 * @params: [id] the id of a cell to get the id of the cell after
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var nextTimeCellID = function(id) {
  var parts = id.split("_");
  var minutes = parseInt(parts.pop(), 10);
  var hour = parseInt(parts.pop(), 10);
  
  hour = minutes == 0 ? hour : hour + 1;
  hour = hour >= 10 ? hour.toString() : "0" + hour.toString();
  minutes = minutes == 0 ? 30 : 0;
  minutes = minutes >= 10 ? minutes.toString() : "0" + minutes.toString();
  return parts.join('_') + "_" + hour + "_" + minutes;
};

/**
 * this function should replace the current provider's schedule been
 * shown by its next orprevious week
 * 
 * @params: [week] next week number (1..54)
 *          [year] the year
 * 
 * @author: Thiago Melo
 * @version: 2015-04-03
 */
var weekProviderSchedule = function(week, year, provider_id) {
  // erase the current desktop
  var provider_weekly_schedule_desktop = $('#provider_weekly_schedule_desktop').empty();
  // get date of first week's day
  var first_day = firstDayOfWeek(year, week);
  var last_day = new Date(first_day.getTime());
  last_day.setDate(last_day.getDate() + 6);
  
  var possible_hours = [];
  var possible_weekdays = [];
  for (var i = 6; i < 21; i++) {
    possible_hours.push(i);
  }
  for (var j = 0; j < 7; j++) {
    possible_weekdays.push(j);
  }
  
  $.ajax({
		type: 'GET',
		url: '/provider_schedules_appointments',
		dataType: "json",
		data: {
			'provider_id': provider_id,
			'time_start': first_day.getTime(),
			'time_end': last_day.getTime()
		},
		success: function(data) {
			if (data.status == "success") {
			  $.each(possible_hours, function(i_index, i) {
		      var first_row = $('<tr/>').append($('<td/>').prop('rowspan', '2').append((i > 9 ? '' : '0') + i.toString() + ':00'));
          var second_row = $('<tr/>');
          var other_day = new Date(first_day.getTime());
          $.each(possible_weekdays, function(j_index, j) {
            var time_id = [];
            time_id.push(other_day.getUTCFullYear());
            time_id.push(other_day.getUTCMonth() + 1 > 9 ? other_day.getUTCMonth() + 1 : '0' + (other_day.getUTCMonth() + 1).toString());
            time_id.push(other_day.getUTCDate() > 9 ? other_day.getUTCDate() : '0' + (other_day.getUTCDate()).toString());
            time_id.push(j.toString());
            time_id.push((i > 9 ? '' : '0') + i.toString());
            var time_id_f = time_id.join('_') + '_00';
            var time_id_s = time_id.join('_') + '_30';
            
            var f_available = true;
            var s_available = true;
            $.each(data.schedules, function(s_index, schedule) {
              if (schedule.unavailable && schedule.timeid == time_id_f) {
                f_available = false;
              } else if (schedule.unavailable && schedule.timeid == time_id_s) {
                s_available = false;
              }
            });
            
            var has_appointment_f = false;
            var has_appointment_s = false;
            
            var time_start_f_1 = new Date(other_day.getTime());
            var time_end_f_1 = new Date(other_day.getTime());
            var time_start_f_2 = new Date(other_day.getTime());
            var time_end_f_2 = new Date(other_day.getTime());
            time_start_f_1.setHours(i - 1, 35, 0);
            time_start_f_2.setHours(i - 1, 45, 0);
            time_end_f_1.setHours(i, 45, 0, 0);
            time_end_f_2.setHours(i, 55, 0, 0);
            
            var time_start_s_1 = new Date(other_day.getTime());
            var time_end_s_1 = new Date(other_day.getTime());
            var time_start_s_2 = new Date(other_day.getTime());
            var time_end_s_2 = new Date(other_day.getTime());
            time_start_s_1.setHours(i, 5, 0);
            time_start_s_2.setHours(i, 15, 0);
            time_end_s_1.setHours(i + 1, 15, 0, 0);
            time_end_s_2.setHours(i + 1, 25, 0, 0);
            
            $.each(data.appointments, function(appointment_index, appointment) {
              
              var my_appoint = new Appointment(appointment.id, appointment.provider_id, appointment.client_id, appointment.time_start, appointment.time_end, appointment.accepted, appointment.client_observation, appointment.created_at, appointment.updated_at);
              
              var appointment_start = my_appoint.time_start;
              var appointment_end = my_appoint.time_end;
              
              if ((appointment_start >= time_start_f_1 && appointment_start <= time_start_f_2) || (appointment_end >= time_end_f_1 && appointment_end <= time_end_f_2)) {
                has_appointment_f = true;
              }
              
              if ((appointment_start >= time_start_s_1 && appointment_start <= time_start_s_2) || (appointment_end >= time_end_s_1 && appointment_end <= time_end_s_2)) {
                has_appointment_s = true;
              }
              
            });
            
            if (has_appointment_f) {
              first_row.append($('<td/>').addClass("schedule-blocked-appointment"));
            } else {
              first_row.append(
                $('<td/>').addClass(f_available ? "schedule-free" : "schedule-blocked danger").css('cursor', 'pointer').prop('id', time_id_f).on('click', function() {
                  switchProviderTimeAvailability(provider_id, time_id_f);
                })
              );
            }
            if (has_appointment_s) {
              second_row.append($('<td/>').addClass("schedule-blocked-appointment"));
            } else {
              second_row.append(
                $('<td/>').addClass(s_available ? "schedule-free" : "schedule-blocked danger").css('cursor', 'pointer').prop('id', time_id_s).on('click', function() {
                  switchProviderTimeAvailability(provider_id, time_id_s);
                })
              );
            }
            
            $('#weekday_' + j).empty().append((other_day.getUTCMonth() + 1) + '/' + other_day.getUTCDate());
            other_day.setDate(other_day.getDate() + 1);
          });
          provider_weekly_schedule_desktop.append(first_row).append(second_row);  
			  });
			  
        $('#provider_prev_week_button').prop('href', 'javascript: weekProviderSchedule(' + (week - 1) + ', ' + year + ', ' + provider_id + ')');
        $('#provider_next_week_button').prop('href', 'javascript: weekProviderSchedule(' + (week + 1) + ', ' + year + ', ' + provider_id + ')');
        $('#provider_month_year_display').empty().append(monthName(first_day.getUTCMonth() + 1) + ' ' + year);
			}
			else if (data.status == "fail") {
				console.log("rapaz, voce ta fazendo merda em algum lugar ai...");
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Error, please contact us.", "danger", false);
		}
	});
};

/**
 * this function receives a week number and the year and returns
 * the date of the first day of this week
 * 
 * @params: [week] prev week number (1..54)
 *          [year] the year 
 * 
 * @author: http://stackoverflow.com/questions/7580824/how-to-convert-a-week-number-to-a-date-in-javascript
 * @version: 2015-04-03
 */
var firstDayOfWeek = function(year, week) {

    // Jan 1 of 'year'
    var d = new Date(year, 0, 1),
        offset = d.getTimezoneOffset();

    // ISO: week 1 is the one with the year's first Thursday 
    // so nearest Thursday: current date + 4 - current day number
    // Sunday is converted from 0 to 7
    d.setDate(d.getDate() + 4 - (d.getDay() || 7));

    // 7 days * (week - overlapping first week)
    d.setTime(d.getTime() + 7 * 24 * 60 * 60 * 1000 
        * (week + (year == d.getFullYear() ? -1 : 0 )));

    // daylight savings fix
    d.setTime(d.getTime() 
        + (d.getTimezoneOffset() - offset) * 60 * 1000);

    // back to Sunday (from Thursday)
    d.setDate(d.getDate() - 4);

    return d;
};

/**
 * month name (1..12)
 */
var monthName = function(month) {
  switch (month) {
    case 1:
      return 'January';
    case 2:
      return 'February';
    case 3:
      return 'March';
    case 4:
      return 'April';
    case 5:
      return 'May';
    case 6:
      return 'June';
    case 7:
      return 'July';
    case 8:
      return 'August';
    case 9:
      return 'September';
    case 10:
      return 'October';
    case 11:
      return 'November';
    case 12:
      return 'December';
  }
};