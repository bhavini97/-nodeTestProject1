document.addEventListener("DOMContentLoaded", () => {
    console.log("Page Loaded - Fetching Blogs"); // Debugging line
    fetchBlogs();
});
async function fetchBlogs() {
    try {
        const res = await fetch("http://localhost:3000/blogs");

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const blogs = await res.json();
        console.log("Fetched Blogs:", blogs); // Debugging step

        if (!Array.isArray(blogs)) {
            throw new Error("Invalid response format: Expected an array");
        }

        displayBlogs(blogs);
    } catch (error) {
        console.error("Error fetching blogs:", error);
    }
}
    

function displayBlogs(blogs) {
    if (!Array.isArray(blogs)) {
        console.error("Invalid blogs data:", blogs);
        return;
    }

    const blogContainer = document.getElementById("blogContainer");
    blogContainer.innerHTML = "";

    blogs.forEach(blog => {
        console.log("Rendering Blog:", blog); // Debugging step
        const comments = Array.isArray(blog.comments) ? blog.comments : [];
        const blogPost = document.createElement("div");
        blogPost.classList.add("blog-post");
        blogPost.innerHTML = `
            <h3>${blog.title}</h3>
            <p><strong>By:</strong> ${blog.author}</p>
            <p>${blog.content}</p>
             <h4>Comments</h4>
                    <div id="comments-${blog.id}">
                        ${blog.comments.map(comment => `
                            <div class="comment">
                                ${comment.content} 
                                <button onclick="deleteComment(${comment.id})">Delete</button>
                            </div>
                        `).join("")}
                    </div>

                    <div class="comment-box">
                        <input type="text" id="comment-${blog.id}" placeholder="Add a comment...">
                        <button onclick="addComment(${blog.id})">Add</button>
                    </div>
        `;

        blogContainer.appendChild(blogPost);
    });
}

    async function addBlog() {
        const title = document.getElementById("title").value.trim();
        const author = document.getElementById("author").value.trim();
        const content = document.getElementById("content").value.trim();
    
        if (!title || !author || !content) {
            alert("Please fill all fields!");
            return;
        }
    
        console.log("Sending Blog Data:", { title, author, content }); // Debugging
    
        try {
            const res = await fetch("http://localhost:3000/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, author, content }) // Convert to JSON
            });
    
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
    
            console.log("Blog added successfully.");
            fetchBlogs();  // Refresh blog list
        } catch (error) {
            console.error("Error adding blog:", error);
        }
    }


async function deleteComment(commentId) {
    console.log("Deleting Comment ID:", commentId);  // Debugging

    try {
        const res = await fetch(`http://localhost:3000/comments/${commentId}`, {
            method: "DELETE"
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        console.log("Comment deleted successfully.");
        fetchBlogs();  // Refresh comments
    } catch (error) {
        console.error("Error deleting comment:", error);
    }
}
async function addComment(blogId) {
    const commentContent = document.getElementById(`comment-${blogId}`).value.trim();

    if (!commentContent) {
        alert("Please enter a comment.");
        return;
    }

    console.log("Sending Comment:", { blog_id: blogId, content: commentContent }); // Debugging

    try {
        const res = await fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ blog_id: blogId, content: commentContent })
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        console.log(" Comment added successfully.");
        fetchBlogs();  // Refresh comments
    } catch (error) {
        console.error(" Error adding comment:", error);
    }
}

