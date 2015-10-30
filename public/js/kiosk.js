var projects;
var index = 0;

$(document).ready(function(){
  var parameters = {};

  $.get('/kiosk-items',parameters, function(data) {
    writeTable(data);
  });

  //How often we show a new thing
  setInterval(function(){ next(); }, 5000);

});

function getMore(){
  var parameters = {};
  $.get('/kiosk',parameters, function(data) {
    projects = data;
  });
}

function writeTable(data){
  projects = data;
  var kiosk = $(".kiosk");

  for(var i = 0; i < 3; i++){
    var row = data.rows[i];
    var rowEl = $("<div class='result' />");
    rowEl.append("<div class='iframe-wrapper'><iframe scrolling='no' sandbox src="+row.publish_url+"></iframe><a href="+row.publish_url+"></a></div>");
    rowEl.prepend("<div class='title'>"+row.title+"</div>");
    kiosk.append(rowEl);
    index++;
  }
}


function next(){
  index++;

  if(index > 19){
    index = 0;
    getMore();
  }

  var row = projects.rows[index];

  var rowEl = $("<div class='result' />");
  rowEl.append("<div class='iframe-wrapper'><iframe scrolling='no' sandbox src="+row.publish_url+"></iframe><a href="+row.publish_url+"></a></div>");
  rowEl.prepend("<div class='title'>"+row.title+"</div>");
  $(".kiosk").append(rowEl);

  var width = $(".page-wrapper").width();
  $(".kiosk .result").addClass("move");

  setTimeout(function(){
    $(".kiosk .result").removeClass("move");
    $(".kiosk .result:first-child").remove();
  },1000)

}