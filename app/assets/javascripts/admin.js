var adminShowUpProvider = function() {
  clearMessage("admin_page_message");
  var provider_id = $("#providers_list").val();
  if (provider_id == "0") {
    cleanUpProvider();
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
        image.onload = function(){ // always fires the event.
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
				
				/* policies begin */
        $("#provider_policies").val(data.provider.policies);
        /* policies end */
        
        /* password begin */
        $("#provider_password").val("");
        $("#provider_password_confirmation").val("");
        /* password end */
    	}
    	else if (data.status == "fail") {
    	  alertMessage("admin_page_message", "Provider not found.", "warning", false);
    	}
    },
    error: function(data) {
      alertMessage("admin_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
};

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
				alertMessage("admin_page_message", "Specialty text updated.", "success", false);
			}
			else if (data.status == "fail") {
				alertMessage("admin_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("admin_page_message", "Some error happened.", "danger", false);
		}
	});
};

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
				alertMessage("admin_page_message", "Service text updated.", "success", false);
			}
			else if (data.status == "fail") {
				alertMessage("admin_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("admin_page_message", "Some error happened.", "danger", false);
		}
	});
};

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
				alertMessage("admin_page_message", "Payment & Policies text updated.", "success", false);
			}
			else if (data.status == "fail") {
				alertMessage("admin_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("admin_page_message", "Some error happened.", "danger", false);
		}
	});
};

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
  /* policies */
  $("#provider_policies").val("");
  /* password */
  $("#provider_password").val("");
  $("#provider_password_confirmation").val("");
};

var barPercentage = function(value) {
	$("#upload_progress_bar").attr("aria-valuenow", value);
	$("#upload_progress_bar").attr("style", "width: " + value + "%");
};

var uploadProviderPicture = function() {
  clearMessage("admin_page_message");
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
		/* big master pog ever in my life */
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
					barPercentage(100);
					alertMessage("admin_page_message", "Provider picture updated.", "success", false);
					barPercentage(0);
				}
				else if (response.status == "fail") {
					alertMessage("admin_page_message", "Try again.", "warning", false);
					console.log(response.error);
				}
				$("#upload_button").html("<i class=\"fa fa-cloud-upload\"></i> Upload Picture");
			},
			error: function(response) {
				console.log("error");
				console.log(response);
				alertMessage("admin_page_message", "A huge error happened.", "danger", false);
				console.log(response.error);
			}
		});
	}
};

var saveProviderPersonalInfo = function() {
  clearMessage("admin_page_message");
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
          alertMessage("admin_page_message", "Provider updated.", "success", false);
      	}
      	else if (data.status == "fail") {
      	  alertMessage("admin_page_message", "Provider not found.", "warning", false);
      	}
      },
      error: function(data) {
        alertMessage("admin_page_message", "Some error happened.", "danger", false);
      	console.log("error");
      	console.log(data);
      }
    });
  }
};

var changeProviderPassword = function() {
	clearMessage("admin_page_message");
	if (!validPassword($("#provider_password").val()) || !validPassword($("#provider_password_confirmation").val()) || $("#provider_password").val() != $("#provider_password_confirmation").val()) {
		$("#provider_password_confirmation").val("");
		$("#provider_password").val("");
		$("#provider_password").focus();
		alertMessage("admin_page_message", "Invalid passwords.", "warning", false);
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
        alertMessage("admin_page_message", "Provider password updated.", "success", false);
    	}
    	else if (data.status == "fail") {
    	  alertMessage("admin_page_message", "Provider not found.", "warning", false);
    	}
    	$("#provider_password").val("");
  		$("#provider_password_confirmation").val("");
    },
    error: function(data) {
      alertMessage("admin_page_message", "Some error happened.", "danger", false);
    	console.log("error");
    	console.log(data);
    }
  });
};

var generatePasswordProvider = function() {
	var password = getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9) + 
									getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9) + getRandomArbitrary(0, 9);
	$("#provider_password").val(password);
	$("#provider_password_confirmation").val(password);
};

var getRandomArbitrary = function(min, max) {
    var number = Math.random() * (max - min) + min;
    number = parseInt(number, 10);
    return number.toString();
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
				alertMessage("admin_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("admin_page_message", "Some error happened.", "danger", false);
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
				alertMessage("admin_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("admin_page_message", "Some error happened.", "danger", false);
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
				alertMessage("admin_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("admin_page_message", "Some error happened.", "danger", false);
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
				alertMessage("admin_page_message", "Please, try again.", "warning", false);
			}
		},
		error: function(data) {
			console.log("error");
			console.log(data);
			alertMessage("admin_page_message", "Some error happened.", "danger", false);
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