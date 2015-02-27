/*
$("#mainImage").change(function(){
    readURL(this, "mainImagePreview");
});

var pictureChange = function(picture_id) {
	if (picture_id === 0) {
		$("#mainImageLabel").val($("#provider_picture").val());
	}
	else {
		$("#pictureLabelToChange" + picture_id).val($("#pictureToChange" + picture_id).val());
	}
};*/

var readURL = function (input, img_id) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#' + img_id).attr('src', e.target.result);
			$('#' + img_id).removeClass("hidden");
			uploadProviderPictureSelf($("#provider_id").val());
        };
        reader.readAsDataURL(input.files[0]);
    }
    pictureChange(0);
};

var current_provider_image = "";
var showImageToProvider = function (input) {
    current_provider_image = $('#provider_main_image').attr('src');
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#provider_main_image').attr('src', e.target.result);
            console.log(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};

var current_provider_image = "";
var showImageToProviderModal = function (input) {
    current_provider_image = $('#provider_main_image').attr('src');
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#provider_main_image').attr('src', e.target.result);
            console.log(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
};