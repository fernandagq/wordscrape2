// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
     //dynamically generating title, link, description, and save button.
      var title = $("<h2>")
      title.attr("data-id", data[i]._id)
      title.text(data[i].title)
      
      var link = $("<p>")
      link.attr("data-id", data[i]._id)
      link.text(data[i].link)
      
      var description = $("<p>")
      description.attr("data-id", data._id)
      description.text(data[i].description)
  
      var saveArt = $("<button>")
      saveArt.addClass("saveButton")
      saveArt.attr("id", data._id)
      saveArt.text("Save")
  
      $("#articles").append(title, link, description, saveArt)
  
    }
  });
  
  //When "h2" tag is clicked, user is able to add notes.
  $(document).on("click", "h2", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  //Here, when user clicks .saveButton, the article selected should save. 
  $(document).on("click", ".saveButton", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/save" + thisId,
      
    })
      .then(function(data) {
        console.log("saved" + data)
      });
  });
  //Here, need to retreive information about the saved article and create a function for it to render in savedArticle.html
  $(document).on("click", "#savedArticles", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/savedArticles" + thisId
    })
      .then(function(data) {
        $("#savedArticles").append("<h2>" + data.title + "</h2>")
        $("#savedArticles").append("<p>" + data.link + "<p>")
        $("#savedArticles").append("<p>" + data.description + "<p>")
  
  
      });
  });