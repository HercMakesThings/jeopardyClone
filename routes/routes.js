if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

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
// const JWT_SECRET = process.env.JWT_SECRET || 'aalskdujghfasdfbao76a68T3GH39087987(&^&%^LASJDF%$';
const JWT_SECRET = process.env.JWT_SECRET;
const fs = require('fs').promises;




router.use(bodyParser.json());
router.use('/upload/csv', bodyParser.text({type:'.csv'}));

// router.get('/jeopardy', (req, res)=>{
//     res.sendFile(path.join(__dirname, '/public/jeopardy.html'));
// });

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

router.post('/login/check', async (req, res)=>{
    const {token} = req.body;

    try{
        const user_token = jwt.verify(token, JWT_SECRET);
        // console.log(user_token);
        const _id = user_token.id;
        const user = await User.findOne({_id});
        const {username} = user;
        return res.json({status: 'logged in!', data: {username}});
    }catch{
        res.json({status: 'not logged in!'});
    }
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
        res.json({status: 'error', error: 'Could not verify signature!', redirectURL: 'http://localhost:3001'});
    }
});

const csvUpload = upload.fields([{name: 'questions', maxCount: 1}, {name: 'answers', maxCount: 1}]);
router.post('/upload/csv/:user', csvUpload, async (req, res)=>{

    const quesCSV = req.files['questions'][0].buffer.toString('utf8');
    const ansCSV = req.files['answers'][0].buffer.toString('utf8');
    // console.log(ansCSV);
    const teacher = req.params.user;
    console.log(teacher);

    try{
        //delete and replace questions.csv with input from new.html
        await fs.unlink(`./public/csv/${teacher}/questions.csv`, (err)=>{
            if(err){
                throw err;
            }
        }).then(()=>{
            fs.writeFile(`./public/csv/${teacher}/questions.csv`, quesCSV, (err)=>{
                if(err){
                    throw err;
                }
                // return console.log('questions.csv updated!');
            });
        });
        
        //delete and replace answers.csv with input from new.html
        await fs.unlink(`./public/csv/${teacher}/answers.csv`, (err)=>{
            if(err){
                throw err;
            }
        }).then(()=>{
            fs.writeFile(`./public/csv/${teacher}/answers.csv`, ansCSV, (err)=>{
                if(err){
                    throw err;
                }
                // return console.log('answers.csv updated!');
            });
        }).then(()=>res.json({status: 'ok'}));
    }
    catch(err){
        return res.json({status: 'error', error: 'Could not update questions/answers!'});
    }







    // try{
    //     //delete and replace questions.csv with input from new.html
    //     await fs.unlink('./public/csv/questions.csv', (err)=>{
    //         if(err){
    //             throw err;
    //         }
    //     }).then(()=>{
    //         fs.writeFile('./public/csv/questions.csv', quesCSV, (err)=>{
    //             if(err){
    //                 throw err;
    //             }
    //             // return console.log('questions.csv updated!');
    //         });
    //     });
        
    //     //delete and replace answers.csv with input from new.html
    //     await fs.unlink('./public/csv/answers.csv', (err)=>{
    //         if(err){
    //             throw err;
    //         }
    //     }).then(()=>{
    //         fs.writeFile('./public/csv/answers.csv', ansCSV, (err)=>{
    //             if(err){
    //                 throw err;
    //             }
    //             // return console.log('answers.csv updated!');
    //         });
    //     }).then(()=>res.json({status: 'ok'}));
    // }
    // catch(err){
    //     return res.json({status: 'error', error: 'Could not update questions/answers!'});
    // }

});




module.exports = router;