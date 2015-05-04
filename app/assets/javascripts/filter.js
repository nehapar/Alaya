var filterAction = function(e) {
  var content = "";
  if (e.value !== "" && e.value !== undefined) {
    $.ajax({
      type: 'POST',
      url: '/filter_provider_ajax',
      dataType: "json",
      data: { 
      	'filter': e.value
      },
      success: function(data) {
        content = content + "<div class=\"row\">";
        content = content + "    <div class=\"col-md-10 col-md-offset-1 fadeInLeft\">";
        content = content + "        <div class=\"panel panel-profile\">";
      	if (data.status == "success") {
          content = content + "<table class=\"table table-hover\">";
          $.each(data.categories, function(i, category) {
            content = content + "    <thead>";
            content = content + "        <tr>";
            content = content + "            <th>";
            content = content + "                " + category;
            content = content + "            </th>";
            content = content + "        </tr>";
            content = content + "    </thead>";
            content = content + "    <tbody>";
            $.each(data.results, function(i, result) {
              if (result.category == category) {
                content = content + "        <tr class=\"filtered-line\">";
                content = content + "            <td>";
                content = content + "                " + result.text;// + ", ids: " + result.id;
                content = content + "            </td>";
                content = content + "        </tr>";
              }
    				});
            content = content + "    </tbody>";
          });
          content = content + "</table>";
      	}
      	else if (data.status == "fail") {
      	  content = content + "<table class=\"table table-hover\">";
          content = content + "    <thead>";
          content = content + "        <tr>";
          content = content + "            <th>";
          content = content + "                Sorry, no patters match...";
          content = content + "            </th>";
          content = content + "        </tr>";
          content = content + "    </thead>";
          content = content + "    <tbody>";
          content = content + "        <tr class=\"filtered_line\">";
          content = content + "            <td>";
          content = content + "                <b>&#8230;</b>";
          content = content + "            </td>";
          content = content + "        </tr>";
          content = content + "    </tbody>";
          content = content + "</table>";
      	}
      	content = content + "        </div>";
        content = content + "    </div>";
        content = content + "</div>";
      	
      	$("#filter_results").html(content);
      },
      error: function(data) {
      	console.log("error");
      	console.log(data);
      }
    });
    return;
  }
  $("#filter_results").html(content);
};