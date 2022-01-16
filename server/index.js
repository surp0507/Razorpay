const express= require("express");
const cors= require("cors");
const Razorpay= require("razorpay");
const products=require("./src/products")


const app=express();
const key_id='rzp_test_oXFn7Va0xigtjb'
const key_secret="Iegpo3py3Neqn82B16OMR8bh"
const  instance = new Razorpay({
    key_id,
    key_secret,
  });
app.use(cors());
app.use(express.json());
const PORT=8000;

app.get('/products', (req,res)=>{

    res.status(200).json(products);
})

app.get('/order/:productId',(req,res)=>{
    const {productId}= req.params;
   const product= products.products.find(product=>product.id==productId);

   const amount=product.price*100*70;
   const currency='INR'
   const receipt='receipt#123'
   const notes={desc:product.description}
   instance.orders.create({amount,currency,receipt,notes},(error,order)=>{
       if(error){
           return res.status(500).json(error)
       }
       return res.status(200).json(order)
   });
  

})

app.listen(PORT, ()=>{
    console.log(`server is listining on port ${PORT}`)
})
