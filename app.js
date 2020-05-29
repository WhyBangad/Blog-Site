var express = require("express"),
    app = express(),
    expressSanitizer = require("express-sanitizer"),              //removes entered content of any script 
    methodOverride = require("method-override"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/restful_blog_app", {useNewUrlParser : true, useUnifiedTopology : true});
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));     //the string inside here is searched for in the query string and used for the override

var blogSchema = new mongoose.Schema({
    title : String,
    image : {type : String, default : "https://www.digitalvidya.com/wp-content/uploads/2019/03/personal-blog.jpg"},
    body : String,
    created : {type : Date, default : Date.now()}
});

var Blog = mongoose.model("Blog", blogSchema);

app.get("/", function(req, res){
    res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }
        else{
            res.render("index", {blogs : blogs});
        }
    });
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
    res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            console.log(newlyCreated);
            res.redirect("/blogs");
        }
    });
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, blog){
        if(err){
            console.log(err);
        }
        else{
            res.render("show", {blog : blog});
        }
    });
});

//EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }
        else{
            res.render("edit", {blog : foundBlog});
        }
    });
});

//UPDATE ROUTE  
app.put("/blogs/:id", function(req, res){
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

//DELETE ROUTE
app.delete("/blogs/:id/", function(req, res){
    Blog.findByIdAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    });
});

app.listen("3000", function(){
    console.log("Server is running...");
});