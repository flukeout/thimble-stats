var express = require('express');
var app = express();

var pg = require('pg'); //postgres library
var nunjucks = require('nunjucks'); //nunjucks

nunjucks.configure({ autoescape: true });

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    watch: true
});

var habitat = require('habitat'); //postgres library
habitat.load();

var env = new habitat("db");

var db_user = env.get("user");
var db_pass = env.get("password");
var db_host = env.get("host");
var db_port = env.get("port");
var db_database = env.get("database");

var url = require('url');

// Database connection
var conString = "postgres://"+db_user+":"+db_pass+"@"+db_host+":"+db_port+"/"+db_database;

//This makes it so that static assets will be served from
//the 'public' folder when requested via the URL
app.use(express.static('public'));


// Views

app.get('/', function(req, res) {
  res.render('dashboard.html');
});

app.get('/month', function(req, res) {
  res.render('month.html');
});

app.get('/images', function(req, res) {
  res.render('images.html');
});

app.get('/kiosk', function(req, res) {
  res.render('kiosk.html');
});

app.get('/search', function(req, res) {
  res.render('search.html');
});

//------------------//
//  Search queries  //
//------------------//


//Gets the stats for the latest created published projects
app.get('/count-created', function (req, res) {
  var query = "select age(date_trunc('day',to_timestamp(date_created, 'YYYY-MM-DD HH24 MI') at time zone 'PST')) as age, count(*) from projects where age(date_trunc('day',to_timestamp(date_created, 'YYYY-MM-DD HH24 MI') at time zone 'PST')) >= '0 days' and age(date_trunc('day',to_timestamp(date_created, 'YYYY-MM-DD HH24 MI') at time zone 'PST')) < '9 days' group by age";
  search(query, req, res);
});

//Finds projects by description & title
app.get('/find-projects', function (req, res) {
  var url_parts = url.parse(req.url, true);
  var terms = JSON.parse(url_parts.query.terms) || "";
  var termsString = "";

  for(var i = 0; i < terms.length; i++) {
    if(i != 0){ termsString = termsString + "|";}
    termsString = termsString + "%" + terms[i] + "%";
  }

  var query = "select * from projects where publish_url is not NULL and lower(title) similar to '"+termsString+"' or lower(description) similar to '"+termsString+"' limit 40";
  search(query, req, res);
});

//Finds projects by author
app.get('/author', function (req, res) {
  var url_parts = url.parse(req.url, true);
  var terms = JSON.parse(url_parts.query.terms) || "";
  var termsString = "";

  for(var i = 0; i < terms.length; i++) {
    if(i != 0){ termsString = termsString + "|"; }
    termsString = termsString + "%" + terms[i] + "%";
  }

  var query = "select users.id, projects.* from users, projects where projects.publish_url is not NULL and users.id = projects.user_id and lower(users.name) similar to '"+termsString+"' limit 40";
  search(query, req, res);
});


//Gets the latest updated projects
app.get('/count-updated', function (req, res) {
  var query = "select age(date_trunc('day',to_timestamp(date_updated, 'YYYY-MM-DD HH24 MI') at time zone 'PST')) as age, count(*) from projects where age(date_trunc('day',to_timestamp(date_updated, 'YYYY-MM-DD HH24 MI') at time zone 'PST')) > '0 days' and age(date_trunc('day',to_timestamp(date_updated, 'YYYY-MM-DD HH24 MI') at time zone 'PST')) < '9 days' group by age";
  search(query, req, res);
});

//Monthly-count
app.get('/monthly-count', function (req, res) {
  var query = "select to_date(date_created, 'YYYY-MM-DD') , count(*) from projects where publish_url is not NULL group by to_date(date_created, 'YYYY-MM-DD') order by to_date(date_created, 'YYYY-MM-DD') desc limit 30";
  search(query, req, res);
});

// Last 10 projects updated that are published
app.get('/latest', function (req, res) {
  var query = "select * from projects where published_id is not null order by date_updated desc limit 10";
  search(query, req, res);
});

// Last 30 projects updated that are published
app.get('/kiosk-items', function (req, res) {
  var query = "select * from projects where published_id is not null order by date_updated desc limit 30";
  search(query, req, res);
});

// Newest projects published on a particular day
app.get('/published-per-day', function (req, res) {
  var url_parts = url.parse(req.url, true);
  var date = url_parts.query.date;
  var limit = url_parts.query.count;
  var query = "select * from projects where to_date(date_created,'YYYY-MM-DD') = to_date('"+date+"','YYYY-MM-DD') and publish_url is not NULL order by random() limit " + limit;
  search(query, req, res);
});

// Gets latest published images
app.get('/latest-images', function (req, res) {
  var url_parts = url.parse(req.url, true);
  var count = parseInt(url_parts.query.count) || 10;
  var query = "select newImages.path, newImages.id, projects.published_id, projects.publish_url from (select path, max(id) as id from \"publishedFiles\" where path like '%.svg' or path like '%.png' or path like '%.jpg' group by path order by max(id) desc limit "+count+") as newImages, \"publishedFiles\", projects where \"publishedFiles\".id = newImages.id and projects.published_id = \"publishedFiles\".published_id";
  search(query, req, res);
});

function search(query, req, res){
  pg.connect(conString, function(err, client, done) {
    if(err) {
      return console.error('error fetching client from pool', err);
    }
    client.query(query, function(err, result) {
      done(); // Releases the client back to the pool
      if(err) {
        return console.error('error running query', err);
      }
      res.send(result);
    });
  });
}

var server = app.listen(8092, function () {
  var host = server.address().address;
  var port = server.address().port;
});
