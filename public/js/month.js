var currentDate;

$(document).ready(function(){

  currentDate = new Date();

  var parameters = {};

  $.get('/monthly-count',parameters, function(data) {
    buildMonth(data);
    buildDaily(currentDate);
  });

  $(document).on("keydown",function(e){
    if(e.keyCode == 39){
      nextDay();
    }
    if(e.keyCode == 37){
      previousDay();
    }
  });

  $(".month").on("click", ".day",function(){
    currentDate = new Date($(this).data("date"));
    buildDaily(currentDate);
  });

  $(".refresh").on("click", function(){
    $(this).addClass("refreshspin");
    setTimeout(function(){
      $(".refreshspin").removeClass("refreshspin");
    },350);
    buildDaily(currentDate);
  });

  $(".daily-summary").on("click", ".next",function(){
    nextDay();
  });

  $(".daily-summary").on("click", ".previous",function(){
    previousDay();
  });

});

function popUI(el){
  el.removeClass("ui-pop");
  el.width(el.width());
  el.addClass("ui-pop");
  setTimeout(function(){
    el.removeClass("ui-pop");
  },630);
}

function nextDay(){
  popUI($(".next"));
  var newDate = currentDate.setDate(currentDate.getDate() + 1);
  currentDate = new Date(newDate);
  buildDaily(currentDate);
}

function previousDay(){
  popUI($(".previous"));
  var newDate = currentDate.setDate(currentDate.getDate() - 1);
  currentDate = new Date(newDate);
  buildDaily(currentDate);

}

function selectDay(date){
  var selectDate = formatDate(new Date(date));
  $(".month .selected").removeClass("selected");

  $(".month .day").each(function(i,el){
    var day = $(el).data("date");
    var thisDate = formatDate(new Date(day));
    if(thisDate == selectDate){
      $(this).addClass("selected");
      $(this).addClass("bounceup");
    }
  });
}

function buildDaily(date){
  selectDay(date);

  var resultCount = 10;
  var prettyDate = weekDaysLong[date.getDay()] + ", " + monthNames[date.getMonth()] + " " + date.getDate();

  $(".daily-summary .date").text(prettyDate);

  var requestDate = formatDate(date);
  var parameters = {
    "date" : requestDate,
    "count" : resultCount
  };

  $.get('/published-per-day',parameters, function(data) {
    dailyTable(data);
  });
}

function dailyTable(data){
  var table = $(".results");
  table.find("*").remove();
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

function buildMonth(data){

  var monthEl = $(".month");
  var days = data.rows;

  //Figure out highest and lowest value
  var testArray = [];
  for(var i = 0; i < days.length; i++) {
    testArray.push(days[i].count);
  }
  var max = getMax(testArray);
  var min = getMin(testArray);

  for(var i = 0; i < days.length; i++){
    var day = days[i];
    var count = parseInt(day.count);

    var date = new Date(day.to_date);

    var dayOfWeek = weekDaysShort[date.getDay()];
    var dayNumber = date.getDate();
    var month = date.getMonth();

    var dateEl = $("<div class='date'><div>" + dayNumber + "</div><div>" +  + "</div></div>");
    var dayEl = $("<div class='day'></div>");
    var graphEl = $("<div class='bar-wrapper'><div class='bar'><div class='count'>"+count+"</div></div></div>");
    dayEl.data("date",date);

    dayEl.append(graphEl);
    dayEl.append(dateEl);
    graphEl.find('.bar').css("height", 100 * count/max + "%");

    monthEl.prepend(dayEl);
  }
}

