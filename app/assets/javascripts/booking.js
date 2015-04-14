/* Appointment */

function Appointment(id, provider_id, client_id, start, end, accepted, client_observation, created_at, updated_at) {
	this.id = id;
	this.provider_id = provider_id;
	this.client_id = client_id;
	this.start = this.parseDate(start);
	this.end = this.parseDate(end);
	this.accepted = accepted;
	this.client_observation = client_observation;
	this.created_at = created_at;
	this.updated_at = updated_at;
}

Appointment.prototype.parseDate = function (dateTime) {
	var yyyy = dateTime.substr(0, 4);
    var mm = dateTime.substr(5, 2);
    var dd = dateTime.substr(8, 2);

    var h = dateTime.substr(11, 2);
    var m = dateTime.substr(14, 2);
    var s = dateTime.substr(17, 2); 
    return new Date(yyyy, parseInt(mm) - 1,dd,h,m,s);
};

/* Schedule Magic */

function Schedule() {
	
}

Schedule.prototype.monthly = function (provider_id, date) {
	var d_month = date.getMonth();
	var d_year = date.getFullYear();
	
	this.provider_id = provider_id;
	this.m_first_day = new Date(d_year, d_month, 1);
	this.c_first_day = new Date(d_year, d_month, 1 - this.m_first_day.getDay());
	this.m_last_day = new Date(d_year, d_month + 1, 0);
	this.c_last_day = new Date(d_year, d_month + 1, 6 - this.m_last_day.getDay());
	this.get_schedule(this.provider_id, this.c_first_day, this.c_last_day, this.callback_month, this);
};

Schedule.prototype.callback_month = function(appointments, self) {
	var o_month = new Monthly(appointments, self.m_first_day, self.m_last_day, self.c_first_day, self.c_last_day);
	o_month.print();
};

Schedule.prototype.weekly = function (provider_id, date) {
	var d_day = date.getDate();
	var d_weekday = date.getDay();

	var d_month = date.getMonth();
	var d_year = date.getFullYear();
	
	this.provider_id = provider_id;

	/* month first day */
	this.m_first_day = new Date(d_year, d_month, 1);
	this.m_last_day = new Date(d_year, d_month + 1, 0);

	this.c_first_day = new Date(d_year, d_month, d_day - d_weekday);
	this.c_last_day = new Date(d_year, d_month, d_day + 6 - d_weekday);

	this.get_schedule(this.provider_id, this.c_first_day, this.c_last_day, this.callback_week, this);
};

Schedule.prototype.callback_week = function(appointments, self) {
	var o_week = new Weekly(appointments, self.m_first_day, self.m_last_day, self.c_first_day, self.c_last_day);
	o_week.print();
};

Schedule.prototype.daily = function (provider_id, date) {
	var d_day = date.getDate();
	var d_weekday = date.getDay();
	var d_month = date.getMonth();
	var d_year = date.getFullYear();
	
	this.provider_id = provider_id;
	this.m_first_day = new Date(d_year, d_month, 1);
	this.c_first_day = new Date(d_year, d_month, d_day);
	this.m_last_day = new Date(d_year, d_month + 1, 0);
	this.c_last_day = new Date(d_year, d_month + 1, d_day);
	this.get_schedule(this.provider_id, this.c_first_day, this.c_last_day, this.callback_day, this);
};

Schedule.prototype.callback_day = function(appointments, self) {
	var o_day = new Daily(appointments, self.m_first_day, self.m_last_day, self.c_first_day, self.c_last_day);
	o_day.print();
};

