const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const bodyParser = require('body-parser');
// const bcrypt = require('bacryptjs/dist/bcrypt');
const mongoose = require('mongoose');
const User = require('../models/users');
const path = require('path');
const jwt = require('jsonwebtoken');
// const { json } = require('body-parser');
const JWT_SECRET = process.env.JWT_SECRET || 'aalskdujghfasdfbao76a68T3GH39087987(&^&%^LASJDF%$';
const fs = require('fs').promises;



router.use(bodyParser.json());
router.use('/upload/csv', bodyParser.text({type:'.csv'}));

//login route handler
router.post('/login', async (req, res)=>{
    const { username, password } = req.body;

    const user = await User.findOne({username, password}).lean();

    if(!user){
        return res.json({status: 'error', error: 'Invalid username/password!'});
    }

    //the username/password combo was successful
    if(user){
        //generate json webtoken
        const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
        console.log(token);
        return res.json({status: 'ok', data: token});
    }
    return json({status: 'error', error: 'Invalid username/password!'});
});

router.post('/upload', async (req, res)=>{
    const {token} = req.body;

    try{
        const user_token = jwt.verify(token, JWT_SECRET);
        console.log(user_token);
        const _id = user_token.id;
        const user = await User.findOne({_id});
        const {username} = user;
        return res.json({status: 'ok', data: {username}});
    }catch{
        res.json({status: 'error', error: 'Could not verify signature!'});
    }
});

const csvUpload = upload.fields([{name: 'questions', maxCount: 1}, {name: 'answers', maxCount: 1}]);
router.post('/upload/csv', csvUpload, async (req, res)=>{
    // let { questions, answers } = req.body;
    // let {quesFormData, ansFormData} = req.file;

    // console.log(req.file);
    // const quesCSV = req.file.buffer.toString('utf8');
    // console.log(quesCSV);
    // const quesCSV = req.file.buffer.toString('utf8');
    // console.log(quesCSV);

    const quesCSV = req.files['questions'][0].buffer.toString('utf8');
    const ansCSV = req.files['answers'][0].buffer.toString('utf8');
    console.log(ansCSV);

    // await fs.writeFile('./public/csv/questions1.csv', quesCSV, (err)=>{
    //             if(err){
    //                 throw err;
    //             }
    //         });


    // try{
    // await fs.unlink('./public/csv/questions.csv', (err)=>{
    //     if(err){
    //         throw err;
    //     }
    //     await fs.writeFile('./public/csv/questions.csv', questions, (err)=>{
    //         if(err){
    //             throw err;
    //         }
    //         console.log('questions.csv updated!')
    //     });
    // });
    // }catch{
    //     res.json({status: 'error', error: 'Could not update questions/answers!'});
    // }

    // try{
    //     await fs.writeFile('./public/csv/questions1.csv', questions, (err)=>{
    //         if(err){
    //             throw err;
    //         }
    //         console.log('questions1.csv created!')
    //     });
    // }catch(e){

    // }
    

    res.json({status: 'ok'});
});



module.exports = router;