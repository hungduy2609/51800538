const express= require('express')
const app=express()
const https = require('https')
const fetch=require('node-fetch')
const cookieParser=require('cookie-parser')
const session=require('express-session')
const flash=require('express-flash')
const {check,validationResult}=require('express-validator')
const myBodyParser= require('./middlewares/MyBodyParser')

app.use(myBodyParser)
app.use(cookieParser('mvm'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

const validator=[
    check('name').exists().withMessage('Vui lòng nhập tên')
        .notEmpty().withMessage('Tên không được để trống')
        .isLength({min:3}).withMessage('Tên phải có tối thiểu 3 ký tự')
        .isLength({max:15}).withMessage('Tên chỉ có tối đa 15 ký tự'),

    check('gender').exists().withMessage('Vui lòng chọn giới tính'),
    check('email').notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Đây không phải email hợp lệ')
]

app.set('view engine','ejs')


app.get('/',(req,res)=>{
    const request = https.request({
        hostname:'web-nang-cao.herokuapp.com',
        path:'/lab5/users',
        port:443,
        method:'GET'
    },response => {
        let body=''
        response.on('data',d=>body+=d.toString())
        response.on('end',()=>{
            const users=JSON.parse(body)
            res.render('index',{users})

        })
        response.on('error',e=>console.log(e))
    })

    request.on('error',e=>console.log(e))
    request.end()
})
app.get('/add',(req,res)=>{
    let error= req.flash('error')
    let name= req.flash('name')
    let age= req.flash('age')
    let email= req.flash('email')
    res.render('add',{error,email,age,name})
})

app.post('/add',validator,(req,res)=>{
    const result=validationResult(req)
    const {name,age,email}=req.body
    if (result.errors.length>0){
        req.flash('error',result.errors[0].msg)
        req.flash('name',name)
        req.flash('age',age)
        req.flash('email',email)
        res.redirect('/add')
    }


})

app.post('/delete/:id',(req, res) =>{
    if(!req.params.id){
        return res.json({code:1,message:'Invalid ID'})
    }
    const id=req.params.id
    fetch('https://web-nang-cao.herokuapp.com/lab5/users/'+id,{
        method:'DELETE'
    })
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
            return res.json(json)

        })
        .catch(e=>{
            console.log(e)
            return res.json({code:2,message:e.message})
        })
})

app.listen(8080,()=>console.log('http://localhost:8080'))