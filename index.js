const express = require('express');
const app = express();
const port = 2003;

// passing json req
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const mongoose = require("mongoose")

//connect
mongoose.connect("mongodb://127.0.0.1:27017/MyDatabase").then(()=>{
    console.log("mongodb connected")
}).catch(err=>{
    console.log(err)
})
const User=require("./contactmodel")

//creation of user POST req - middleware
app.post("/createContact/",async(request, response)=>{
    try {
        const {firstName,lastName,email,phoneNumber}=request.body;
        const user = new User({firstName,lastName,email,phoneNumber});
        await user.save();
        response.status(200).json({message:"user successfully created"});
    }catch(err){
        console.error(err);
        response.status(500).json({message:"Error While Creating user"})
    }
});

//get request for specified user
app.get("/finduser/:id",async(request,response)=>{
    try{
        const userid =request.params.id; //to getting id

        const user= await User.findById(userId); //find by user id 
        if(!user){
            response.status(404).json({message:"User not Found"});
        }
        response.status(200).json(user);
    }catch(error){
        console.error(error);
        response.status(500).json({message:"Internal Server Error"})
    }
})
//put request
app.put("/edituserById/:id",async(req,res)=>{
    try{
        const userId = req.params.id;
        const {firstName,lastName,email,phoneNumber}=req.body;
        //update
        const user=await User.findByIdAndUpdate(userId,{firstName,lastName,email,phoneNumber},{new:true});
        if(!user){
            res.status(404).json({message:"user not found"})
        }
        res.status(200).json(user)
    }catch{
        res.status(500).json({message:"Internal Server Error"})
    }
})


//Get Request (get all users)
app.get("/getallusers",async(req,res)=>{
    try{
        const users=await User.find();
        res.status(200).json(users);
    }catch(error){
        console.error(error);
        res.status(500).json({message:"Internal Server Error"});
    }
});

//delete
app.delete("/deleteuser/:id",async(req,res)=>{
    try{
        const userId =req.params.id;
        const user=await User.findByIdAndDelete(userId);
        if(!user){
            res.status(404).json({message:"user not found"});
        }
        res.status(200).send("User Deleted Successfully..!");

    }catch{
        res.status(500).json({message:"Internal Server Error"});
    }
})

app.listen(port,()=>{
    console.log("Port running on ",`${port}`)
})