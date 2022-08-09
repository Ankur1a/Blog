const express = require("express");

const router = express.Router();
const db = require("../data/database");

router.get("/", function(req, res){
    res.redirect("/posts");
});

router.get("/posts", async function(req, res){
    const [data] = await db.query("SELECT posts.*, authors.name AS author_name FROM blogs.posts INNER JOIN authors ON posts.author_id = authors.id");
    res.render("posts-list", {data: data});
});

router.get("/new-post", async function(req, res){
    const [authors] = await db.query("SELECT * FROM authors");
    res.render("create-post", {authors: authors});
});

router.post("/new-post", async function(req, res){
    const response = [
        req.body.title, 
        req.body.summary, 
        req.body.content, 
        req.body.author
    ];
    await db.query("INSERT INTO posts (title, summary, body, author_id) VALUES (?)", [response] );
    res.redirect("/posts");
});

router.get("/posts/:id", async function(req, res){
    const query = `
    SELECT posts.*, authors.name AS author_name, authors.email AS author_email FROM posts
    INNER JOIN authors ON posts.author_id = authors.id 
    WHERE posts.id = ?`;

    const [posts] = await db.query(query, [req.params.id]);

    if(!posts || posts.length ===0) {
        return res.status(404).render("404");
    };

    res.render("post-detail", {post: posts[0]});
});

router.get("/posts/:id/edit", async function(req, res){
    const query = `SELECT * FROM posts WHERE posts.id = ?`;
    const [post] = await db.query(query, [req.params.id]);
    
    if(!post || post.length ===0) {
        return res.status(404).render("404");
    };

    res.render("update-post", {post: post[0]});
});

router.post("/posts/:id/update", async function(req, res){
    const query =`UPDATE posts SET title = ?, summary = ?, body = ? WHERE posts.id =?`;
    const values = [req.body.title, req.body.summary, req.body.content, req.params.id];
    await db.query(query, values);
    res.redirect("/posts");
});

router.post("/posts/:id/delete", async function(req, res){
    const query = "DELETE FROM posts WHERE id=?";
    await db.query(query, [req.params.id]);
    res.redirect("/posts");
});

module.exports = router;