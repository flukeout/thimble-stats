var monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var weekDays = ['Sun','Mon','Tues','Wed','Thur','Fri','Sat'];
var weekDaysLong = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var weekDaysShort = ['Su','M','Tu','W','Th','F','Sa'];

//Gets minimum value in an array
function getMin(array){
  var min = parseInt(array[0]);
  for(var i = 0; i < array.length; i++){
    array[i] = parseInt(array[i]);
    if(array[i] <  min) {
      min = array[i];
    }
  }
  return min;
}

//Gets max value of an array
function getMax(array){
  var max = parseInt(array[0]);
  for(var i = 0; i < array.length; i++){
    array[i] = parseInt(array[i]);
    if(array[i] >  max) {
      max = array[i];
    }
  }
  return max;
}

// Returns a YYYY-MM-DD date string
function formatDate(date){
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if(month < 10){ month = "0" + month}
  var day = date.getDate();
  if(day < 10){ day = "0" + day }
  var dateString = year + " " + month + " " + day;
  return dateString;
}
