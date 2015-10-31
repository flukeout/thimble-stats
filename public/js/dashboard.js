$(document).ready(function(){
  var currentDate = new Date();
  var newDate = formatDate(currentDate);

  var parameters = {
    "date" : newDate
  };

  $.get('/count-created',parameters, function(data) {
    buildGraph(data,"created");
  });

  $.get('/latest',parameters, function(data) {
    writeTable(data);
  });

});


function buildGraph(data, type){

  $("[stat="+type+"]").removeClass("hidden");

  var now = new Date();
  var values = [];

  //Grab the rest of the values
  for(var i = 0; i < data.rows.length; i++){
    var row = data.rows[i];
    if(row.age){
      values.push(parseInt(row.count));
    }
  }

  var min = getMin(values);
  var max = getMax(values);

  var dailyData = {};

  for(var i = 0 ; i < data.rows.length; i++){
    var row = data.rows[i];
    var age = row.age.days || 0;
    var count = row.count;
    dailyData[age] = count;
  }

  var maxLabel = Math.round(max / 100) * 100;

  var midLine = $("[stat="+type+"] .mid-line");
  var maxLine = $("[stat="+type+"] .max-line");

  maxLine.text(maxLabel).css("bottom", 100 * maxLabel / max + "%");
  midLine.text(maxLabel/2).css("bottom", 100/2 * maxLabel / max + "%");

  for(var i = 0; i < data.rows.length; i++){
    var row = data.rows[i];
    var age = i;
    var count = dailyData[age];

    if(age == 0){
      $("[stat="+type+"] .today .count").text(count);
    }

    if(i > 0) {
      var bar = $("<div class='bar'><div class='dot'></div><div class='day'></div></div>");
      var date = new Date(new Date().setDate(new Date().getDate() - i ));
      var day = date.getDay();
      var date = date.getDate();
      bar.find(".day").text(weekDays[day] + ", " + date);

      $(bar).height(100 * count/max + "%");

      $(bar).find(".dot").append("<div class='label'>"+count+"</div>");

      $("[stat="+type+"] .graph").prepend(bar);

    }
  }

  drawLines(type);
}

function drawLines(type){
  var bars = $("[stat="+type+"] .graph .bar");
  var width = $("[stat="+type+"] .bar").width();

  for(var i = 0; i < bars.length; i++) {

    var bar = bars[i];
    var nextBar = bars[i+1];
    var delta = $(bar).height() - $(nextBar).height();

    if(i < bars.length - 1) {
      $(bar).prepend('<svg><line x1="0" y1="0" y2="'+delta+'" x2="100%" style="stroke: rgb(234, 243, 234);stroke-width: 3;"></line></svg>');
    }

    $(bar).find(".dot").css("animation-delay",.2 +  (i * .1) + "s");
    $(bar).find("svg").css("animation-delay",1 +  (i * .05) + "s");

  }
}

function writeImages(data){
  var table = $(".results");
  for(var i = 0; i < data.rows.length; i++){
    var row = data.rows[i];
    var src = row.publish_url + row.path;
    src = src.replace(/ /g,'%20');
    table.append("<a href='"+row.publish_url+"' target='new'><img width=200 src="+src+" /></a>");
  }
}

function writeTable(data){

  var table = $(".results");
  for(var i = 0; i < data.rows.length; i++){
    var row = data.rows[i];
    var rowEl = $("<div class='result' />");
    rowEl.append("<div class='iframe-wrapper'><iframe scrolling='no' sandbox src="+row.publish_url+"></iframe><a class='link' href="+row.publish_url+"></a></div>");
    rowEl.append("<div class='title'>"+row.title+"</div>");
    rowEl.append("<a class='author' href='/user/"+row.user_id+"'><i class='fa fa-user'></i></a>");
    rowEl.css("animation-delay",i * .05 +"s");
    table.append(rowEl);
  }
}
