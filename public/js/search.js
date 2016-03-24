var projects;
var index = 0;

$(document).ready(function(){


  $(".project").on("keypress",function(e){
    if(e.keyCode == 13){
      searchProjects();
      startSearch();
    }
  });

  $(".search-projects").on("click",function(){
    searchProjects();
    startSearch();
  });


  $(".author").on("keypress",function(e){
    if(e.keyCode == 13){
      searchAuthors();
      startSearch();
    }
  });

  $(".search-authors").on("click",function(){
    searchAuthors();
    startSearch();
  });


  $(".project").focus();
  $("input").val("");



  //Checks to see if there are already any search terms.
  var projectTerms = getUrlParameter('terms') || "";
  var userTerms = getUrlParameter('user') || "";

  if(projectTerms.length > 0) {
    var inputValue = projectTerms.replace(/,/g, ' ');
    $(".project").val(inputValue);
    $(".project").focus();
    startSearch();
    searchProjects();
  }

  if(userTerms.length > 0) {
    var inputValue = userTerms.replace(/,/g, ' ');
    $(".author").val(inputValue);
    $(".author").focus();
    startSearch();
    searchAuthors();
  }
});

function startSearch(){
  $(".results-wrapper").addClass("hidden");
  $(".throbber").removeClass("hidden");
}

function endSearch(){
  $(".throbber").addClass("hidden");
}

function searchProjects(){

  var inputVal = $(".project").val().toLowerCase();

  var searchParameters = inputVal.split(" ").join(",");
  window.history.replaceState(null,null,"/search?terms=" + searchParameters);

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

  var searchParameters = inputVal.split(" ").join(",");
  window.history.replaceState(null,null,"/search?user=" + searchParameters);

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


function getUrlParameter(sParam){
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++)
  {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam)
    {
      return sParameterName[1];
    }
  }
}
