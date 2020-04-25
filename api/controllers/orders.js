const Order = require("../models/order");
const Reclamation = require("../models/reclamation");
const mongoose = require('mongoose');

exports.orders_get_all =(req, res, next)=> {
    Order.find()
        .select('responsible reclamation _id')
        .populate('reclamation','_id type date state')
        .exec()
        .then( docs =>
        {   const response={
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    id:doc._id,
                    reclamation:doc.reclamation,
                    responsible:doc.responsible,
                    request : {
                        type:'GET',
                        url:'http://localhost:4000/order/'+doc._id
                    }
                }
            })
        }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })

}

exports.orders_get_by_id = (req, res, next)=> {
    const  id = req.params.orderId;
    Order.findById(id)
        .select('responsible reclamation _id')
        .populate('reclamation')
        .exec()
        .then(doc => {
            console.log("From database",doc);
            if(doc){
                res.status(200).json({
                    Order:doc,
                    request:{
                        type:'GET',
                        description: 'GET ALL ORDERS',
                        url:'http://localhost:4000/order'
                    }
                });
            }
            else {
                res.status(404).json({message: 'No valid entry found for provided ID'});
            }

        })
        .catch( err =>
        {console.log(err);
            res.status(500).json({error : err });
        });
}

exports.orders_create_order = (req, res, next)=> {
    Reclamation.findById(req.body.reclamationId)
        .then( reclamation => {
            if(!reclamation){
                return res.status(404).json({
                    message:'Id reclamation not found'
                });
            }
            const order = new Order({
                _id : new mongoose.Types.ObjectId(),
                responsible: req.body.responsible,
                reclamation: req.body.reclamationId,
            });
            return order.save()
        }).then( result => {
        console.log(result);
        res.status(201).json({
            message:"Create Order successfully",
            createdOrder: {
                id: result._id,
                reclamation: result.reclamation,
                responsible: result.responsible,
                request: {
                    type: 'GET',
                    url: 'http://localhost:4000/order/' + result._id
                }
            }
        })
            .catch(err =>
                {console.log(err);
                    res.status(500).json({
                        error:err
                    })}
            );});

}

exports.orders_delete_order =(req, res, next)=> {
    const  id = req.params.orderId;
    Order.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                request:{
                    type:'POST',
                    url:'http://localhost:4000/order',
                    body : {
                        reclamationId:'ObjectId',
                        responsible:'String',
                    }
                }
            });
        })
        .catch(err =>{
            console.log(err);
            res.status(500).json({
                error : err
            });
        });
}