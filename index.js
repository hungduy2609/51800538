const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const router=require('./routes')
const fetch = require('node-fetch');
const cookieSession = require('cookie-session')
require('./passport-setup');
app.use(cors())
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieSession({
    name: 'hungduy-session',
    keys: ['key1', 'key2']
  }))
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

let today=new Date()

app.use(passport.initialize());
app.use(passport.session());
app.use('/auth',router)

app.get('/login', (req, res)=>{
    if(req.user){
        res.redirect('/')
    }else {
        res.render('login')
    }
})


app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/login');
})
const  SERVER1= 'https://api.openweathermap.org/data/2.5/weather?appid=e89c7405a5f0c2f6ac5d813233606e24&units=metric&q=saigon&fbclid=IwAR13gqiFabeJbkIARHOXFgH3ZD1j6r97xdZhvyNSvH8ti1GdxHzk__1Zg0s';
const  SERVER2= 'https://api.openweathermap.org/data/2.5/weather?appid=e89c7405a5f0c2f6ac5d813233606e24&units=metric&q=hanoi&fbclid=IwAR13gqiFabeJbkIARHOXFgH3ZD1j6r97xdZhvyNSvH8ti1GdxHzk__1Zg0s';


app.get('/', isLoggedIn, (req, res) => {
        Promise.all([
            fetch(SERVER1),
            fetch(SERVER2)
        ]).then(function (responses) {
            return Promise.all(responses.map(function (response) {
                return response.json();
            }));
        }).then(function (data) {
            console.log(today)
            res.render('index', {dataHCM: data[0], date: today, dataHN: data[1], user: req.user})
        }).catch(function (error) {
            console.log(error);
        });

})



app.listen(4000, () => console.log('http://localhost:4000'))
