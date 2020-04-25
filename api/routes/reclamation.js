const express = require('express');
const router = express.Router();

const checkAuth = require ('../middleware/check-auth');
const ReclamationsController = require('../controllers/reclamations');

const multer = require('multer');
const storage = multer.diskStorage({
   destination: function (req, file , cb) {
       cb(null,'./uploads/');

   } ,
    filename: function (req,file,cb) {
       cb(null,file.originalname);

    }
});

const fileFilter =(req,file,cb)=> {
    //reject a file
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);
    }
    else{
        cb(null,false);
    }
}
const upload = multer({
    storage : storage ,
    Limits : {
      fileSize : 1024*1024*5
    },
    fileFilter:fileFilter});




router.get('/',ReclamationsController.reclamations_get_all);

router.post('/',checkAuth,upload.single('reclamationImage'),ReclamationsController.reclamations_create_reclamation);

router.get('/:reclamId',ReclamationsController.reclamations_get_reclamation);

router.patch('/:reclamId',checkAuth,ReclamationsController.reclamations_update_reclamation);

router.delete('/:reclamId',checkAuth,ReclamationsController.reclamations_delete_reclamation);

module.exports = router;