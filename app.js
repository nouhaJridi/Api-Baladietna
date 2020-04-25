const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');     
const userRoutes = require('./api/routes/user');
const reclamRoutes = require('./api/routes/reclamation');
const orderRoutes = require('./api/routes/order');

mongoose
    .connect('mongodb+srv://nouha:kfjX4OBPNUNxhJmg@cluster0-hmmd0.mongodb.net/test?retryWrites=true&w=majority', { 
        useNewUrlParser: true,
        useCreateIndex: true,
		useUnifiedTopology: true
      })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));



app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
   res.header('Access-Control-Allow-Origin','*');
   res.header('Access-Control-Allow-Headers','Origin, X-Requested-With , Content-Type , Accept, Authorization');
   if ( req.method === 'OPTIONS') {
   	res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, GET, DELETE');
   	return res.status(200).json({});
   }
   next();
});

app.use('/reclamation',reclamRoutes);
app.use('/user',userRoutes);
app.use('/order',orderRoutes);


app.use((req,res,next) => {
	const error = new Error('Not found');
	error.status= 404;
	next(error);
});

app.use((error , req , res , next)=> {
	res.status(error.status || 500);
	res.json({
		error : {
          message :error.message
		}
	});
})




module.exports = app ;