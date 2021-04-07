const express = require('express')
const app = express()
const sqlite = require('sqlite3').verbose()
const http = require('http');
const path = require('path')
var server = http.createServer(app)
const helmet = require('helmet')
app.use(helmet());
app.use(express.static('html'));
let db = new sqlite.Database('./database.db')


const bodyParser = require('body-parser');
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

/*app.get('/users',function(req,res){
    const query = "SELECT * FROM users";
    db.all(query.function(err,rows),{
        if(err){throw err}
        res.json({
            "data" : rows
        })
    });
})*/

app.use(express.static(path.join(__dirname, './html')));



db.run('CREATE TABLE if not exists userss (name	TEXT,email	TEXT,password	TEXT,address	TEXT,phone	INTEGER,PRIMARY KEY(email))');
app.get('/', function (req, res) {
   
    res.sendFile(__dirname + ('/index.html'));

})

/*db.run('INSERT into users(name,email,password,address,phone)values("kiran","kiran@gmail.com","12345","7628wildfern dr","1231233456")',function(err,row){
    if(err){
        console.log(err.message)
    }
    console.log("entry added to table")
})*/

//INSERT RECORD or ADD NEW USER
app.post('/add', function (req, res) {
    db.serialize(()=>{
        
    db.run('INSERT into users(name,email,password,address,phone) VALUES (?,?,?,?,?)',[req.body.name,req.body.email,req.body.password,req.body.address,req.body.phone],function(err){
    if(err){  return console.log(err.message);}
    console.log("new user added");
    res.send("New user has been added into the database with email="+req.body.email+ " and name = "+req.body.name);
   
})
})
});

//VIEW
app.post('/view',function(req,res){
    db.serialize(()=>{
        db.each('SELECT name NAME,email email, password password, address address, phone phone FROM users WHERE email =?', [req.body.email],function(err,row){
            if(err){
                res.send("Error encountered while displaying the information");
                return console.error(err.message);
            }
            res.send(' NAME: ${row.name}, email :${row.email}, password : ${row.password}, address :${row.address}, phone :${row.phone}');
            console.log("Entry displayed successfully");
        });
    });
});

server.listen(3002,function(){
    console.log('app listening at 3000');
});



