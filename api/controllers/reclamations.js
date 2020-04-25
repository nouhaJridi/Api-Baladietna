const Reclam = require("../models/reclamation");
const mongoose = require('mongoose');

exports.reclamations_get_all = (req, res, next)=> {
    Reclam.find()
        .select('type description lieu date state _id reclamationImage')
        .exec()
        .then( docs =>
        {   const response={
            count: docs.length,
            reclamations: docs.map(doc => {
                return {
                    type:doc.type,
                    lieu:doc.lieu,
                    date:doc.date,
                    id:doc._id,
                    state:doc.state,
                    description:doc.description,
                    reclamationImage: doc.reclamationImage,
                    request : {
                        type:'GET',
                        url:'http://localhost:4000/reclamation/'+doc._id
                    }
                }
            })
        }
            //if(docs.length >=0){
            res.status(200).json(response);
            //}
            //else {
            //    res.status(404).json({
            //        message : " No entries found"});
            //}
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })

}



exports.reclamations_create_reclamation=(req, res, next)=> {
    const reclam = new Reclam({
        _id : new mongoose.Types.ObjectId(),
        type: req.body.type,
        description: req.body.description,
        lieu:req.body.lieu,
        date:req.body.date,
        state:req.body.state,
        reclamationImage: req.file.path

    });
    reclam.save().then( result => {
        console.log(result);
        res.status(201).json({
            message:"Create Reclamation successfully",
            createdReclamation: {
                type: result.type,
                lieu: result.lieu,
                date: result.date,
                id: result._id,
                state: result.state,
                description: result.description,
                request: {
                    type: 'GET',
                    url: 'http://localhost:4000/reclamation/' + result._id
                }
            }
        });
    })
        .catch(err =>
            {console.log(err);
                res.status(500).json({
                    error:err
                })}
        );
}

exports.reclamations_get_reclamation = (req, res, next)=> {
    const  id = req.params.reclamId;
    Reclam.findById(id)
        .select('type description lieu date state _id reclamationImage')
        .exec()
        .then(doc => {
            console.log("From database",doc);
            if(doc){
                res.status(200).json({
                    Reclamation:doc,
                    request:{
                        type:'GET',
                        description: 'GET ALL RECLAMATION',
                        url:'http://localhost:4000/reclamation'
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

exports.reclamations_update_reclamation=(req, res, next)=> {
    const  id = req.params.reclamId;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propType] = ops.value;
    }
    Reclam.update({_id:id},{$set : updateOps})
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message:'RECLAMATION UPDATED',
                request:{
                    type:'GET',
                    url:'http://localhost:4000/reclamation/'+ id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error : err
            });
        });
}

exports.reclamations_delete_reclamation = (req, res, next)=> {
    const  id = req.params.reclamId;
    Reclam.remove({_id:id})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Reclamation deleted',
                request:{
                    type:'POST',
                    url:'http://localhost:4000/reclamation',
                    body : {
                        type:'String',
                        description:'String',
                        lieu:'String',
                        date:'Date',
                        state:'String'
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
