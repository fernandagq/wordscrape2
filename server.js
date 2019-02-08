var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");


var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();


app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// mongoose.connect("mongodb://localhost/snopeArticles", { useNewUrlParser: true });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


app.get("/scrape", function (req, res) {

  axios.get("https://www.snopes.com/fact-check/").then(function (response) {


    var $ = cheerio.load(response.data);


    $(".list-group-item").each(function (i, element) {

      var result = {};

      result.title = $(this).children().find("h2").text();
      result.link = $(this).find("a").attr("href");
      result.description = $(this).children().find("p").text();

      db.Article.create(result)
        .then(function (dbArticle) {
          // console.log(dbArticle)
        })
        .catch(function (err) {
          console.log(err)
        });
    });
    res.send("Success!")

  });
});
app.get("/articles", function(req, res) {
  db.Article.find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
  
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
 
      res.json(dbArticle);
    })
    .catch(function(err) {
     
      res.json(err);
    });
});
//my attempt at getting the /saved articles 
app.get("/saved", function (req, res ){
  db.Article.find({"saved": true}, function (err, data){
    if (err){
      console.log(err)
    }else {
      res.json(data)
    }
  })
})


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});





