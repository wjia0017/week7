let mongoose = require('mongoose');


let TasksSchema = mongoose.Schema({
    taskId: {
        type:Number,
       required: true
    },
    Taskname:{
        type: String,
    },
    AssignTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Developers'
    },
    DueDate:{
        type: Date,
    },
    TaskStatus:{
        type: String,
        validate:{
            validator: function(TaskStatusVal){
                return TaskStatusVal === "inProgress" || TaskStatusVal === "complete";
            },
            message: 'TaskStatusVale should be either inProgress or complete'
        },
     },
     TaskDesc:{
         type:String
     },

})
module.exports = mongoose.model('Tasks', TasksSchema);
