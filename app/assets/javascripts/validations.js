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

};

/*
jQuery("#form").submit(function(e) {
     var self = this;
     e.preventDefault();
     jQuery.fancybox('<div class="box">Some amazing wonderful content</div>', {
           'onClosed' : function() { 
                          self.submit();
                        }
     });
     return false; //is superfluous, but I put it here as a fallback
});*/