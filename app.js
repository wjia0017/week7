var express = require("express");
const mongodb = require('mongodb');
let bodyParser = require('body-parser');

var app = express();

//setup the view Engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

//setup the static assets directories
app.use(express.static('image'));
app.use(express.static('css'));
app.set(express.static('view'));

app.use(bodyParser.urlencoded({
    extended: false
 }));

app.listen(8080);
console.log("Sever running at http://localhost:8080");

let mongoose = require('mongoose');

let Tasks = require('./models/tasks.js');
let Developers = require('./models/developers.js');

mongoose.connect('mongodb://localhost:27017/fit2095db', function (err){
    if(err){
        console.log('Error in Mongoose Connection');
        throw err;
    }
    console.log('Connect successful');
});

/*HomePage*/
app.get('/', function(req,res){
    res.sendFile(__dirname + '/views/index.html');
});


//*List All Tasks */
app.get('/listTasks', function(req,res){
    Tasks.find({}, function (err, data){
         res.render("listTasks", {tasks: data});
     });
 });


//*Insert A Developer */
app.get('/NewDeveloper', function(req,res){
    res.sendfile(__dirname + '/views/NewDeveloper.html');
});


app.post('/NewDeveloper', function (req,res){
    let developer = new Developers({
        _id: mongoose.Types.ObjectId(),
        name:{
            firstname:req.body.firstname,
            lastname: req.body.lastname,
        },
        level:
            req.body.level,
       
        Address: {
            State: req.body.State,
            Suburb: req.body.Suburb,
            Street: req.body.Street,
            Unit: req.body.Unit
        },
    });
    developer.save(function (err) {
        if(err) throw err;
        console.log('Developer successfully added to DB');
    });
    res.redirect('/listDevelopers');
});


//*List All Developers */
app.get('/listDevelopers', function (req,res){
    Developers.find({}, function(err, data){
        res.render('listDevelopers', {developers: data});
    });
});



//*Update A Task*/
app.get('/updateTask', function(req,res){
  res.sendFile(__dirname +'/views/updateTask.html');
});

app.post('/updateTaskdata', function(req,res){
    // let ID = new mongoose.Types.ObjectId(req.params.taskid);
    // Tasks.updateOne({_id : ID}, {$set: {taskstatus: req.body.taskstatus}}, function(err, result){
    Tasks.updateOne({taskId:parseInt(req.body.taskId)}, {$set: {TaskStatus: req.body.TaskStatus}}, function(err, result){
        res.redirect('/listTasks');
    });
});


//*Delete A Task */
app.get('/deleteTask', function(req, res){
    res.sendFile(__dirname + '/views/deleteTask.html');
});

app.post('/deleteTaskdata', function(req,res){
    // let ID = new mongoose.Types.ObjectId(req.params.taskid);
    // Tasks.deleteOne({_id:ID}, function(err, result){
    Tasks.deleteOne({taskId: parseInt(req.body.taskId)}, function(err, result){
        console.log(result);
        res.redirect('/listTasks');
  });
});


//*Delete Completed Tasks */
app.get('/deleteTaskComplete', function (req,res){
    res.sendFile(__dirname + '/views/deleteTaskComplete.html');
  });

app.post('/deletetaskdatecompleted', function(req,res){
    Tasks.deleteMany({TaskStatus: 'complete'}, function(err){
        res.redirect('/listTasks');
    });                                                                                                                                                                                                        
});

app.get('/getTask', function(err,res){
    Developers.find().populate('DeveloperSchema').exec((err,result)=>{
        if(err){
            console.log(err)
        }
        res.send(result);
})
})
//*Insert A Task */
app.get('/NewTask',function (req,res) {
    res.sendFile(__dirname + '/views/NewTask.html');
    })


app.post('/addTask', function (req,res){
    req.body.taskId = getNewID();
 
   let task = new Tasks({
        //  _id: new mongoose.Types.ObjectId,
        taskId: req.body.taskId,
        Taskname: req.body.Taskname,
        DueDate:req.body.DueDate,
        TaskDesc: req.body.TaskDesc,
        AssignTo: req.body.AssignTo,
        TaskStatus: req.body.TaskStatus,
    });
    task.save(function (err){
        if(err) throw err;
        console.log('Tasks successfully Added to DB');
    });
    res.redirect('/listTasks');
});

function getNewID(){
    return (Math.floor(100000 + Math.random() * 900000));
}

