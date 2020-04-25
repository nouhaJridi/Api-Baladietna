const mongoose = require('mongoose');



const reclamSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    type: {type : String , required: true},
    description: {type : String },
    lieu:{type : String },
    date:{type : String },
    state:{type : String , required: true},
    reclamationImage:{type : String }
});

module.exports = mongoose.model('Reclamation', reclamSchema)