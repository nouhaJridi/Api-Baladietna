const mongoose = require('mongoose');



const orderSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    reclamation: {type : mongoose.Schema.Types.ObjectId , ref: 'Reclamation',required:true},
    responsible :{type : String}
});

module.exports = mongoose.model('Order', orderSchema)