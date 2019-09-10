let mongoose = require('mongoose');

let DeveloperSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        firstname:{
            type: String,
            required: true
        },
        lastname:{
            type:String,
        },
    },
    level:{
        type: String,
        validate:{
            validator: function(levelVal){
                return levelVal === "Expert" || levelVal === "Beginner";
            },
            message:'The level can be either Expert or Beginner'
        },
        required: true
    },
    Address:{
        State:{
            type: String,
        },
 
        Suburb:{
         type: String,
        },
 
        Street:{
            type: String,
        },
 
        Unit:{
          type: Number,
           validate:{
             validator: function (UnitVal){
                 return UnitVal > 0;
             },
             message: 'Unit number must be positive'
           },
        },
 
     }

});
module.exports = mongoose.model('Developers', DeveloperSchema);//create module
