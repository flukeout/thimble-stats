var projects;
var index = 0;

$(document).ready(function(){
  getUser(user);
});

function getUser(id){
  var parameters = {
    "user" : user
  };

  $.get('/get-user-projects',parameters, function(data) {
    writeTable(data);
  });

  $.get('/get-username',parameters, function(data) {
    writeUserInfo(data);
  });


}

function writeUserInfo(data){
  var firstRow = data.rows[0];
  var username = firstRow.name;

  $(".username").text(username);

}

function writeTable(data){
  var table = $(".results");
  table.find("*").remove();

  var count = data.rows.length;
  if(count == 0){
    count = "no";
  }

  $(".project-count").text(count);

  for(var i = 0; i < data.rows.length; i++){
    var row = data.rows[i];
    var rowEl = $("<div class='result' />");
    rowEl.append("<div class='iframe-wrapper'><iframe scrolling='no' sandbox src="+row.publish_url+"></iframe><a class='link' href="+row.publish_url+"></a></div>");
    rowEl.append("<div class='title'>"+row.title+"</div>");
    table.append(rowEl);
  }
}

