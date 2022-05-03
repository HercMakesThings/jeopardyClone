const express = require('express');
const app = express();
// const upload = multer({dest: '../public/csv/'});
const fs = require('fs');
const port = process.env.PORT || 3001;
const mongoose = require('mongoose');
const User = require('./models/users');
const path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
// const { json } = require('body-parser');
const JWT_SECRET = process.env.JWT_SECRET || 'aalskdujghfasdfbao76a68T3GH39087987(&^&%^LASJDF%$';

//route handler
const adminRoutes = require('./routes/routes.js');

const dbURI = 'mongodb+srv://herc_64:gnarlycluster64@loginpracticecluster.68glo.mongodb.net/loginPractice?retryWrites=true&w=majority';

mongoose.connect(dbURI)
    .then(result => app.listen(port, ()=>console.log(`Listening at port...${port}`)))
    .catch(err=>console.error(err));


app.use(adminRoutes);
// app.use('/', express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(bodyParser.json());
// app.use('/upload/csv', bodyParser.text({type:"*/*"}));
app.use('/jeopardy', express.static(path.join(__dirname, '/public/jeopardy.html')));
app.use('/new', express.static(path.join(__dirname, '/public/new.html')));


// app.post('/jeopardy', (req, res)=>{
//     // res.sendFile(__dirname + '/public/jeopardy.html');
//     // console.log('heya!');
//     res.sendFile(path.join(__dirname, '/public/jeopardy.html'));
// });

// app.post('/login', async (req, res)=>{
//     const { username, password } = req.body;

//     const user = await User.findOne({username, password}).lean();

//     if(!user){
//         return res.json({status: 'error', error: 'Invalid username/password!'});
//     }

//     //the username/password combo was successful
//     if(user){
//         //generate json webtoken
//         const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET);
//         console.log(token);
//         return res.json({status: 'ok', data: token});
//     }
//     return json({status: 'error', error: 'Invalid username/password!'});
// });





// app.listen(port, ()=>console.log(`Listening at port...${port}`));