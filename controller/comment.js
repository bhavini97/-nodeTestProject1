const connection = require('../models/db');

const postCmnt = (req,res)=>{
    const { blog_id, content } = req.body;

    if (!blog_id || !content) {
        console.error("Missing blog_id or content:", req.body);
        return res.status(400).json({ message: "Blog ID and content are required!" });
    }

    const sql = "INSERT INTO comments (blog_id, content) VALUES (?, ?)";

    connection.query(sql, [blog_id, content], (err, result) => {
        if (err) {
            console.error("Error inserting comment:", err.sqlMessage);  // Log SQL error
            return res.status(500).json({ error: "Error adding comment" });
        }
        console.log("Comment added:", result);
        res.status(201).json({ id: result.insertId, content });
    });
}

const deleteComment = (req,res)=>{
    const commentId = req.params.id;

    if (!commentId) {
        return res.status(400).json({ error: "Comment ID is required" });
    }

    const sql = "DELETE FROM comments WHERE id = ?";

    connection.query(sql, [commentId], (err, result) => {
        if (err) {
            console.error("Error deleting comment:", err.sqlMessage);
            return res.status(500).json({ error: "Error deleting comment" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Comment not found" });
        }

        console.log("Comment deleted:", commentId);
        res.status(200).json({ message: "Comment deleted successfully" });
    });

}
module.exports ={
    postCmnt,
    deleteComment
}
