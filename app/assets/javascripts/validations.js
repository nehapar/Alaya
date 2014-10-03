var validEmail = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};

var validPassword = function(password) {
	if (!validNotEmpty(password) || password.length < 6) {
		return false;
	}
	return true;
};

var validNotEmpty = function (string) {
	if (string === "" || string === undefined) {
		return false;
	}
	return true;	
}

var validNumber = function(number) {
	var re = /^\d+$/;
	if (number !== undefined && number !== "" && re.test(number)) {
		return true;
	}
    return false;
}

var validateSign = function() {
	var email = $("#session_email").val();
	var password = $("#session_password").val();

	if (!validEmail(email)) {
		alertMessage("signin_alert_message", "Invalid email.", "danger", false);
		$("#session_email").focus();
		return false;
	}
	if (!validPassword(password)) {
		alertMessage("signin_alert_message", "Invalid password.", "danger", false);
		$("#session_password").focus();
		return false;
	}
};

var validateClientSignup = function() {
	
};

var validateProviderSignup = function() {
	provider_first_name = $("#provider_first_name").val();
	provider_last_name = $("#provider_last_name").val();
	provider_email = $("#provider_email").val();
	provider_password = $("#provider_password").val();
	provider_password_confirmation = $("#provider_password_confirmation").val();
	
	clearMessage("provider_signup_alert");
	if (!validNotEmpty(provider_first_name)) {
		alertMessage("provider_signup_alert", "Type your first name.", "danger", false);
		$("#provider_first_name").focus();
		return false;
	}
	
	if (!validNotEmpty(provider_last_name)) {
		alertMessage("provider_signup_alert", "Type your last name.", "danger", false);
		$("#provider_last_name").focus();
		return false;
	}
	
	if (!validEmail(provider_email)) {
		alertMessage("provider_signup_alert", "Invalid email.", "danger", false);
		$("#provider_email").focus();
		return false;
	}
	if (!validPassword(provider_password)) {
		alertMessage("provider_signup_alert", "Invalid password.", "danger", false);
		$("#provider_password").val("");
		$("#provider_password_confirmation").val("");
		$("#provider_password").focus();
		return false;
	}
	if (!validPassword(provider_password_confirmation)) {
		alertMessage("provider_signup_alert", "Invalid password confirmation.", "danger", false);
		$("#provider_password").val("");
		$("#provider_password_confirmation").val("");
		$("#provider_password").focus();
		return false;
	}
	if (provider_password != provider_password_confirmation) {
		alertMessage("provider_signup_alert", "Passwords don't match.", "danger", false);
		$("#provider_password").val("");
		$("#provider_password_confirmation").val("");
		$("#provider_password").focus();
		return false;
	}
};

var validateUploadPicture = function() {
	if (!validNotEmpty($("#mainImageLabel").val())) {
		return false;
	}
};
