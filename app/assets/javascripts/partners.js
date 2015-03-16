/**
 * when someone intends to become a provider, is sends the email
 * to the admin
 * 
 * there are two fields which can be filled with the provider candidate
 * email, so:
 * 
 * @params [field] contains the number 1 or 2, to identify which
 *        field the provider candidate has filled
 *
 */
var sendNoteToBecomePartner = function(field) {
  var email = $("#provider_email_" + field).val();
  // this uses a function to validate if the email is a valid email
  if (validEmail(email)) {
    $.ajax({
      type: 'GET',
      url: '/provider_intention_note',
      dataType: "json",
      data: { 
      	'email': email
      },
      success: function(data) {
        if (data.status == "success") {
          alertMessage("become_a_partner_alert_" + field, "Thank you for your interest in become our partner. We are going to contact you as soon as possible.", "success", false);
          $("#provider_email_" + field).val("");
      	}
      	else if (data.status == "fail") {
      	  alertMessage("become_a_partner_alert_" + field, "Please try again with an valid email", "warning", false);
      	}
      },
      error: function(data) {
        alertMessage("become_a_partner_alert_" + field, "Sorry, something went wrong.", "warning", false);
      	console.log("error");
      	console.log(data);
      }
    });
  }
  else {
    alertMessage("become_a_partner_alert_" + field, "Please use a valid email.", "warning", false);
    $("#provider_email_" + field).focus();
  }
};