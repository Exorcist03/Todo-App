const express = require('express');
const app = express();
app.use(express.json());
const {User} = require('./config/db');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
const port = process.env.PORT || 3000;
app.post('/', (req, res) => {
    res.send("this is workding");
})

// writing the signup 
// user will enter username, password, email, in signup store the info in db and return the token 
// making my email unique
app.post('/signup', async (req, res) => {
    let username = req.body.username, email = req.body.email, password = req.body.password;
    console.log("signup fnc triggered", username, email, password);
    const repeat = await User.findOne({email});
    if(repeat) {
       return res.status(403).send({
            success: false,
            msg: "This email already exists!"
        })
    }
    const newuser = new User({username, email, password});
    await newuser.save();
    // creating a token for this email
    const payload = {email};
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    
    return res.json({
        success: true,
        token,
        msg: "New user added!!"
    });
})


// making the signin api (email, password)
app.post('/signin', async (req, res) => {
    const {email, password} = req.body;
    console.log("signin endpoint hit", email, password);
    const found = await User.findOne({email});
    if(!found) {
        return res.status(404).send({
            success: false,
            msg: "This email is not registered!!"
        })
    }
    if(found.password != password) {
        return res.status(404).send({
            success: false,
            msg: "incorrect password!!"
        })
    }
    const payload = {email};
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return res.json({
        success: true,
        token,
        msg: "succesfully signed in!!"
    });
})

// endpoint to store todo only when i am authenticated

const fetchUser = async (req, res, next) => {
    console.log("feth user middleware here");
    const token = req.header('auth-token');
    // console.log(token);
    if(!token) {
        return res.status(403).json({
            success: false,
            msg: "Please authenticate using valid tokens"
        })
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.email = data.email;
            next();
        } catch (error) {
            res.json({
                msg: "errors while verifying"
            })
        }
    }
}

app.post('/addtodo', fetchUser, async (req, res) => {
    const title = req.body.title, description = req.body.description;
    const email = req.email;
    //d add todo to the array of this email
    const newtodo = {title, description};
    const user = await User.findOne({email});
    // console.log(user);
    if(user.todos.length == 0) {
        user.todos = [newtodo];
    } else {user.todos = [...user.todos, newtodo];}
    await user.save();
    res.json({
        success: true,
        msg: "Todo for this user updated"
    })
})

app.get('/gettodo', fetchUser, async (req, res) => {
    let email = req.email;
    const user = await User.findOne({email});
    // console.log(user);
    return res.send(user.todos);
})


// endpoint to mark mytodo completed

app.post('/update', fetchUser, async (req, res) => {
    let email = req.email, idx = parseInt(req.body.idx);
    let user = await User.findOne({email});
    user.todos[idx].completed = "true";
    await user.save();
    res.send({
        success: true,
        msg: "todo marked true"
    })
})

app.listen(port, () => {
    console.log(`listining to port ${port}`);
})