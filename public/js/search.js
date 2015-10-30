var projects;
var index = 0;

$(document).ready(function(){

  $(".project").on("keypress",function(e){
    if(e.keyCode == 13){
      searchProjects();
    }
  });

  $(".author").on("keypress",function(e){
    if(e.keyCode == 13){
      searchAuthors();
    }
  });

  $(".project").focus();
});

function searchAuthors(){
  var inputVal = $(".author").val().toLowerCase();
  var terms = [];
  if(inputVal){
    $(".results *").remove();
    var terms = inputVal.split(" ");
    var parameters = {
      "terms" : JSON.stringify(terms)
    };
    $.get('/author',parameters, function(data) {
      writeTable(data);
    });
  }
}

function searchProjects(){

  var inputVal = $(".project").val().toLowerCase();
  var terms = [];

  if(inputVal){

    $(".results *").remove();

    var terms = inputVal.split(" ");
    var parameters = {
      "terms" : JSON.stringify(terms)
    };

    $.get('/find-projects',parameters, function(data) {
      writeTable(data);
    });

  }
}

function writeTable(data){
  var table = $(".results");
  for(var i = 0; i < data.rows.length; i++){
    var row = data.rows[i];
    var rowEl = $("<div class='result' />");
    rowEl.append("<div class='iframe-wrapper'><iframe scrolling='no' sandbox src="+row.publish_url+"></iframe><a href="+row.publish_url+"></a></div>");
    rowEl.append("<div class='title'>"+row.title+"</div>");
    table.append(rowEl);
  }
}
