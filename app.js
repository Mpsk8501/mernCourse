const express = require('express');
const app =express();
const mongoose = require('mongoose');
const path = require("path");

const config = require('config');
const PORT = config.get('port')||5000;

app.use(express.json({extended:true}));

app.use('/api/auth',require('./routs/auth.routes'));
app.use('/api/link',require('./routs/link.routes'));
app.use('/t',require('./routs/redirect.routes'));

if(process.env.NODE_ENV === 'production'){
    app.use('/',express.static(path.join(__dirname,'client','build')));
    app.use('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}


async function start(){
    try {
        await mongoose.connect(config.get("mongoUri"), {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useCreateIndex:true,

        });
        app.listen(PORT,()=>console.log(`server started on port ${PORT}`));
    }catch (e) {
        console.log('Server error', e.message);
        process.exit(1)
    }
}

start();


