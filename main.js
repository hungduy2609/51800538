const https = require('https')

const request = https.request({
    hostname:'web-nang-cao.herokuapp.com',
    path:'/lab5/users',
    port:443,
    method:'GET'
},res => {
    let body=''
    res.on('data',d=>body+=d.toString())
    res.on('end',()=>{
        console.log(JSON.parse(body))
    })
    res.on('error',e=>console.log(e))
})

request.on('error',e=>console.log(e))
request.end()