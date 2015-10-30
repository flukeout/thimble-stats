$(document).ready(function(){
  var parameters = {
    "count" : 100
  };
  $.get( '/latest-images',parameters, function(data) {
    writeImages(data);
  });
});

function writeImages(data){
  var table = $(".images");

  for(var i = 0; i < data.rows.length; i++){
    var row = data.rows[i];
    var src = row.publish_url + row.path;
    src = src.replace(/ /g,'%20');
    var imageWrapper = $("<a href='"+row.publish_url+"' target='new'><img src="+src+" /></a>");
    var image = imageWrapper.find("img");
    // image.hide();

    image.on("load",function(){
      $(this).show();
    });

    table.append(imageWrapper);
  }
}
