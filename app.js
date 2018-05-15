const express=require('express');
const productRoutes=require('./api/routes/products');
const orderRoutes=require('./api/routes/orders')
const userRoutes=require('./api/routes/user');
const app=express();
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');


mongoose.connect('mongodb://piyushamola:'+process.env.MONGO_PW+'@ds119150.mlab.com:19150/node_shop_project')

//logger middleware for node.js
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// handling CORS Errors
app.use((req,res,next)=>{
     res.header('Access-Control-Allow-Origin','*'); // * can be replaced by any url if particular access is required
     res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'           
    );
    if(req.method === 'OPTIONS')
    {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET, PATCH');
        return res.status(200).json({});
    }
    next();
});
// routes which should handle request
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);

app.use((req,res,next)=>{
    const error=new Error('Not found');
    error.status=404;
    next(error);
});

app.use((error,req,res,next)=>{
       res.status(error.status || 500);
       res.json({
           error:{
           message:error.message
           }
       });
});

module.exports=app;