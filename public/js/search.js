var projects;
var index = 0;

$(document).ready(function(){

  $(".project").on("keypress",function(e){
    if(e.keyCode == 13){
      searchProjects();
      startSearch();
    }
  });

  $(".author").on("keypress",function(e){
    if(e.keyCode == 13){
      searchAuthors();
      startSearch();
    }
  });

  $(".project").focus();
  $("input").val("");
});

function startSearch(){
  $(".results-wrapper").addClass("hidden");
  $("input").blur();
  $(".throbber").removeClass("hidden");
}

function endSearch(){
  $(".throbber").addClass("hidden");
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
      writeAuthors(data);
    });
  }
}

function writeAuthors(data){
  endSearch();
  $(".author-results").removeClass("hidden");
  var table = $(".author-results .author-list");
  table.find("*").remove();
  $(".author-results .count").text(data.rows.length);
  for(var i = 0; i < data.rows.length; i++){
    var row = data.rows[i];
    var rowEl = $("<a class='result' href='/user/"+row.id+"'>"+row.name+"</a>");
    table.append(rowEl);
  }
}

function writeTable(data){
  endSearch();
  $(".search-results").removeClass("hidden");
  $(".search-results .count").text(data.rows.length);

  var table = $(".results");
  table.find("*").remove();
  for(var i = 0; i < data.rows.length; i++){
    var row = data.rows[i];
    var rowEl = $("<div class='result' />");
    rowEl.append("<div class='iframe-wrapper'><iframe scrolling='no' sandbox src="+row.publish_url+"></iframe><a class='link' href="+row.publish_url+"></a></div>");
    rowEl.append("<div class='title'>"+row.title+"</div>");
    rowEl.append("<a class='author' href='/user/"+row.user_id+"'><i class='fa fa-user'></i></a>");
    table.append(rowEl);
  }
}
