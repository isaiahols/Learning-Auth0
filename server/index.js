require('dotenv').config();
const express = require('express');
const session = require('express-session');
const axios = require('axios');

const app = express();
const { SERVER_PORT, SECRET, REACT_APP_DOMAIN, REACT_APP_CLIENT_ID, CLIENT_SECRET } = process.env;


// get things started
app.use(express.json());
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: true,
}))



// 
// 
// endpoints
// 
// 


app.get('/auth/callback', async (req, res) => {
    const payload = {
        client_id: REACT_APP_CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: req.query.code,
        grant_type: 'authorization_code',
        redirect_uri: `http://${req.headers.host}/auth/callback`
    }

    let resWithToken = await axios.post(`https://${REACT_APP_DOMAIN}/oauth/token`, payload);
    let resWithUserData = await axios.get(`https://${REACT_APP_DOMAIN}/userinfo?access_token=${resWithToken.data.access_token}`);

    req.session.user = resWithUserData.data;
    res.redirect('/')
})

app.get('/api/user-data', (req, res) => {
    // we are checking if the user is logged in or not
    if (req.session.user) {
        res.status(200).send(req.session.user)
        console.log('we got here');
    } else {
        res.status(401).send('nope')
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy()
    // this wipes the session so they loose the session.user object
    res.redirect('http://localhost:3000/')
})


// 
// dont mind me down here, I'm just listening to everything

app.listen(SERVER_PORT, () => {
    console.log(`listening here on ${SERVER_PORT}`);
})
