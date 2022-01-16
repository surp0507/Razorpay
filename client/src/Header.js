import React from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { Paper,Grid,Container } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import { Box } from '@material-ui/core'; 
import {Button} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import { useEffect,useState } from 'react';
import { makeStyles } from '@material-ui/core';
import {useNavigate} from 'react-router-dom'
import  axios from 'axios'

const useStyles=makeStyles({
paperStyle:{
  width:'250px',
  height:'300px',
  margin:'10px 5px'

},
mainPaper:{
  display:'flex',
  height:'70vh',
  width:'80vw'
 
 

 
},
img:{
  objectFit:'cover',
  width:'150px',
  height:'190px'

},
purchaseResult:{
  marginTop:56,
  width:'100%',

},
result:{
  textAlign:'center',
  margin:'20px 15px'
}

})

const baseUrl=`http://localhost:8000`;

export const Header = () => {
  const navigate=useNavigate()
const classes=useStyles();
  const [products,setProducts]=useState([]);
  const [paymentId,setPaymentId]=useState('')
  const [show,setShow]=useState(false)
  const [signature,setSignature]=useState('')
  const [orderId,setOrderId]=useState('')
  const [toggle,setToggle]=useState(false)

console.log(products)
const requestProducts= async ()=>{
const response =await  axios.get(`${baseUrl}/products`);
console.log(response.data.products)
setProducts(response.data.products)

}

useEffect(()=>{
  requestProducts()

},[])


const buyProduct= async (productId)=>{

  const res=await axios.get(`${baseUrl}/order/${productId}`)
  console.log(res.data.id)
  if(res.status!==200){
    return;
  }
  var options = {
    key: "rzp_test_oXFn7Va0xigtjb", 
    amount: res.data.amount,
    currency: res.data.currency,
    name: "Acme Corp",
    description: res.data.notes.desc,
    // image: "https://example.com/your_logo",
    order_id: res.data.id, 
    handler: function (response){
        // alert(response.razorpay_payment_id);
        // alert(response.razorpay_order_id);
        // alert(response.razorpay_signature)
        setPaymentId(response.razorpay_payment_id)
        setOrderId(response.razorpay_order_id)
        setSignature(response.razorpay_signature)
        setShow(true)
       

    },
    prefill: {
        name: "kwality oil & chemicals",
        email: "kwalityOil@example.com",
        contact: "9894567890"
    },
   
};
var rzp1 = new window.Razorpay(options);
      rzp1.open();
rzp1.on('payment.failed', function (response){
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
});

}


    return (
        <div>
               <AppBar position="static" >
        <Toolbar variant="dense">
          <IconButton edge="start"  color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" color="inherit">
          Razorpay
          </Typography>
        </Toolbar>
      </AppBar>
    {!show &&
    <Paper style={{margin:'20px 0px'}}><Typography variant='h4' style={{textAlign:'center',marginTop:20}}
    color="secondary"> Welcome to the store
     </Typography>   </Paper>

    }
     
      
      <Container maxWidth="md"  >

        {!show?
        <Grid container spacing={3} className={classes.mainPaper}>
         {products.map(product=>(   
         
            <Grid item xs={4}  key={product.id} >
              <Paper  elevation={3} >
                <img src={product.image} alt="" className={classes.img} />
                <Typography>{product.title}</Typography>

                <Typography><span style={{color:'red'}}>{product.currency} {product.price} </span></Typography>
                <Button variant='contained' color="secondary"
                onClick={()=>buyProduct(product.id)}
                >Buy</Button>
              </Paper>
            </Grid>
               
       
           ))}
        </Grid>
          :

          <Grid item xs={12}>
            <Paper className={classes.purchaseResult}>
            <Typography variant='h4' style={{color:'green',textAlign:'center',margin:'15px 0px'}}>Thankyou for purchasing the products</Typography>
           <Box className={classes.result}>   
          <Typography><span style={{color:'red'}}>PaymentId-</span>  {paymentId}</Typography>
          <Typography><span style={{color:'red'}}>OrderId:-</span>{orderId}</Typography>
          <Typography> <span style={{color:'red'}}>RazorPay Signature:-</span>{signature}</Typography>
          </Box>
            </Paper>
          </Grid>
        
         }

      </Container>
        </div>
    )
}