Schedule.prototype.get_schedule = function(provider_id, datetime_start, datetime_end, callback, self) {
	var appointments = [];

	var s_start = datetime_start.getFullYear() + "-" + ("0" + (datetime_start.getMonth() + 1)).slice(-2) + "-" + ("0" + datetime_start.getDate()).slice(-2) + " 00:00:00"
	var s_end = datetime_end.getFullYear() + "-" + ("0" + (datetime_end.getMonth() + 1)).slice(-2) + "-" + ("0" + datetime_end.getDate()).slice(-2) + " 23:59:59"

	$.ajax({
		type: 'GET',
		url: '/appointments_ajax',
		dataType: "json",
		data: { 
			'id': provider_id,
			'start': s_start,
			'end': s_end
		},
		success: function(data) {
			if (data.status == "success") {
				$.each(data.appointments, function(i, appointment) {
					var s_appointment = new Appointment(appointment.id, appointment.provider_id, appointment.client_id, appointment.start, appointment.end, appointment.accepted, appointment.client_observation, appointment.created_at, appointment.updated_at);
					appointments.push(s_appointment);
				});
				callback(appointments, self);
			}
			else if (data.status == "fail") {
				alertMessage("schedules_body_alert", "Fail loading the appointments, please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("schedules_body_alert", "Error, please contact us.", "danger", false);
		}
	});
};

/* screens */

function Screens() {
	
}

Screens.prototype.weekday_short = function(day) {
	switch (day) {
		case 0:
			return "Sun";
		case 1:
			return "Mon";
		case 2:
			return "Tue";
		case 3:
			return "Wed";
		case 4:
			return "Thu";
		case 5:
			return "Fri";
		case 6:
			return "Sat";
		default:
			return "Error!";
	}
};

Screens.prototype.month = function(month) {
	switch (parseInt(month)) {
		case 1:
			return "January";
		case 2:
			return "February";
		case 3:
			return "March";
		case 4:
			return "April";
		case 5:
			return "May";
		case 6:
			return "June";
		case 7:
			return "July";
		case 8:
			return "August";
		case 9:
			return "September";
		case 10:
			return "October";
		case 11:
			return "November";
		case 12:
			return "December";
		default:
			return "Error!";
	}
};

Screens.prototype.month_short = function(month) {
	month = parseInt(month);
	if (month >= 1 && month <= 12) {
		return this.month(month).substr(0, 3);
	}
	return this.month(month);
};

Screens.prototype.handle_date_time = function(date, time) {
	var date_part = date.substr(6, 4) + "-" + date.substr(3, 2) + "-" + date.substr(0, 2);
	var time_part = time.substr(0,2) + ":" + time.substr(3, 2);
	return date_part + " " + time_part;
};

/* Monthly */

function Monthly(appointments, m_first_day, m_last_day, c_first_day, c_last_day) {
	//Screens.call(this);
	this.appointments = appointments;
	this.m_first_day = m_first_day;
	this.m_last_day = m_last_day;
	this.c_first_day = c_first_day;
	this.c_last_day = c_last_day;
}

//Monthly.prototype = Object.create(Screen.prototype);

Monthly.prototype.print = function() {
	
	var content = "";
	var a_len = this.appointments.length;
	var o_screen = new Screens();
	var today = new Date();
	today.setHours(0, 0, 0, 0);

	content = content + "<div class=\"table-responsive\">";
	content = content + "	<table class=\"table table-striped table-hover text-center table-bordered\">";
	content = content + "		<thead>";
	content = content + "			<tr>";
	content = content + "				<th class=\"text-center\"><a href=\"javascript: lastSchedule();\"><span class=\"glyphicon glyphicon-chevron-left\"></span></a>";
	content = content + "				</th>";
	content = content + "				<th class=\"text-center\" colspan=\"5\">" + o_screen.month(this.m_first_day.getMonth() + 1) + " of " + this.m_first_day.getFullYear() + "</th>";
	content = content + "				<th class=\"text-center\"><a href=\"javascript: nextSchedule();\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>";
	content = content + "				</th>";
	content = content + "			</tr>";
	content = content + "			<tr>";
	content = content + "				<th class=\"text-center\">Sun</th>";
	content = content + "				<th class=\"text-center\">Mon</th>";
	content = content + "				<th class=\"text-center\">Tue</th>";
	content = content + "				<th class=\"text-center\">Wed</th>";
	content = content + "				<th class=\"text-center\">Thu</th>";
	content = content + "				<th class=\"text-center\">Fri</th>";
	content = content + "				<th class=\"text-center\">Sat</th>";
	content = content + "			</tr>";
	content = content + "		</thead>";
	content = content + "		<tbody>";
	
	while (this.c_first_day <= this.c_last_day) {
		content = content + "		<tr>";
		for (i = 0; i < 7; i++) {
			var how_many = 0;
			/* Please, change it as soon as possible */
			var dummy_1 = new Date(this.c_first_day.getTime());
			dummy_1.setHours(0, 0, 0, 0);
			var dummy_2 = new Date(this.c_first_day.getTime());
			dummy_2.setHours(23, 59, 59, 0);

			//content = content + "		<td>";
			for (j = 0; j < a_len; j++) {
				if (this.appointments[j].start >= dummy_1 && dummy_2 >= this.appointments[j].end) {
					how_many++;
				}
			}
			
			this.c_first_day.setHours(0, 0, 0, 0);
			//if (how_many < 12 && this.c_first_day.getTime() >= today.getTime()) {
			if (this.c_first_day.getTime() >= today.getTime()) {
				if (this.c_first_day.getTime() == today.getTime()) {
					content = content + "        <td onClick=\"showDate(" + dummy_1.getTime() + ");\" class=\"date_available today\"><b>" + this.c_first_day.getDate() + "</b></td>";
				}
				else if (this.c_first_day >= this.m_first_day && this.c_first_day <= this.m_last_day) {
					content = content + "        <td onClick=\"showDate(" + dummy_1.getTime() + ");\" class=\"date_available\"><b>" + this.c_first_day.getDate() + "</b></td>";
					//content = content + "		<a href=\"javascript: showDate(" + dummy_1.getTime() + ");\"><b>" + this.c_first_day.getDate() + "</b></a>";	
				}
				else {
					content = content + "        <td onClick=\"showDate(" + dummy_1.getTime() + ");\" class=\"date_available\">" + this.c_first_day.getDate() + "</td>";
					//content = content + "		<a href=\"javascript: showDate(" + dummy_1.getTime() + ");\">" + this.c_first_day.getDate() + "</a>";	
				}
			}
			else if (this.c_first_day.getTime() <= today.getTime()) {
				//content = content + "        <td onClick=\"showDate(" + dummy_1.getTime() + ");\" class=\"past_day\">" + this.c_first_day.getDate() + "</td>";
				content = content + "        <td class=\"past_day\">" + this.c_first_day.getDate() + "</td>";
				//content = content + "		<a href=\"javascript: showDate(" + dummy_1.getTime() + ");\">" + this.c_first_day.getDate() + "</a>";	
			}
			
			//content = content + "		</td>";
			this.c_first_day.setDate(this.c_first_day.getDate() + 1);
		}
		content = content + "		</tr>";
	}

	content = content + "		</tbody>";
	content = content + "	</table>";
	content = content + "</div>";
	$("#schedules_container").html(content);
	
};

/* Weekly */

function Weekly(appointments, m_first_day, m_last_day, c_first_day, c_last_day) {
	//Screens.call(this);
	this.appointments = appointments;
	this.m_first_day = m_first_day;
	this.m_last_day = m_last_day;
	this.c_first_day = c_first_day;
	this.c_last_day = c_last_day;
}

//Weekly.prototype = Object.create(Screen.prototype);

Weekly.prototype.print = function() {
	var o_screen = new Screens();
	var content = "";
	var a_len = this.appointments.length;
	var today = new Date();
	var i, j, k, l;

	var c_date = new Date(this.c_first_day.getTime());
	
	content = content + "<div class=\"table-responsive\">";
	
	//content = content + "<div style=\"overflow: scroll; overflow-y: scroll; overflow-x: hidden;\">";
	
	content = content + "	<table class=\"table table-hover text-center table-bordered\">";
	content = content + "		<thead>";
	content = content + "			<tr>";
	content = content + "				<th class=\"text-center\" style=\"width: 12.5%;\"><a href=\"javascript: lastSchedule();\"><span class=\"glyphicon glyphicon-chevron-left\"></span></a>";
	content = content + "				</th>";
	content = content + "				<th class=\"text-center\" colspan=\"6\">";
	content = content + "				" + c_date.getDate() + " " + o_screen.month_short(c_date.getMonth() + 1) + " - " + this.c_last_day.getDate() + " " + o_screen.month_short(this.c_last_day.getMonth() + 1);
	content = content + "				</th>";
	content = content + "				<th style=\"width: 12.5%;\" class=\"text-center\"><a href=\"javascript: nextSchedule();\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>";
	content = content + "				</th>";
	content = content + "			</tr>";
	content = content + "			<tr>";
	content = content + "				<th style=\"width: 12.5%;\">";
	content = content + "				</th>";
	for (i = 0; i < 7; i++) {
		content = content + "		<th class=\"text-center\" style=\"width: 12.5%;\">" + o_screen.weekday_short(c_date.getDay());
		content = content + "			<br>" + c_date.getDate() + " " + o_screen.month_short(c_date.getMonth() + 1);
		content = content + "		</th>";
		c_date.setDate(c_date.getDate() + 1);
	}
	
	content = content + "			</tr>";
	content = content + "		</thead>";
	//content = content + "  </table>";
	
	//content = content + "</div>";
	
	//content = content + "<div style=\"overflow: scroll; overflow-y: auto; overflow-x: hidden; max-height: 50vh; border-bottom: 1.0px solid #CCC\">";
	
	//content = content + "	<table class=\"table table-striped table-hover text-center table-bordered\">";
	
	
	content = content + "		<tbody>";
	
	for (i = 6; i < 21; i++) {
		for (j = 0; j < 60; j = j + 30) {
			var label = [];
			var time_start = new Date();
			var time_end = new Date();
			var time_next = new Date();

			var cur_day =  new Date(this.c_first_day.getTime());
			for (k = 0; k < 7; k++) {
				var has_event = false;
				var useless = false;
				time_start = new Date(cur_day.getTime());
				time_end = new Date(cur_day.getTime());
				time_next = new Date(cur_day.getTime());
				time_start.setHours(i, j, 0, 0);
				time_end.setHours(i, j + 30, 0, 0);
				time_next.setHours(i, j + 60, 0, 0);
				for (l = 0; l < a_len; l++) {
					if ((this.appointments[l].start <= time_start && this.appointments[l].end >= time_end) ||
						(this.appointments[l].start >= time_start && this.appointments[l].start <= time_end) ||
						(this.appointments[l].end >= time_start && this.appointments[l].end <= time_end)) {
						has_event = true;
						l = a_len;
					}
					else if(this.appointments[l].start >= time_start && this.appointments[l].start >= time_end && this.appointments[l].start <= time_next) {
						useless = true;
					}
				}
				
				if (!has_event && !useless && time_start.getTime() > today.getTime()) {
					label.push("date_available");
				}
				else if (has_event && time_start.getTime() < today.getTime()) {
					label.push("date_unavailable past_day_white");
				}
				else if (has_event) {
					label.push("date_unavailable");
				}
				else if(useless && time_start.getTime() > today.getTime()) {
					label.push("date_useless");	
				}
				else {
					label.push("past_day_white");	
				}
				cur_day.setDate(cur_day.getDate() + 1);
			}

			content = content + "		<tr>";
			if (j == 0 || j  == 0) {
				content = content + "		<td rowspan=\"2\" style=\"width: 12.5%;\" class=\"active\">";
				content = content + "			" + (i < 10 ? "0" + i : i) + ":" + (j < 10 ? "0" + j : j);
				content = content + "		</td>";
			}

			cur_day =  new Date(this.c_first_day.getTime());
			for (k = 0; k < 7; k++) {
				time_start = new Date(cur_day.getTime());
				time_end = new Date(cur_day.getTime());
				time_start.setHours(i, j, 0, 0);
				time_end.setHours(i, j + 15, 0, 0);
				var onClick = "";
				if (label[k] == "date_available") {
					onClick = "onClick=\"$('#appointment_type').val(-1);requestAppointment(" + time_start.getTime() + ")\"";
				}
				
				var time_id = [];
				time_id.push(cur_day.getUTCFullYear());
        time_id.push(cur_day.getUTCMonth() + 1 > 9 ? cur_day.getUTCMonth() + 1 : '0' + (cur_day.getUTCMonth() + 1).toString());
        time_id.push(cur_day.getUTCDate() > 9 ? cur_day.getUTCDate() : '0' + (cur_day.getUTCDate()).toString());
        time_id.push(k.toString());
				
				
				content = content + "			<td  style=\"width: 12.5%;\" id=\"" + time_id.join("_") + "_" + (i < 10 ? "0" + i : i) + "_" + (j < 10 ? "0" + j : j) + "\" " + onClick + " class=\"" + label[k] + "\">";
				content = content + "				";
				content = content + "			</td>";
				cur_day.setDate(cur_day.getDate() + 1);
			}

			content = content + "		</tr>";
		}
	}
	//content = content + "			</tr>";
	content = content + "		</tbody>";
	content = content + "	</table>";
	
	//content = content + "</div>";
	
	content = content + "</div>";
	
	// invalid not available slots
	invalidNotAvailableSlots();
	$("#schedules_container").html(content);	
};

/**
 * this function invalid the time slots where the provider is not available
 * 
 * @params: it is going to access global variables
 * 
 * @author: Thiago Melo (not proud of that)
 * @version: 2015-03-22
 * 
 */
var invalidNotAvailableSlots = function() {
	var provider_id = $("#c_provider_id").val();
	if (provider_id != "0") {
		
		var year = m_current_date.getFullYear();
		var week = getWeekNumber(m_current_date)[1];
		
		var first_day = firstDayOfWeek(year, week);
	  var last_day = new Date(first_day.getTime());
	  last_day.setDate(last_day.getDate() + 6);
	  
		
		$.ajax({
  		type: 'GET',
  		url: '/provider_time_availability',
  		dataType: "json",
  		data: {
  			'provider_id': provider_id,
  			'start': first_day.getTime(),
				'end': last_day.getTime()
  		},
  		success: function(data) {
  			if (data.status == "success") {

  				var i, j;
				  for (i = 6; i <= 20; i++) {
				  	var other_day = new Date(first_day.getTime());
				    for (j = 0; j < 7; j++) {
							var time_id = [];
	            time_id.push(other_day.getUTCFullYear());
	            time_id.push(other_day.getUTCMonth() + 1 > 9 ? other_day.getUTCMonth() + 1 : '0' + (other_day.getUTCMonth() + 1).toString());
	            time_id.push(other_day.getUTCDate() > 9 ? other_day.getUTCDate() : '0' + (other_day.getUTCDate()).toString());
	            time_id.push(j.toString());
	            time_id.push((i > 9 ? '' : '0') + i.toString());
	            var cell_id_1 = time_id.join('_') + '_00';
	            var cell_id_2 = time_id.join('_') + '_30';		    	
				    	var available_1 = true;
				      var available_2 = true;
				      
				      $.each(data.slots_unavailable, function(index, slot) {
						  	if (slot.timeid == cell_id_1) {
						  		available_1 = false;
						  	}
						  	else if (slot.timeid == cell_id_2) {
						  		available_2 = false;
						  	}
						  });
						  
				      if (!available_1) {
				      	$("#" + cell_id_1).removeClass("date_available").addClass("date_unavailable").attr('onclick','').unbind('click');
				      }
				      if (!available_2) {
				      	$("#" + cell_id_2).removeClass("date_available").addClass("date_unavailable").attr('onclick','').unbind('click');
				      }
				      other_day.setDate(other_day.getDate() + 1);
				    }
				  }
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
	}
};

/* Daily */

function Daily(appointments, m_first_day, m_last_day, c_first_day, c_last_day) {
	this.appointments = appointments;
	this.m_first_day = m_first_day;
	this.m_last_day = m_last_day;
	this.c_first_day = c_first_day;
	this.c_last_day = c_last_day;
}

Daily.prototype.print = function() {
	var o_screen = new Screens();
	var content = "";
	var c_date = new Date(this.c_first_day.getFullYear(), this.c_first_day.getMonth(), this.c_first_day.getDate());
	
	content = content + "<div class=\"table-responsive\">";
	content = content + "	<table class=\"table table-striped table-hover text-center\">";
	content = content + "		<thead>";
	content = content + "			<tr>";
	content = content + "				<th class=\"text-center\"><a href=\"javascript: lastSchedule();\"><span class=\"glyphicon glyphicon-chevron-left\"></span></a>";
	content = content + "				</th>";
	content = content + "				<th class=\"text-center\" colspan=\"5\">" + c_date.getDate() + " de " + o_screen.month(c_date.getMonth() + 1) + " de " + c_date.getFullYear() + "</th>";
	content = content + "				<th class=\"text-center\"><a href=\"javascript: nextSchedule();\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>";
	content = content + "				</th>";
	content = content + "			</tr>";
	content = content + "		</thead>";
	content = content + "		<tbody>";
	
	for (var i = 6; i < 22; i++) {
		content = content + "		<tr>";
		content = content + "			<td colspan=\"2\">";
		content = content + "				" + (i < 10 ? "0" + i : i) + ":00";
		content = content + "			</td>";
		content = content + "			<td colspan=\"4\">";
		content = content + "				";
		content = content + "			</td>";
		content = content + "			<td>";
		content = content + "				";
		content = content + "			</td>";
		content = content + "		</tr>";
		content = content + "		<tr>";
		content = content + "			<td colspan=\"2\">";
		content = content + "				" + (i < 10 ? "0" + i : i) + ":30";
		content = content + "			</td>";
		content = content + "			<td colspan=\"4\">";
		content = content + "				";
		content = content + "			</td>";
		content = content + "			<td>";
		content = content + "				";
		content = content + "			</td>";
		content = content + "		</tr>";
	}
	
	content = content + "		</tbody>";
	content = content + "	</table>";
	content = content + "</div>";
	$("#schedules_container").html(content);	
};

/* working */

var m_current_date;
var o_schedule = new Schedule();
var request_option = "signup";
var m_is_admin = false;

var loadSchedule = function() {
	if ($("#is_admin").val() == "1") {
		m_is_admin = true;
	}
	m_current_date = m_current_date === undefined ? new Date() : m_current_date;
	var provider_id = $("#c_provider_id").val();
	var periodicity = parseInt($("input[name=periodicity]:checked", "#schedules_periodicity").val(), 10);
	switch (periodicity) {
		case 1:
			$("#periodicity_options").hide();
			o_schedule.monthly(provider_id, m_current_date);
			break;
		case 2:
			$("#periodicity_options").show();
			o_schedule.weekly(provider_id, m_current_date);
			break;
		case 3:
			o_schedule.daily(provider_id, m_current_date);
			break;
	}
};

var nextSchedule = function() {
	var provider_id = $("#c_provider_id").val();
	var periodicity = parseInt($("input[name=periodicity]:checked", "#schedules_periodicity").val(), 10);
	switch (periodicity) {
		case 1:
			m_current_date.setMonth(m_current_date.getMonth() + 1);
			o_schedule.monthly(provider_id, m_current_date);
			break;
		case 2:
			//console.log(m_current_date);
			m_current_date.setDate(m_current_date.getDate() + 7);
			//console.log(m_current_date);
			o_schedule.weekly(provider_id, m_current_date);
			break;
		case 3:
			m_current_date.setDate(m_current_date.getDate() + 1);
			o_schedule.daily(provider_id, m_current_date);
			break;
	}
};

var lastSchedule = function() {
	var provider_id = $("#c_provider_id").val();
	var periodicity = parseInt($("input[name=periodicity]:checked", "#schedules_periodicity").val(), 10);
	switch (periodicity) {
		case 1:
			m_current_date.setMonth(m_current_date.getMonth() - 1);
			o_schedule.monthly(provider_id, m_current_date);
			break;
		case 2:
			m_current_date.setDate(m_current_date.getDate() - 7);
			o_schedule.weekly(provider_id, m_current_date);
			break;
		case 3:
			m_current_date.setDate(m_current_date.getDate() - 1);
			o_schedule.daily(provider_id, m_current_date);
			break;
	}
};

var showDate = function(date) {
	m_current_date = new Date(date);
	$('#p_weekly').attr('checked',true);
	loadSchedule();
};

var appointment_types = [];
appointment_types[0] = "Pregnancy Massage";
appointment_types[1] = "Lactation Consultation";
appointment_types[2] = "Birth Doula Consultation";
appointment_types[3] = "PostPartum Doula Consultation";
appointment_types[4] = "Follow-up Visit";

var setAppointmentType = function() {
	$.each(appointment_types, function(index, type) {
		if ($("#appointment_type_" + index).is(":checked")) {
			$("#appointment_type").val(index);
		}
	});
};

var requestAppointment = function(datetime) {
	var q_screens = new Screens();
	var content = "";
	var today = new Date();
	var appointment_type = $("#appointment_type").val();
	
	m_current_date = new Date(datetime);
	
	$("#schedules_title").html("Appointment requesting");

	if (m_current_date.getTime() < today.getTime()) {
		content = content + "        <div class=\"row margin-bottom-30\">";
		content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
		content = content + "                <div class=\"headline\"><h2>Invalid date</h2></div>";
		content = content + "                <p class=\"lead\">This date in valid, please, try another one.<p>";
		content = content + "           </div>";
		content = content + "        </div>";
		$("#schedules_modal_action").html("Close Frame");
		$("#schedules_modal_action").attr("data-dismiss", "modal");
	}
	else if ($("#appointment_type").val() == -1) {
		appointment_type = 0;
		$("#appointment_type").val(0);
		var appointment_types_options = $("<div/>");
		
		$.each(appointment_types, function(index, type) {
			appointment_types_options.append(
				$("<p/>").append(
					$("<label/>").append(
						$("<input/>").prop("type", "radio").prop("id", "appointment_type_" + index).prop("name", "appointment_type_chosen").change(function() {
							setAppointmentType();
						}).attr("checked", appointment_type == index || (appointment_type == -1 && index == 0))
					).append(" " + type)
				)
			);
		});
		
		content = $("<div/>").addClass("row").append(
			$("<div/>").addClass("col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1").append(
				$("<div/>").addClass("headline").append(
					$("<h2/>").append("Booking type")
				)
			).append($("<p/>").append("Please choose the booking type:")).append(appointment_types_options)
		);
		
		$("#c_client_info_filled").val(0);
		$("#schedules_modal_action").html("Continue");
		$("#schedules_modal_action").attr("href", "javascript: requestAppointment(" + datetime + ");");
	}
	else if ($("#c_client_id").val() == "0" && $("#c_client_complete").val() == "0" && m_is_admin) {
		buildNonClientVersion(datetime);
		return;
	}
	else if ($("#c_client_id").val() != "0" && ($("#c_client_complete").val() == "0" || $("#c_client_info_filled").val() == "0")) {
		
		content = content + "        <div class=\"row margin-bottom-30\">";
		content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
		content = content + "                <div class=\"headline\"><h2>Confirm personal information</h2></div>";
		content = content + "                <p class=\"lead\">Please confirm your personal information in order to continue:<p>";
		content = content + "                <form action=\"request_appointment_confirm_info\" method=\"post\">";
		
		
		if ($("#c_client_first_name").val() == "" || $("#c_client_last_name").val() == "") {
			content = content + "                    <div class=\"row margin-bottom-20\">";
			content = content + "                        <div class=\"col-md-5 col-md-offset-1\">";
			content = content + "                            <label for=\"first_name\">First name <i class=\"fa fa-asterisk\"></i></label>"; 
			content = content + "                            <input type=\"text\" name=\"client[first_name]\" id=\"first_name\" class=\"form-control\" placeholder=\"First name\" value=\"" + $("#c_client_first_name").val() + "\" required>";
			content = content + "                        </div>";
			content = content + "                        <div class=\"col-md-5 col-md-offset-0\">";
			content = content + "                            <label for=\"last_name\">Last name <i class=\"fa fa-asterisk\"></i></label>";
			content = content + "                            <input type=\"text\" name=\"client[last_name]\" id=\"last_name\" class=\"form-control\" placeholder=\"Last name\" value=\"" + $("#c_client_last_name").val() + "\" required>";
			content = content + "                        </div>";
			content = content + "                    </div>";	
		}
		else {
			content = content + "                    <div class=\"row margin-bottom-20\">";
			content = content + "                        <div class=\"col-md-5 col-md-offset-1\">";
			content = content + "                            <label for=\"first_name\">First name <i class=\"fa fa-asterisk\"></i></label>"; 
			content = content + "                            <input type=\"text\" name=\"client[first_name]\" id=\"first_name\" class=\"form-control\" placeholder=\"First name\" value=\"" + $("#c_client_first_name").val() + "\" disabled required>";
			content = content + "                        </div>";
			content = content + "                        <div class=\"col-md-5 col-md-offset-0\">";
			content = content + "                            <label for=\"last_name\">Last name <i class=\"fa fa-asterisk\"></i></label>";
			content = content + "                            <input type=\"text\" name=\"client[last_name]\" id=\"last_name\" class=\"form-control\" placeholder=\"Last name\" value=\"" + $("#c_client_last_name").val() + "\" disabled required>";
			content = content + "                        </div>";
			content = content + "                    </div>";	
		}
		
		
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                            <label for=\"address\">Address <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"client[address]\" id=\"address\" class=\"form-control\" placeholder=\"Address\" value=\"" + $("#c_client_address").val() + "\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "												 <div class=\"col-md-5 col-md-offset-1\">";
		content = content + "                            <label for=\"phone\">Phone <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"client[phone]\" id=\"phone\" class=\"form-control\" data-mask=\"(999) 999-9999\" placeholder=\"Phone\" value=\"" + $("#c_client_phone").val() + "\" required>";
		content = content + "                        </div>";
		content = content + "                        <div class=\"col-md-5\">";
		content = content + "                            <label for=\"weeks_pregnant\">Weeks pregnant <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"client[weeks_pregnant]\" id=\"weeks_pregnant\" class=\"form-control\" placeholder=\"Weeks pregnant\" value=\"" + $("#c_client_weeks_pregnant").val() + "\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "									</form>";
		content = content + "           </div>";
		content = content + "        </div>";

		$("#schedules_modal_action").html("Confirm Info");
		$("#schedules_modal_action").attr("href", "javascript: updateInfo(" + datetime + ");");
	}
	else if ($("#c_client_id").val() != "0") {
		$("#schedules_title").html("<h3>Booking Confirmation</h3>");
		content = content + "        <div class=\"row margin-bottom-30\">";
		content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
		content = content + "  					<p class=\"lead\">You are about to book an appointment with  " + $("#c_provider_first_name").val() + " " + $("#c_provider_last_name").val() + ".<p>";
		content = content + "       		   <p><strong>Date & Time:</strong> " +  m_current_date.getHours() + ":" + ("0" + m_current_date.getMinutes()).slice(-2) + (m_current_date.getHours() < 12 ? " AM" : " PM") + " on " + q_screens.month(m_current_date.getMonth() + 1) + " " + m_current_date.getDate() + "th, " + m_current_date.getFullYear() +" </p>";
		content = content + "           	   <p><strong>Location:</strong> " +  $("#c_client_address").val() + "</p>";	
		content = content + "                <form action=\"request_appointment\" method=\"post\">";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-12 col-md-offset-0\">";
		content = content + "                            <textarea name=\"client_observation\" id=\"client_observation\" rows=4 class=\"form-control\" placeholder=\"Don't forget to mention your special requests to " + $("#c_provider_first_name").val() + "\"></textarea>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "               </form>";
		content = content + "           </div>";
		content = content + "        </div>";

		$("#schedules_modal_action").html("Confirm");
		$("#schedules_modal_action").attr("href", "javascript: sendRequest(" + datetime + ");");
	}
	else if ($("#c_client_id").val() == "0" && request_option == "signin") {
		content = content + "        <div class=\"row margin-bottom-30\">";
		content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
		content = content + "               <div class=\"alert alert-info\" role=\"alert\"><span class=\"glyphicon glyphicon-hand-right\"></span> <strong>Booking for: </strong> " + m_current_date.getHours() + "h" + ("0" + m_current_date.getMinutes()).slice(-2) + (m_current_date.getHours() < 12 ? " (am)" : "") + " on " + q_screens.month(m_current_date.getMonth() + 1) + " " + m_current_date.getDate() + "th, " + m_current_date.getFullYear();
		content = content + "                   <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
		content = content + "               </div>";
		content = content + "            	<div class=\"headline\"><h2>Sign In</h2></div>";
		content = content + "                <form action=\"request_appointment_signin\" method=\"post\">";
		content = content + "										<div class=\"row margin-bottom-20\">";
		content = content + "                    	 <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                           <span class=\"pull-right\">Haven't you already registered? <a href=\"javascript: signInUp('signup', " + datetime + ");\" >Sign Up</a></span>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                            <label for=\"email\">Email</label>";
		content = content + "                            <input type=\"text\" name=\"email\" id=\"email\" class=\"form-control\" placeholder=\"Email\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                            <label for=\"password\">Password</label>";
		content = content + "                            <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" placeholder=\"Password\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		
		content = content + "										<div class=\"row\">";
		content = content + "                    	 <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                           <a href=\"javascript: window.open('/password_recovery');\">Forgot your password?</a>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		
		content = content + "								</form>";
		content = content + "            </div>";
		content = content + "        </div>";

		$("#schedules_modal_action").html("Sign In");
		$("#schedules_modal_action").attr("href", "javascript: signin(" + datetime + ");");
	}
	else if ($("#c_client_id").val() == "0" && request_option == "signup") {
		content = content + "        <div class=\"row margin-bottom-30\">";
		content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
		content = content + "               <div class=\"alert alert-info\" role=\"alert\"><span class=\"glyphicon glyphicon-hand-right\"></span> <strong>Booking for: </strong> " + m_current_date.getHours() + "h" + ("0" + m_current_date.getMinutes()).slice(-2) + (m_current_date.getHours() < 12 ? " (am)" : "") + " on " + q_screens.month(m_current_date.getMonth() + 1) + " " + m_current_date.getDate() + "th, " + m_current_date.getFullYear();
		content = content + "                   <button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
		content = content + "               </div>";
		content = content + "            	<div class=\"headline\"><h2>Sign Up</h2></div>";
		content = content + "                <form action=\"request_appointment_signup\" method=\"post\">";
		
			
		content = content + "					<div class=\"row margin-bottom-20\">";
		content = content + "                    	 <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                           <span class=\"pull-right\">Have you already registered? <a href=\"javascript: signInUp('signin', " + datetime + ");\" >Sign In</a></span>";
		content = content + "                        </div>";
		content = content + "                    </div>";


		content = content + "					<div class=\"row margin-bottom-20\">";
		content = content + "						<div class=\"col-md-5 col-md-offset-1\">";
		content = content + "                            <label for=\"first_name\">First name <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"first_name\" id=\"first_name\" class=\"form-control\" placeholder=\"First name\" required>";
		content = content + "                        </div>";
		content = content + "                        <div class=\"col-md-5\">";
		content = content + "                            <label for=\"last_name\">Last name<i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"last_name\" id=\"last_name\" class=\"form-control\" placeholder=\"Last name\" required>";
		content = content + "                        </div>";
		content = content + "         </div>";
		
		
		content = content + "					<div class=\"row margin-bottom-20\">";
		content = content + "                    	<div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                            <label for=\"email\">Email <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"email\" id=\"email\" class=\"form-control\" placeholder=\"Email\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-10 col-md-offset-1\">";
		content = content + "                            <label for=\"address\">Address <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"address\" id=\"address\" class=\"form-control\" placeholder=\"Address\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "						<div class=\"col-md-5 col-md-offset-1\">";
		content = content + "                            <label for=\"phone\">Phone <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"phone\" id=\"phone\" class=\"form-control\" data-mask=\"(999) 999-9999\" placeholder=\"Phone\" required>";
		content = content + "                        </div>";
		content = content + "                        ";
		content = content + "                        <div class=\"col-md-5\">";
		content = content + "                            <label for=\"weeks_pregnant\">Weeks pregnant <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"text\" name=\"weeks_pregnant\" id=\"weeks_pregnant\" class=\"form-control\" placeholder=\"Weeks pregnant\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "                    <div class=\"row margin-bottom-20\">";
		content = content + "                        <div class=\"col-md-5 col-md-offset-1\">";
		content = content + "                            <label for=\"password\">Password <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"password\" name=\"password\" id=\"password\" class=\"form-control\" placeholder=\"Password\" required>";
		content = content + "                        </div>";
		content = content + "                        <div class=\"col-md-5\">";
		content = content + "                            <label for=\"password_confirmation\">Password confirmation <i class=\"fa fa-asterisk\"></i></label>";
		content = content + "                            <input type=\"password\" name=\"password_confirmation\" id=\"password_confirmation\" class=\"form-control\" placeholder=\"Password confirmation\" required>";
		content = content + "                        </div>";
		content = content + "                    </div>";
		content = content + "				</form>";
		content = content + "            </div>";
		content = content + "        </div>";

		$("#schedules_modal_action").html("Create my account");
		$("#schedules_modal_action").attr("href", "javascript: signup(" + datetime + ");");
	}
	
	$("#schedules_modal_action").blur();
	$("#schedulse_modal_content").html(content);
	$('#schedules_modal').modal('show');
};

var requestAppointmentPOG = function(datetime) {
	var q_screens = new Screens();
	var content = "";
	
	m_current_date = new Date(datetime);
	
	$("#schedules_title").html("Appointment requesting");

	$("#schedules_title").html("<h3>Booking Confirmation</h3>");
	content = content + "        <div class=\"row margin-bottom-30\">";
	content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
	content = content + "  					<p class=\"lead\">You are about to book an appointment with  " + $("#c_provider_first_name").val() + " " + $("#c_provider_last_name").val() + ".<p>";
	content = content + "       		   <p><strong>Date & Time:</strong> " +  m_current_date.getHours() + ":" + ("0" + m_current_date.getMinutes()).slice(-2) + (m_current_date.getHours() < 12 ? " AM" : " PM") + " on " + q_screens.month(m_current_date.getMonth() + 1) + " " + m_current_date.getDate() + "th, " + m_current_date.getFullYear() +" </p>";
	content = content + "           	   <p><strong>Location:</strong> " +  $("#c_client_address").val() + "</p>";	
	content = content + "                <form action=\"request_appointment\" method=\"post\">";
	content = content + "                    <div class=\"row margin-bottom-20\">";
	content = content + "                        <div class=\"col-md-12 col-md-offset-0\">";
	content = content + "                            <textarea name=\"client_observation\" id=\"client_observation\" rows=4 class=\"form-control\" placeholder=\"Don't forget to mention your special requests to " + $("#c_provider_first_name").val() + "\"></textarea>";
	content = content + "                        </div>";
	content = content + "                    </div>";
	content = content + "               </form>";
	content = content + "           </div>";
	content = content + "        </div>";

	$("#schedules_modal_action").html("Confirm");
	$("#schedules_modal_action").attr("href", "javascript: sendRequest(" + datetime + ");");
	$("#schedules_modal_action").blur();
	$("#schedulse_modal_content").html(content);
	$('#schedules_modal').modal('show');
};

var signInUp = function(option, date) {
	request_option = option;
	requestAppointment(date);
};

var signin = function(date) {
	clearMessage("schedules_alert");

	if (!validateEmail($("#email").val())) {
		alertMessage("schedules_alert", "Email invalid.", "danger", false);
		$("#email").focus();
			return;
	}
	if (!validatePassword($("#password").val())) {
		alertMessage("schedules_alert", "Password empty.", "danger", false);
		$("#password").focus();
		return;
	}

	$.ajax({
		type: 'GET',
		url: '/csignin_ajax',
		dataType: "json",
		data: { 
			'email': $("#email").val(),
			'password': $("#password").val()
		},
		success: function(data) {
			if (data.status == "success") {
				
				console.log(data);
				$("#c_client_id").val(data.client.id);
				$("#c_client_first_name").val(data.client.first_name);
				$("#c_client_last_name").val(data.client.last_name);
				$("#c_client_address").val(data.client.address);
				$("#c_client_phone").val(data.client.phone);
				$("#c_client_weeks_pregnant").val(data.client.weeks_pregnant);
				
				clearMessages();
				changeNavLinksSignedIn(data.client.profile);
				requestAppointment(date);
			}
			else if (data.status == "fail") {
				$("#password").val("");
				alertMessage("schedules_alert", "Fail sign in, please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("schedules_alert", "Please contact us directly.", "danger", false);
		}
	});
};

var working_on_signup = false;
var signup = function(date) {
	if (!working_on_signup) {
		clearMessage("schedules_alert");
	
		if (!validateName($("#first_name").val()) || validAnyNumber($("#first_name").val())) {
			alertMessage("schedules_alert", "First name empty.", "danger", false);
			$("#first_name").focus();
			return;
		}
	
		if (!validateName($("#last_name").val()) || validAnyNumber($("#last_name").val())) {
			alertMessage("schedules_alert", "Last name empty.", "danger", false);
			$("#last_name").focus();
			return;
		}
	
		if (!validateEmail($("#email").val())) {
			alertMessage("schedules_alert", "Email invalid.", "danger", false);
			$("#email").focus();
			return;
		}
	
		if (!validatePhone($("#phone").val())) {
			alertMessage("schedules_alert", "Phone invalid.", "danger", false);
			$("#phone").focus();
			return;
		}
	
		if (!validateAddress($("#address").val())) {
			alertMessage("schedules_alert", "Address empty.", "danger", false);
			$("#address").focus();
			return;
		}
	
		if (!validateWeeksPregnant($("#weeks_pregnant").val())) {
			alertMessage("schedules_alert", "Invalid number of weeks pregnant.", "danger", false);
			$("#weeks_pregnant").focus();
			return;
		}
		
		if (!validatePassword($("#password").val())) {
			alertMessage("schedules_alert", "Password empty.", "danger", false);
			$("#password").focus();
			return;
		}
	
		if (!validatePassword($("#password_confirmation").val())) {
			alertMessage("schedules_alert", "Password confirmation empty.", "danger", false);
			$("#password_confirmation").focus();
			return;
		}
	
		if ($("#password").val() != $("#password_confirmation").val()) {
			$("#password").val("");
			$("#password_confirmation").val("");
			alertMessage("schedules_alert", "Passwords don't match.", "danger", false);
			$("#password").focus();
			return;
		}
	
		if ($("#password").val().length < 6) {
			$("#password").val("");
			$("#password_confirmation").val("");
			alertMessage("schedules_alert", "Password too short (minimum 6 digits).", "danger", false);
			$("#password").focus();
			return;
		}
	
		working_on_signup = true;
		$("#schedules_modal_action").html("<i class=\"fa fa-cog fa-spin\"></i> Processing");
		$("#schedules_modal_action").blur();
		$.ajax({
			type: 'GET',
			url: '/csignup_ajax',
			dataType: "json",
			data: { 
				'email': $("#email").val(),
				'client[first_name]': $("#first_name").val(),
				'client[last_name]': $("#last_name").val(),
				'client[email]': $("#email").val(),
				'client[password]': $("#password").val(),
				'client[password_confirmation]': $("#password_confirmation").val(),
				'client[phone]': $("#phone").val(),
				'client[address]': $("#address").val(),
				'client[weeks_pregnant]': $("#weeks_pregnant").val()
			},
			success: function(data) {
				if (data.status == "success") {
					
					//$("#c_client_id").val(data.client.id);
					//$("#c_client_first_name").val(data.client.first_name);
					//$("#c_client_last_name").val(data.client.last_name);
					//$("#c_client_address").val(data.client.address);
					//$("#c_client_phone").val(data.client.phone);
					//$("#c_client_weeks_pregnant").val(data.client.weeks_pregnant);
					clearMessages();
					//changeNavLinksSignedIn(data.client.profile);
					
					//requestAppointment(date);
					working_on_signup = false;
					signInUp("signin", date);
					alertMessage("schedules_alert", "Welcome to CareForMe! Please check your email to proced.", "success", false);
				}
				else if (data.status == "email_exists") {
					$("#password").val("");
					$("#password_confirmation").val("");
					alertMessage("schedules_alert", "Email already registered. <a href=\"javascript: window.open('/password_recovery');\">Forgot your password?</a>", "warning", false);
					working_on_signup = false;
				}
				else if (data.status == "fail") {
					$("#password").val("");
					$("#password_confirmation").val("");
					alertMessage("schedules_alert", "Fail sign in, please try again.", "warning", false);
					working_on_signup = false;
				}
			},
			error: function(data) {
				console.log("error");
				console.log(data);
				alertMessage("schedules_alert", "Please contact us directly.", "danger", false);
				working_on_signup = false;
			}
		});
	}
};


var updateInfo = function(date) {
	clearMessage("schedules_alert");

	if (!validNotEmpty($("#first_name").val()) || validAnyNumber($("#first_name").val())) {
		alertMessage("schedules_alert", "First name invalid.", "warning", false);
		$("#first_name").focus();
		return;
	}

	if (!validNotEmpty($("#last_name").val()) || validAnyNumber($("#last_name").val())) {
		alertMessage("schedules_alert", "Last name invalid.", "warning", false);
		$("#last_name").focus();
		return;
	}
	
	if (!validateAddress($("#address").val())) {
		alertMessage("schedules_alert", "Address empty.", "warning", false);
		$("#address").focus();
		return;
	}
	
	if (!validatePhone($("#phone").val())) {
		alertMessage("schedules_alert", "Phone invalid.", "warning", false);
		$("#phone").focus();
		return;
	}

	if (!validateWeeksPregnant($("#weeks_pregnant").val())) {
		alertMessage("schedules_alert", "Invalid number of weeks pregnant.", "warning", false);
		$("#weeks_pregnant").focus();
		return;
	}

	$.ajax({
		type: 'GET',
		url: '/update_info_ajax',
		dataType: "json",
		data: { 
			'client[first_name]': $("#first_name").val(),
			'client[last_name]': $("#last_name").val(),
			'client[phone]': $("#phone").val(),
			'client[address]': $("#address").val(),
			'client[weeks_pregnant]': $("#weeks_pregnant").val()
		},
		success: function(data) {
			if (data.status == "success") {
				$("#c_client_id").val(data.client.id);
				$("#c_client_first_name").val(data.client.first_name);
				$("#c_client_last_name").val(data.client.last_name);
				$("#c_client_address").val(data.client.address);
				clearMessages();
				requestAppointmentPOG(date);
			}
			else if (data.status == "fail") {
				alertMessage("schedules_alert", "Fail to update info, please try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("schedules_alert", "Please contact us directly.", "danger", false);
		}
	});
};

var working_on_request = false;

var sendRequest = function(date) {
	if (!working_on_request) {
		$("#schedules_modal_action").html("<i class=\"fa fa-cog fa-spin\"></i> Confirm");
		$("#schedules_modal_action").blur();
		working_on_request = true;
		setTimeout(function(){ sendRequestPOG(date); }, 1000);
	}
};

var sendRequestPOG = function(date) {
	m_current_date = new Date(date);
	var MS_PER_MINUTE = 60000;
	var datestart = new Date(date - 20 * MS_PER_MINUTE);
	var dateend = new Date(date + 80 * MS_PER_MINUTE);
	var d_start = datestart.getFullYear() + "-" + ("0" + (datestart.getMonth() + 1)).slice(-2) + "-" + ("0" + datestart.getDate()).slice(-2) + " " + ("0" + datestart.getHours()).slice(-2) + ":" + ("0" + datestart.getMinutes()).slice(-2) + ":00";
	var d_end = dateend.getFullYear() + "-" + ("0" + (dateend.getMonth() + 1)).slice(-2) + "-" + ("0" + dateend.getDate()).slice(-2) + " " + ("0" + dateend.getHours()).slice(-2) + ":" + ("0" + dateend.getMinutes()).slice(-2) + ":00";
	var send_confirmation = $('#send_confirmation').prop('checked');
	$.ajax({
		type: 'GET',
		url: '/request_appointment_ajax',
		dataType: "json",
		data: { 
			'appointment[start]': d_start,
			'appointment[end]': d_end,
			'appointment[provider_id]': $("#c_provider_id").val(),
			'appointment[client_id]': $("#c_client_id").val(),
			'appointment[client_observation]': $("#client_observation").val(),
			'appointment[accepted]': 0,
			'appointment[appointment_type]': $("#appointment_type").val(),
			'send_confirmation': send_confirmation
		},
		success: function(data) {
			if (data.status == "success") {
				$("#schedules_modal").modal("hide");
				$('.modal-backdrop').remove();
				alertMessage("schedules_body_alert", "Thank you for requesting an appointment. You will be contacted within a few hours about a confirmation.", "success", false);
				$('html, body').animate({ scrollTop: $("#schedules_body_alert").offset().top }, 2000);
				
				//$('#p_weekly').attr('checked',true);
				loadSchedule();
			}
			else if (data.status == "fail") {
				alertMessage("schedules_alert", "Fail to update info, please try again.", "warning", false);
			}
			working_on_request = false;
			$("#appointment_type").val(-1);
			$("#c_client_info_filled").val(0);
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("schedules_alert", "Please contact us directly.", "danger", false);
			working_on_request = false;
			$("#appointment_type").val(-1);
		}
	});
}

var buildNonClientVersion = function(datetime) {
	var q_screens = new Screens();
	var content = "";
	m_current_date = new Date(datetime);
	$("#schedules_title").html("Appointment requesting");

	$.ajax({
		type: 'GET',
		url: '/get_clients_ajax',
		dataType: "json",
		success: function(data) {
			if (data.status == "success") {
				console.log(data);
				content = content + "        <div class=\"row margin-bottom-30\">";
				content = content + "            <div class=\"col-md-10 col-md-offset-1 mb-margin-bottom-30\">";
				content = content + "                <div class=\"headline\"><h2>Select the client</h2></div>";
				content = content + "				 <div class=\"row margin-bottom-20\">";
				content = content + "                    <div class=\"col-md-6 col-md-offset-0\">";
				content = content + "                		<select name=\"c_client_id_temp\" id=\"c_client_id_temp\" class=\"form-control\" onchange=\"fetchClientInformation();\">";
				content = content + "                	 		<option value=\"\"></option>";
				$.each(data.clients, function(i, client) {
					content = content + "                		<option value=\"" + client.id + "\">" + client.first_name + " " + client.last_name + "</options>";	
				});
				content = content + "                	 	</select>";
				content = content + "                    </div>";
				content = content + "                    <div class=\"col-md-6 col-md-offset-0 vcenter\">";
				content = content + "                       <span class=\"pull-right\">New client? <a href=\"javascript: \" >Create</a></span>";
				content = content + "                    </div>";
				content = content + "                </div>";
				content = content + "           </div>";
				content = content + "        </div>";

				content = content + "        <div id=\"c_client_information\"></div>";

				$("#schedules_modal_action").html("Create Appointment");
				$("#schedules_modal_action").attr("href", "javascript: ");

				$("#schedulse_modal_content").html(content);
				$('#schedules_modal').modal('show');
			}
			else if (data.status == "fail") {
				alertMessage("schedules_body_alert", "Be cool, don't dismiss Thiago yet.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("schedules_body_alert", "A big problem is going on, dismiss Thiago.", "danger", false);
		}
	});		
};

var adminSubmitRequest = function() {
	
};

var fetchClientInformation = function() {
	var client_id = $("#c_client_id_temp").val();
	if (client_id !== undefined && client_id !== "") {
		var content = "";

		$.ajax({
			type: 'GET',
			url: '/get_client_information_ajax',
			dataType: "json",
			data: {
				'id': client_id
			},
			success: function(data) {
				if (data.status == "success") {
					content = content + "<div class=\"row margin-bottom-20\">";
					content = content + "    <div class=\"col-md-5 col-md-offset-1\">";
					content = content + "        <label for=\"first_name\">First name <i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.first_name + "\" name=\"first_name\" id=\"first_name\" class=\"form-control\" placeholder=\"First name\" required>";
					content = content + "    </div>";
					content = content + "    <div class=\"col-md-5\">";
					content = content + "        <label for=\"last_name\">Last name<i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.last_name + "\" name=\"last_name\" id=\"last_name\" class=\"form-control\" placeholder=\"Last name\" required>";
					content = content + "    </div>";
					content = content + "</div>";
					content = content + "<div class=\"row margin-bottom-20\">";
					content = content + "    <div class=\"col-md-10 col-md-offset-1\">";
					content = content + "        <label for=\"address\">Address <i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.email + "\" name=\"email\" id=\"email\" class=\"form-control\" placeholder=\"Email\" required>";
					content = content + "    </div>";
					content = content + "</div>";
					content = content + "<div class=\"row margin-bottom-20\">";
					content = content + "    <div class=\"col-md-10 col-md-offset-1\">";
					content = content + "        <label for=\"address\">Address <i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.address + "\" name=\"address\" id=\"address\" class=\"form-control\" placeholder=\"Address\" required>";
					content = content + "    </div>";
					content = content + "</div>";
					content = content + "<div class=\"row margin-bottom-20\">";
					content = content + "    <div class=\"col-md-5 col-md-offset-1\">";
					content = content + "        <label for=\"phone\">Phone <i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.phone + "\" name=\"phone\" id=\"phone\" class=\"form-control\" data-mask=\"(999) 999-9999\" placeholder=\"Phone\" required>";
					content = content + "    </div>";
					content = content + "    <div class=\"col-md-5\">";
					content = content + "        <label for=\"weeks_pregnant\">Weeks pregnant <i class=\"fa fa-asterisk\"></i></label>";
					content = content + "        <input type=\"text\" value=\"" + data.client.weeks_pregnant + "\" name=\"weeks_pregnant\" id=\"weeks_pregnant\" class=\"form-control\" placeholder=\"Weeks pregnant\" required>";
					content = content + "    </div>";
					content = content + "</div>";
					$("#c_client_information").html(content);
				}
				else if (data.status == "fail") {
					alertMessage("schedules_alert", "Be cool, don't dismiss Thiago yet.", "warning", false);
				}
			},
			error: function(data) {
				console.log("error");
				console.log(data);
				alertMessage("schedules_alert", "A big problem is going on, dismiss Thiago.", "danger", false);
			}
		});
	}
};

var validateEmail = function(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

var validatePhone = function(phone) { 
    if (phone !== undefined && phone !== "") {
		return true;
	}
    return false;
};

var validatePassword = function(password) {
	if (password !== undefined && password !== "") {
		return true;
	}
    return false;
};

var validateAddress = function(address) {
	if (address !== undefined && address !== "") {
		return true;
	}
    return false;
};

var validateWeeksPregnant = function(weeks_pregnant) {
	var re = /^\d+$/;
	if (weeks_pregnant !== undefined && weeks_pregnant !== "" && re.test(weeks_pregnant)) {
		return true;
	}
    return false;
};

var validateName = function(name) {
	if (name !== undefined && name !== "") {
		return true;
	}
    return false;
};

var changeNavLinksSignedIn = function(profile) {
	var content = "";
	content = content + "<ul class=\"nav navbar-nav\">";
	content = content + "	<li><a href=\"/" + profile + "\"><i class=\"fa fa-home\"></i>&nbsp;Home</a></li>";
	content = content + "    <li><a data-method=\"delete\" href=\"/signout\" rel=\"nofollow\"><i class=\"fa fa-sign-out\"></i>&nbsp;Sign Out</a></li>";
    content = content + "</ul>";
    $("#nav_links").html(content);
};


var current_messages = [];
var alertMessage = function (id, message, type, append) {
	var message_to_show = "";
	var message_call = "";
	var icon = "";
	clearMessages();
	append = append === undefined ? false : append;
	switch (type) {
		case "success":
			message_call = "Success";
			icon = "ok";
			break;
		case "warning":
			message_call = "Warning";
			icon = "warning-sign";
			break;
		case "info":
			message_call = "Info";
			icon = "info-sign";
			break;
		case "danger":
			message_call = "Error";
			icon = "remove";
			break;
		default:
			message_call = "Warning";
			type = "warning";
			icon = "exclamation-sign";
	}
	//message_to_show = message_to_show + "<div class=\"alert alert-" + type + "\" role=\"alert\"><i class=\"fa fa-" + icon + "\"></i> <strong>" + message_call + "!</strong> " + message;
	message_to_show = message_to_show + "<div class=\"alert alert-" + type + "\" role=\"alert\"><strong>" + message_call + "!</strong> " + message;
	message_to_show = message_to_show + "	<button type=\"button\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
	message_to_show = message_to_show + "</div>";
	current_messages.push(id);
	if (append) {
		$("#" + id).append(message_to_show);
	}
	else {
		$("#" + id).html(message_to_show);
	}
	$('html, body').animate({
    	scrollTop: $("#" + id).offset().top - 60
  	}, 500);
};

var clearMessage = function(id) {
	$("#" + id).html("");
	clearMessages();
};

var clearMessages = function() {
	var i = 0;
	for (i = 0; i < current_messages.length; i++) {
		$("#" + current_messages[i]).html("");
	}
	current_messages = [];
};

var get_nth_suffix = function(date) {
   switch (date) {
     case 1:
     case 21:
     case 31:
        return 'st';
     case 2:
     case 22:
        return 'nd';
     case 3:
     case 23:
        return 'rd';
     default:
        return 'th';
   }
 };
 
 /* For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 */
function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7)
    // Return array of year and week number
    return [d.getFullYear(), weekNo];
}