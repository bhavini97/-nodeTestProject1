const mysql = require('mysql2')

const connection= mysql.createConnection({
    host:"localhost",
    user:'root',
    password:'root',
    database:'blogDB'
}  
)
connection.connect((error)=>{
    if(error) throw error;
    console.log('connection successful')
})
module.exports= connection