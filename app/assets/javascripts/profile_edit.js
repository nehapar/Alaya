$("#mainImage").change(function(){
    readURL(this, "mainImagePreview");
});

var pictureChange = function(picture_id) {
	if (picture_id === 0) {
		$("#mainImageLabel").val($("#mainImage").val());
	}
	else {
		$("#pictureLabelToChange" + picture_id).val($("#pictureToChange" + picture_id).val());
	}
};

var readURL = function (input, img_id) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#' + img_id).attr('src', e.target.result);
			$('#' + img_id).removeClass("hidden");
        };
        reader.readAsDataURL(input.files[0]);
    }
    pictureChange(0);
};

var addService = function() {
	var provider_id = $("#c_provider_id").val();
	if ($("#new_service").val() === "" || $("#new_service").val() === undefined) {
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
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.services, function(i, service) {
					if (i < data.services.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + service.service;
						content = content + "	<button type=\"button\" onclick=\"deleteService(" + service.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.services, function(i, service) {
					if (i >= data.services.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + service.service;
						content = content + "	<button type=\"button\" onclick=\"deleteService(" + service.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#services_list").html(content);
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

var deleteService = function(service_id) {
	var provider_id = $("#c_provider_id").val();
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
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.services, function(i, service) {
					if (i < data.services.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + service.service;
						content = content + "	<button type=\"button\" onclick=\"deleteService(" + service.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.services, function(i, service) {
					if (i >= data.services.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + service.service;
						content = content + "	<button type=\"button\" onclick=\"deleteService(" + service.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#services_list").html(content);
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

var addSpecialty = function() {
	var provider_id = $("#c_provider_id").val();
	if ($("#new_specialty").val() === "" || $("#new_specialty").val() === undefined) {
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
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.specialties, function(i, specialty) {
					if (i < data.specialties.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + specialty.specialty;
						content = content + "	<button type=\"button\" onclick=\"deleteSpecialty(" + specialty.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.specialties, function(i, specialty) {
					if (i >= data.specialties.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + specialty.specialty;
						content = content + "	<button type=\"button\" onclick=\"deleteSpecialty(" + specialty.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#specialties_list").html(content);
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

var deleteSpecialty = function(specialty_id) {
	var provider_id = $("#c_provider_id").val();
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
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.specialties, function(i, specialty) {
					if (i < data.specialties.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + specialty.specialty;
						content = content + "	<button type=\"button\" onclick=\"deleteSpecialty(" + specialty.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.specialties, function(i, specialty) {
					if (i >= data.specialties.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + specialty.specialty;
						content = content + "	<button type=\"button\" onclick=\"deleteSpecialty(" + specialty.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#specialties_list").html(content);
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

var addCertification = function() {
	var provider_id = $("#c_provider_id").val();
	if ($("#new_certification").val() === "" || $("#new_certification").val() === undefined) {
		alertMessage("add_certification_alert", "Please, type the certification.", "warning", false);
		$("#new_certification").focus();
		return;
	}
	clearMessage("add_certification_alert");
	var certification = $("#new_certification").val();
	$("#new_certification").val("")
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
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.certifications, function(i, certification) {
					if (i < data.certifications.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + certification.certification;
						content = content + "	<button type=\"button\" onclick=\"deleteCertification(" + certification.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.certifications, function(i, certification) {
					if (i >= data.certifications.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + certification.certification;
						content = content + "	<button type=\"button\" onclick=\"deleteCertification(" + certification.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#certifications_list").html(content);
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

var deleteCertification = function(certification_id) {
	var provider_id = $("#c_provider_id").val();
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
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.certifications, function(i, certification) {
					if (i < data.certifications.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + certification.certification;
						content = content + "	<button type=\"button\" onclick=\"deleteCertification(" + certification.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.certifications, function(i, certification) {
					if (i >= data.certifications.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + certification.certification;
						content = content + "	<button type=\"button\" onclick=\"deleteCertification(" + certification.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#certifications_list").html(content);
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

var addArea = function() {
	var provider_id = $("#c_provider_id").val();
	if ($("#new_area").val() === "" || $("#new_area").val() === undefined) {
		alertMessage("add_area_alert", "Please, type the area.", "warning", false);
		$("#new_area").focus();
		return;
	}
	clearMessage("add_area_alert");
	var area = $("#new_area").val();
	$("#new_area").val("")
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
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.areas, function(i, area) {
					if (i < data.areas.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + area.area;
						content = content + "	<button type=\"button\" onclick=\"deleteArea(" + area.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.areas, function(i, area) {
					if (i >= data.areas.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + area.area;
						content = content + "	<button type=\"button\" onclick=\"deleteArea(" + area.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#areas_list").html(content);
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

var deleteArea = function(area_id) {
	var provider_id = $("#c_provider_id").val();
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
				var content = "";
				content = content + "<div class=\"col-sm-5 col-sm-offset-1\">";
				$.each(data.areas, function(i, area) {
					if (i < data.areas.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + area.area;
						content = content + "	<button type=\"button\" onclick=\"deleteArea(" + area.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				content = content + "<div class=\"col-sm-5\">";
				$.each(data.areas, function(i, area) {
					if (i >= data.areas.length / 2) {
						content = content + "<div class=\"alert alert-info\" role=\"alert\">";
						content = content + "	<i class=\"fa fa-check color-green\"></i> " + area.area;
						content = content + "	<button type=\"button\" onclick=\"deleteArea(" + area.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
						content = content + "</div>";
					}
				});
				content = content + "</div>";
				$("#areas_list").html(content);
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


var addReview = function() {
	var provider_id = $("#c_provider_id").val();
	if ($("#new_review").val() === "" || $("#new_review").val() === undefined) {
		alertMessage("add_review_alert", "Please, type the review.", "warning", false);
		$("#new_review").focus();
		return;
	}
	if ($("#new_author").val() === "" || $("#new_author").val() === undefined) {
		alertMessage("add_review_alert", "Please, type the author.", "warning", false);
		$("#new_author").focus();
		return;
	}
	clearMessage("add_review_alert");
	var review = $("#new_review").val();
	var author = $("#new_author").val();
	$("#new_review").val("")
	$("#new_author").val("")
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
				var content = "";
				content = content + "<div class=\"col-sm-10 col-sm-offset-1\">";
				$.each(data.reviews, function(i, review) {
					content = content + "<div class=\"alert alert-info\" role=\"alert\">";
					content = content + "	<button type=\"button\" onclick=\"deleteReview(" + review.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
					content = content + "	<blockquote>";
					content = content + "		<p>\"" + review.review.replace(/(?:\r\n|\r|\n)/g, '<br/>') + "\"</p>";
					content = content + "		<footer>" + review.author + "</footer>";
					content = content + "	</blockquote>";
					content = content + "</div>";
				});
				content = content + "</div>";
				$("#reviews_list").html(content);
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

var deleteReview = function(review_id) {
	var provider_id = $("#c_provider_id").val();
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
				var content = "";
				content = content + "<div class=\"col-sm-10 col-sm-offset-1\">";
				$.each(data.reviews, function(i, review) {
					content = content + "<div class=\"alert alert-info\" role=\"alert\">";
					content = content + "	<button type=\"button\" onclick=\"deleteReview(" + review.id + ");\" class=\"close\" data-dismiss=\"alert\"><span aria-hidden=\"true\">&times;</span><span class=\"sr-only\">Close</span></button>";
					content = content + "	<blockquote>";
					content = content + "		<p>\"" + review.review.replace(/(?:\r\n|\r|\n)/g, '<br/>') + "\"</p>";
					content = content + "		<footer>" + review.author + "</footer>";
					content = content + "	</blockquote>";
					content = content + "</div>";
				});
				content = content + "</div>";
				$("#reviews_list").html(content);
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
