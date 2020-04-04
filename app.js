const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require ('body-parser');
const mongoose = require('mongoose');     
const userRoutes = require('./api/routes/user');



mongoose
    .connect('mongodb+srv://nouha:kfjX4OBPNUNxhJmg@cluster0-hmmd0.mongodb.net/test?retryWrites=true&w=majority', { 
        useNewUrlParser: true,
        useCreateIndex: true
      })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use((req,res,next)=>{
   res.header('Access-Control-Allow-Origin','*');
   res.header('Access-Control-Allow-Headers','Authorization');
   if ( req.method === 'OPTIONS') {
   	res.header('Access-Control-Allow-Methods','PUT, POST, PATCH, GET, DELETE');
   	return res.status(200).json({});
   }
   next();
});

app.use('/user',userRoutes);

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