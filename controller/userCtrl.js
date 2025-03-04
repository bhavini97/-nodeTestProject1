const connection = require('../models/db');

const addBlog = (req,res)=>{
    const sql = `
        SELECT blogs.id, blogs.title, blogs.author, blogs.content, 
               IFNULL(JSON_ARRAYAGG(
                   JSON_OBJECT('id', comments.id, 'content', comments.content)
               ), '[]') AS comments
        FROM blogs
        LEFT JOIN comments ON blogs.id = comments.blog_id
        GROUP BY blogs.id;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: "Error fetching blogs" });
            return;
        }
        results.forEach(blog => {
            try {
                blog.comments = JSON.parse(blog.comments); // Convert from string to array (to use .map properly)
                if (!Array.isArray(blog.comments)) {
                    blog.comments = []; // If parsing fails, reset to empty array
                }
            } catch (error) {
                console.error("Error parsing comments:", error);
                blog.comments = []; // Fallback to empty array
            }
        });

        console.log("Sending Blogs:", results);
        res.json(results);
    });
    
}

const postBlog = (req, res) => {
    
        const { title, author, content } = req.body;
    
        console.log("Incoming Blog Data:", req.body); // Debugging step
    
        if (!title || !author || !content) {
            console.error("Missing fields:", req.body);
            return res.status(400).json({ message: "All fields are required!" });
        }
    
        const sql = "INSERT INTO blogs (title, author, content) VALUES (?, ?, ?)";
    
        connection.query(sql, [title, author, content], (err, result) => {
            if (err) {
                console.error("Error inserting blog into MySQL:", err.sqlMessage);
                return res.status(500).json({ error: "Error adding blog", details: err.sqlMessage });
            }
            console.log(" Blog added successfully:", result);
            res.status(201).json({ id: result.insertId, title, author, content });
        });
    }
module.exports={
    addBlog,
    postBlog
}