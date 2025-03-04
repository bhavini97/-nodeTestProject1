const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const blog = require('./controller/userCtrl')
const comment = require('./controller/comment');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/public/blog.html');
})

app.get('/blogs',blog.addBlog);
app.post('/blogs',blog.postBlog);
app.post('/comments',comment.postCmnt);
app.delete('/comments/:id',comment.deleteComment);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});