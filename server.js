const path = require('path');
const http = require('http');
const express = require('express');
const port = process.env.PORT||3000;

const app =express();

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
    res.sendFile('/index.html');
});

app.listen(port,()=>{
    console.log(`Server is up at ${port}`);
})