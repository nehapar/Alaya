/*
 * It gets all the information for the selected provider
 * The provider is selected through a checkbox with id [providers_list]
 * Last update: 2015-02-19 by @thiago
 */
var adminShowUpProvider = function() {
  clearMessage("top_page_message");
  var provider_id = $("#providers_list").val();
  cleanUpProvider();
  if (provider_id == "0") {
    return;
  }
  $.ajax({
    type: 'GET',
    url: '/provider_info',
    dataType: "json",
    data: { 
    	'provider_id': provider_id
    },
    success: function(data) {
      if (data.status == "success") {
      	/* picture info begin */
        $("#provider_image_container").hide();
        $("#provider_picture_spin_container").show();
        var image = document.getElementById("provider_main_image");
        image.onload = function() { // always fires the event.
          $("#provider_picture_spin_container").hide();  
          $("#provider_image_container").show();
        };
        image.onerror = function(){
          image.src = "../assets/img/profile_pic/provider_without_picture.png";
        };
        image.src = data.provider.picture_path;
        /* picture info end */
        
        /* personal info begin */
        $("#provider_first_name").val(data.provider.first_name);
        $("#provider_last_name").val(data.provider.last_name);
        $("#provider_expertise").val(data.provider.expertise);
        $("#provider_email").val(data.provider.email);
        $("#provider_phone").val(data.provider.phone);
        $("#provider_abstract").val(data.provider.abstract);
        $("#provider_about").val(data.provider.about);
        $("#provider_admin").prop("checked", data.provider.admin);
        /* personal info end */
        
        /* specialties begin */
        $("#provider_specialty_text").val(data.provider.specialty_text);
				showSpecialties(provider_id);
				/* specialties end */
				
				/* services begin */
        $("#provider_service_text").val(data.provider.service_text);
				showServices(provider_id);
				/* services end */
				
				/* certifications end */
        showCertifications(provider_id);
				/* certifications end */
				
				/* areas end */
        showAreas(provider_id);
				/* areas end */
				
				/* reviews end */
        showReviews(provider_id);
				/* reviews end */
				
				/* policies begin */
        $("#provider_policies").val(data.provider.policies);
        /* policies end */
        
        /* password begin */
        $("#provider_password").val("");
        $("#provider_password_confirmation").val("");
        /* password end */
        
        /* provider schedule begin */
        weekProviderSchedule(data.current_week, data.current_year, provider_id);
        /* provider schedule end */
        
        /* provider active begin */
        $('#provider_active_radio').empty().append(
        	$('<div/>').addClass('btn-group').attr('data-toggle', 'buttons').append(
        		$('<label/>').prop('id', 'provider_active_true').addClass('btn btn-primary ' + (data.provider.active ? 'active' : '')).append(' Active').click(function() {
							$.ajax({
								type: 'GET',
								url: '/toggle_provider_state',
								dataType: "json",
								data: { 
									'provider_id': provider_id,
									'active': 'true'
								},
								success: function(data) {
									if (data.status == "success") {
										$('#provider_active_false').removeClass('active');
										$('#provider_active_true').addClass('active');
									}
									else if (data.status == "fail") {
										alertMessage("top_page_message", "Please, try again.", "warning", false);
									}
								},
								error: function(data) {
									console.log("error");
									console.log(data);
									alertMessage("top_page_message", "Some error happened.", "danger", false);
								}
							});
						})
        	)
        ).append(
        	$('<div/>').addClass('btn-group').attr('data-toggle', 'buttons').append(
        		$('<label/>').prop('id', 'provider_active_false').addClass('btn btn-primary ' + (!data.provider.active ? 'active' : '')).append('Disabled').click(function() {
							$.ajax({
								type: 'GET',
								url: '/toggle_provider_state',
								dataType: "json",
								data: { 
									'provider_id': provider_id,
									'active': 'false'
								},
								success: function(data) {
									if (data.status == "success") {
										$('#provider_active_true').removeClass('active');
										$('#provider_active_false').addClass('active');
									}
									else if (data.status == "fail") {
										alertMessage("top_page_message", "Please, try again.", "warning", false);
									}
								},
								error: function(data) {
									console.log("error");
									console.log(data);
									alertMessage("top_page_message", "Some error happened.", "danger", false);
								}
							});
						})
        	)
        );
        /* provider active end */
        
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Provider not found.", "warning", false);
    	}
    },
    error: function(data) {
      alertMessage("top_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
};

/**
 * if the admin is trying to change the time availability of
 * one provider, so this function is used, basicaly, it substitutes
 * the provider_id for a value in a select, which is the current provider
 * being edited
 * 
 * @params: [provider_id] the provider's id
 *          [cell_id] the time in the shape W_HH_MM, w is the weekday, sunday = 0
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var switchProviderTimeAvailabilityAdmin = function(cell_id) {
  if ($("#providers_list").val() != "0") {
    switchProviderTimeAvailability($("#providers_list").val(), cell_id);
  }
  else {
    clearAvailabilityTable();
  }
};

/**
 * this function clears all the time availability table
 * 
 * @params: there is no params
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var clearAvailabilityTable = function() {
  var i = 0;
  var j = 0;
  for (i = 6; i <= 20; i++) {
    for (j = 0; j < 7; j++) {
      var hour = i >= 10 ? i.toString() : "0" + i.toString();
      var cell_id_1 = j.toString() + "_" + hour + "_00";
      var cell_id_2 = j.toString() + "_" + hour + "_30";
      $("#" + cell_id_1).addClass("schedule-free");
      $("#" + cell_id_1).removeClass("schedule-blocked").removeClass("danger");
      $("#" + cell_id_2).addClass("schedule-free");
      $("#" + cell_id_2).removeClass("schedule-blocked").removeClass("danger");
    }
  }
};

/**
 * this function fills all the time availability table for a provider
 * 
 * please, don't use this in a provider/client perspective
 * 
 * @params: [provider_id] the provider's id
 * 
 * @author: Thiago Melo
 * @version: 2015-03-21
 */
var fillAvailabilityTable = function(provider_id) {
	if (provider_id != "0") {
    $.ajax({
  		type: 'GET',
  		url: '/provider_time_availability',
  		dataType: "json",
  		data: {
  			'provider_id': provider_id
  		},
  		success: function(data) {
  			if (data.status == "success") {
  				$.each(data.slots_unavailable, function(index, slot) {
				  	$("#" + slot.time).removeClass("schedule-free");
	          $("#" + slot.time).addClass("schedule-blocked").addClass("danger");
				  });
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
  else {
    clearAvailabilityTable();
  }
};

/*
 * It saves the provider's specialty text under the admin dashboard
 * this is a single field in providers table
 * the text to be saved is in a text input with id [provider_specialty_text]
 * Last update: 2015-02-19 by @thiago
 */
var saveProviderSpecialtyText = function() {
	var provider_id = $("#providers_list").val();
	if ($("#provider_specialty_text").val() === "" || $("#provider_specialty_text").val() === undefined || provider_id == "0") {
		alertMessage("add_specialty_alert", "Please, type the specialty.", "warning", false);
		$("#provider_specialty_text").focus();
		return;
	}
  $.ajax({
		type: 'GET',
		url: '/update_specialty_text',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'specialty_text': $("#provider_specialty_text").val()
		},
		success: function(data) {
			if (data.status == "success") {
				//enableEditSpecialties();
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

/*
 * It saves the provider's service text under the admin dashboard
 * this is a single field in providers table
 * the text to be saved is in a text input with id [provider_service_text]
 * Last update: 2015-02-19 by @thiago
 */
var saveProviderServiceText = function() {
	var provider_id = $("#providers_list").val();
	if ($("#provider_service_text").val() === "" || $("#provider_service_text").val() === undefined || provider_id == "0") {
		alertMessage("add_service_alert", "Please, type the service.", "warning", false);
		$("#provider_service_text").focus();
		return;
	}
  $.ajax({
		type: 'GET',
		url: '/update_service_text',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'service_text': $("#provider_service_text").val()
		},
		success: function(data) {
			if (data.status == "success") {
				//enableEditServices();
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

/*
 * It saves the provider's policies text under the admin dashboard
 * this is a single field in providers table
 * the text to be saved is in a text input with id [provider_policies]
 * Last update: 2015-02-19 by @thiago
 */
var saveProviderPoliciesText = function() {
	var provider_id = $("#providers_list").val();
	if ($("#provider_policies").val() === "" || $("#provider_policies").val() === undefined || provider_id == "0") {
		alertMessage("add_service_alert", "Please, type the payment & policies text.", "warning", false);
		$("#provider_policies").focus();
		return;
	}
  $.ajax({
		type: 'GET',
		url: '/update_policies_text',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'policies': $("#provider_policies").val()
		},
		success: function(data) {
			if (data.status == "success") {
				//enableEditPolicies();
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

/*
 * When no one client is selected, the fields must remain empty
 * this is most used when the empty option is used in the
 * selectbox is chosen
 * it will basically clear all the fields under provider's tab in the
 * admin dashboard
 * Last update: 2015-02-19 by @thiago
 */
var cleanUpProvider = function() {
  /* picture */
  var image = document.getElementById("provider_main_image");
  image.src = "../assets/img/profile_pic/provider_without_picture.png";
  /* personal */
  $("#provider_first_name").val("");
  $("#provider_last_name").val("");
  $("#provider_expertise").val("");
  $("#provider_email").val("");
  $("#provider_phone").val("");
  $("#provider_abstract").val("");
  $("#provider_about").val("");
  $("#provider_admin").prop("checked", false);
  /* specialties */
  $("#provider_specialty_text").val("");
  $("#specialties_list").html("");
  /* services */
  $("#provider_service_text").val("");
  $("#services_list").html("");
  /* certifications */
  $("#certifications_list").html("");
  /* areas */
  $("#areas_list").html("");
  /* reviews */
  $("#reviews_list").html("");
  /* policies */
  $("#provider_policies").val("");
  /* password */
  $("#provider_password").val("");
  $("#provider_password_confirmation").val("");
  clearAvailabilityTable();
};

/*
 * This is used only in the admin's dashboard
 * it is the final step of upload a picture.
 * it differs from the provider's dashboard behavior, here it'll be need
 * two steps:
 * 1 - choose the picture and get a preview
 * 2 - upload the picture (which is what this method does)
 * Last update: 2015-02-19 by @thiago
 */
var uploadProviderPicture = function() {
  clearMessage("top_page_message");
  var input_pictures = document.getElementById('provider_picture_file').files;
  var provider_id = $("#providers_list").val();
  if (provider_id == "0") {
    cleanUpProvider();
    return;
  }
  if (!!input_pictures[0].type.match(/image.*/)) {
		var formData = new FormData();
		formData.append("provider_id", provider_id);
		formData.append("image", input_pictures[0]);
		$("#upload_button").html("<i class=\"fa fa-spinner fa-spin\"></i> Uploading");
		/* big master pog ever in my life, I've no idea wtf is this */
		document.getElementById("upload_button").style.left = document.getElementById("upload_button").offsetLeft;
		$.ajax({
			url: "/upload_provider_picture",
			type: 'POST',
			data: formData,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			beforeSend: function(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')) },
			success: function(response) {
				if (response.status == "success") {
					alertMessage("top_page_message", "Provider picture updated.", "success", false);
				}
				else if (response.status == "fail") {
					alertMessage("top_page_message", "Try again.", "warning", false);
					console.log(response.error);
				}
				$("#upload_button").html("<i class=\"fa fa-cloud-upload\"></i> Upload Picture");
			},
			error: function(response) {
				console.log("error");
				console.log(response);
				alertMessage("top_page_message", "A huge error happened.", "danger", false);
				console.log(response.error);
			}
		});
	}
};

/*
 * When something is changed in the subtab personal info, under provider's tab
 * in the admin's dashboard, this is the methos called for the [save] button
 * if some other field [new_field] is created, the following pattern:
 * 'provider[new_field]': $("#provider_new_field").val(),
 * must be used
 * Last update: 2015-02-19 by @thiago
 */
var saveProviderPersonalInfo = function() {
  clearMessage("top_page_message");
  if (validateProviderEdit()) {
    $.ajax({
      type: 'GET',
      url: '/update_provider_info',
      dataType: "json",
      data: { 
      	'provider_id': $("#providers_list").val(),
      	'provider[first_name]': $("#provider_first_name").val(),
      	'provider[last_name]': $("#provider_last_name").val(),
      	'provider[email]': $("#provider_email").val(),
      	'provider[phone]': $("#provider_phone").val(),
      	'provider[expertise]': $("#provider_expertise").val(),
      	'provider[abstract]': $("#provider_abstract").val(),
      	'provider[about]': $("#provider_about").val(),
      	'provider[admin]': ($("#provider_admin").prop("checked") ? "true" : "false")
      },
      success: function(data) {
        if (data.status == "success") {
          alertMessage("top_page_message", "Provider updated.", "success", false);
      	}
      	else if (data.status == "fail") {
      	  alertMessage("top_page_message", "Provider not found.", "warning", false);
      	}
      },
      error: function(data) {
        alertMessage("top_page_message", "Some error happened.", "danger", false);
      	console.log("error");
      	console.log(data);
      }
    });
  }
};

/*
 * It is used to save a provider's password, since it is under the admin's
 * dashboard, the current password is not asked
 * there are admin's authentication in the server side before execute this
 * action
 * Last update: 2015-02-19 by @thiago
 */
var changeProviderPassword = function() {
	clearMessage("top_page_message");
	if (!validPassword($("#provider_password").val()) || !validPassword($("#provider_password_confirmation").val()) || $("#provider_password").val() != $("#provider_password_confirmation").val()) {
		$("#provider_password_confirmation").val("");
		$("#provider_password").val("");
		$("#provider_password").focus();
		alertMessage("top_page_message", "Invalid passwords.", "warning", false);
		return;
	}
	
	$.ajax({
    type: 'GET',
    url: '/change_provider_password',
    dataType: "json",
    data: { 
    	'provider_id': $("#providers_list").val(),
    	'provider[password]': $("#provider_password").val(),
    	'provider[password_confirmation]': $("#provider_password_confirmation").val()
    },
    success: function(data) {
      if (data.status == "success") {
        alertMessage("top_page_message", "Provider password updated.", "success", false);
    	}
    	else if (data.status == "fail") {
    	  alertMessage("top_page_message", "Provider not found.", "warning", false);
    	}
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


/*
 * It generates a 6 character length string, only numbers from 0 to 9
 * Last update: 2015-02-19 by @thiago
 */
var generatePasswordProvider = function() {
	var password = getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9) + 
									getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9);
	$("#provider_password").val(password);
	$("#provider_password_confirmation").val(password);
};

/*
 * It generates a random number between min and max (params)
 * ->the returned value is a string
 *
 * params:
 * @min integer
 * @mas integer
 * Last update: 2015-02-19 by @thiago
 */
var getRandomArbitrary = function(min, max) {
  var number = Math.random() * (max - min) + min;
  number = parseInt(number, 10);
  return number.toString();
};


var current_provider_input;
var current_provider_id;
var uploadProviderPictureSelf = function(provider_id, input) {
	current_provider_input = input;
	current_provider_id = provider_id;
	showImageToProvider(input);
	$("#provider_image_container_buttons").show();
	//$("#provider_image_preview_modal").modal("show");
};
	
var uploadProviderPictureSelfCancel = function() {
	$('#provider_main_image').attr('src', current_provider_image);
	$("#provider_image_container_buttons").hide();
};

var uploadProviderPictureSelfGo = function() {
	var input = current_provider_input;
	var provider_id = current_provider_id;
	//$("#provider_image_preview_modal").modal("hide");
  clearMessage("top_page_message");
  //showImageToProvider(input);
  //alert("OK 1")
  $("#provider_image_container").hide();
  //alert("OK 2")
  $("#provider_picture_spin_container").html("<i class=\"fa fa-spinner fa-spin fa-5x\"></i>");
  //alert("OK 3")
  //show();
  
  var input_pictures = document.getElementById('provider_picture_file').files;
  if (provider_id == "0") {
    cleanUpProvider();
    return;
  }
  if (!!input_pictures[0].type.match(/image.*/)) {
		var formData = new FormData();
		formData.append("provider_id", provider_id);
		formData.append("image", input_pictures[0]);
		$.ajax({
			url: "/upload_provider_picture",
			type: 'POST',
			data: formData,
			async: false,
			cache: false,
			contentType: false,
			processData: false,
			beforeSend: function(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')) },
			success: function(response) {
				if (response.status == "success") {
					alertMessage("top_page_message", "Provider picture updated.", "success", false);
					$("#provider_image_container_buttons").hide();
					//showImageToProvider(input);
  				$("#provider_picture_spin_container").hide();
          $("#provider_image_container").show();
				}
				else if (response.status == "fail") {
					alertMessage("top_page_message", "Try again.", "warning", false);
					console.log(response.error);
				}
			},
			error: function(response) {
				console.log("error");
				console.log(response);
				alertMessage("top_page_message", "A huge error happened.", "danger", false);
				console.log(response.error);
			}
		});
	}
};



/* ---------------------------------------------------------------------- */

var showSpecialties = function(provider_id) {
	$.ajax({
		type: 'GET',
		url: '/provider_specialties',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
		},
		success: function(data) {
			if (data.status == "success") {
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.specialties, function(i, specialty) {
					if (i < data.specialties.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + specialty.specialty;
						content = content + "	<button type=\"button\" onclick=\"deleteSpecialtyToProvider(" + specialty.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.specialties, function(i, specialty) {
					if (i >= data.specialties.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + specialty.specialty;
						content = content + "	<button type=\"button\" onclick=\"deleteSpecialtyToProvider(" + specialty.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#specialties_list").html(content);
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

var addSpecialtyToProvider = function() {
	var provider_id = $("#providers_list").val();
	if ($("#new_specialty").val() === "" || $("#new_specialty").val() === undefined || provider_id == "0") {
		alertMessage("add_specialty_alert", "Please, type the specialty.", "warning", false);
		$("#new_specialty").focus();
		return;
	}
	clearMessage("add_specialty_alert");
	var specialty = $("#new_specialty").val();
	$("#new_specialty").val("");
	$.ajax({
		type: 'GET',
		url: '/add_specialty_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'specialty': specialty
		},
		success: function(data) {
			if (data.status == "success") {
				showSpecialties(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_specialty_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_specialty_alert", "Some error happened.", "danger", false);
		}
	});
};

var deleteSpecialtyToProvider = function(specialty_id) {
	var provider_id = $("#providers_list").val();
	$.ajax({
		type: 'GET',
		url: '/delete_specialty_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'specialty_id': specialty_id
		},
		success: function(data) {
			if (data.status == "success") {
				showSpecialties(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_specialty_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_specialty_alert", "Some error happened.", "danger", false);
		}
	});
};



var showServices = function(provider_id) {
	$.ajax({
		type: 'GET',
		url: '/provider_services',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
		},
		success: function(data) {
			if (data.status == "success") {
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.services, function(i, service) {
					if (i < data.services.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + service.service;
						content = content + "	<button type=\"button\" onclick=\"deleteServiceToProvider(" + service.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.services, function(i, service) {
					if (i >= data.services.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + service.service;
						content = content + "	<button type=\"button\" onclick=\"deleteServiceToProvider(" + service.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#services_list").html(content);
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

var addServiceToProvider = function() {
	var provider_id = $("#providers_list").val();
	if ($("#new_service").val() === "" || $("#new_service").val() === undefined || provider_id == "0") {
		alertMessage("add_service_alert", "Please, type the service.", "warning", false);
		$("#new_service").focus();
		return;
	}
	clearMessage("add_service_alert");
	var service = $("#new_service").val();
	$("#new_service").val("");
	$.ajax({
		type: 'GET',
		url: '/add_service_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'service': service
		},
		success: function(data) {
			if (data.status == "success") {
				showServices(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_service_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_service_alert", "Some error happened.", "danger", false);
		}
	});
};

var deleteServiceToProvider = function(service_id) {
	var provider_id = $("#providers_list").val();
	$.ajax({
		type: 'GET',
		url: '/delete_service_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'service_id': service_id
		},
		success: function(data) {
			if (data.status == "success") {
				showServices(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_service_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_service_alert", "Some error happened.", "danger", false);
		}
	});
};



var showCertifications = function(provider_id) {
	$.ajax({
		type: 'GET',
		url: '/provider_certifications',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
		},
		success: function(data) {
			if (data.status == "success") {
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.certifications, function(i, certification) {
					if (i < data.certifications.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + certification.certification;
						content = content + "	<button type=\"button\" onclick=\"deleteCertificationToProvider(" + certification.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.certifications, function(i, certification) {
					if (i >= data.certifications.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + certification.certification;
						content = content + "	<button type=\"button\" onclick=\"deleteCertificationToProvider(" + certification.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#certifications_list").html(content);
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

var addCertificationToProvider = function() {
	var provider_id = $("#providers_list").val();
	if ($("#new_certification").val() === "" || $("#new_certification").val() === undefined || provider_id == "0") {
		alertMessage("add_certification_alert", "Please, type the certification.", "warning", false);
		$("#new_certification").focus();
		return;
	}
	clearMessage("add_certification_alert");
	var certification = $("#new_certification").val();
	$("#new_certification").val("");
	$.ajax({
		type: 'GET',
		url: '/add_certification_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'certification': certification
		},
		success: function(data) {
			if (data.status == "success") {
				showCertifications(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_certification_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_certification_alert", "Some error happened.", "danger", false);
		}
	});
};

var deleteCertificationToProvider = function(certification_id) {
	var provider_id = $("#providers_list").val();
	$.ajax({
		type: 'GET',
		url: '/delete_certification_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'certification_id': certification_id
		},
		success: function(data) {
			if (data.status == "success") {
				showCertifications(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_certification_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_certification_alert", "Some error happened.", "danger", false);
		}
	});
};


var showAreas = function(provider_id) {
	$.ajax({
		type: 'GET',
		url: '/provider_areas',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
		},
		success: function(data) {
			if (data.status == "success") {
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.areas, function(i, area) {
					if (i < data.areas.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + area.area;
						content = content + "	<button type=\"button\" onclick=\"deleteAreaToProvider(" + area.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.areas, function(i, area) {
					if (i >= data.areas.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + area.area;
						content = content + "	<button type=\"button\" onclick=\"deleteAreaToProvider(" + area.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#areas_list").html(content);
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

var addAreaToProvider = function() {
	var provider_id = $("#providers_list").val();
	if ($("#new_area").val() === "" || $("#new_area").val() === undefined || provider_id == "0") {
		alertMessage("add_area_alert", "Please, type the area.", "warning", false);
		$("#new_area").focus();
		return;
	}
	clearMessage("add_area_alert");
	var area = $("#new_area").val();
	$("#new_area").val("");
	$.ajax({
		type: 'GET',
		url: '/add_area_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'area': area
		},
		success: function(data) {
			if (data.status == "success") {
				showAreas(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_area_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_area_alert", "Some error happened.", "danger", false);
		}
	});
};

var deleteAreaToProvider = function(area_id) {
	var provider_id = $("#providers_list").val();
	$.ajax({
		type: 'GET',
		url: '/delete_area_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'area_id': area_id
		},
		success: function(data) {
			if (data.status == "success") {
				showAreas(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_area_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_area_alert", "Some error happened.", "danger", false);
		}
	});
};

var showReviews = function(provider_id) {
	$.ajax({
		type: 'GET',
		url: '/provider_reviews',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
		},
		success: function(data) {
			if (data.status == "success") {
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.reviews, function(i, review) {
					if (i < data.reviews.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<button type=\"button\" onclick=\"deleteReviewToProvider(" + review.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "	<blockquote>";
						content = content + "		<p class=\"paragraph_bottom\">" + review.review + "</p>";
						content = content + "		<footer>" + review.author + "</footer>";
						content = content + "	</blockquote>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.reviews, function(i, review) {
					if (i >= data.reviews.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<button type=\"button\" onclick=\"deleteReviewToProvider(" + review.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "	<blockquote>";
						content = content + "		<p class=\"paragraph_bottom\">" + review.review + "</p>";
						content = content + "		<footer>" + review.author + "</footer>";
						content = content + "	</blockquote>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#reviews_list").html(content);
			}
			else if (data.status == "fail") {
				alertMessage("top_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("top_page_message", "Some error happened.", "danger", false);
		}
	});
};

var addReviewToProvider = function() {
	var provider_id = $("#providers_list").val();
	if ($("#new_review_review").val() === "" || $("#new_review_review").val() === undefined || provider_id == "0") {
		alertMessage("add_review_alert", "Please, type the review.", "warning", false);
		$("#new_review_author").focus();
		return;
	}
	if ($("#new_review_author").val() === "" || $("#new_review_author").val() === undefined || provider_id == "0") {
		alertMessage("add_review_alert", "Please, type the author.", "warning", false);
		$("#new_review_author").focus();
		return;
	}
	clearMessage("add_review_alert");
	var review = $("#new_review_review").val();
	var author = $("#new_review_author").val();
	$("#new_review_review").val("");
	$("#new_review_author").val("");
	$("#new_review").val("");
	$.ajax({
		type: 'GET',
		url: '/add_review_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'review': review,
			'author': author
		},
		success: function(data) {
			if (data.status == "success") {
				
				showReviews(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_review_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_review_alert", "Some error happened.", "danger", false);
		}
	});
};

var deleteReviewToProvider = function(review_id) {
	var provider_id = $("#providers_list").val();
	$.ajax({
		type: 'GET',
		url: '/delete_review_ajax',
		dataType: "json",
		data: { 
			'provider_id': provider_id,
			'review_id': review_id
		},
		success: function(data) {
			if (data.status == "success") {
				showReviews(provider_id);
			}
			else if (data.status == "fail") {
				alertMessage("add_review_alert", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("add_review_alert", "Some error happened.", "danger", false);
		}
	});
};


/* create some .... */
var passwordRecovery = function() {
	if (!validEmail($("#password_recovery_email").val())) {
		alertMessage("password_recovery_alert", "Email invalid.", "danger", false);
		return;
	}
	
	$.ajax({
		type: 'GET',
		url: '/password_recovery',
		dataType: "json",
		data: {
			'email': $("#password_recovery_email").val()
		},
		success: function(data) {
			if (data.status == "success") {
				alertMessage("password_recovery_alert", "An email has been sent to you.", "success", false);
			}
			else if (data.status == "fail") {
				alertMessage("password_recovery_alert", "Email not found, please check the spelling.", "danger", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("password_recovery_alert", "Error, please contact us.", "danger", false);
		}
	});
};