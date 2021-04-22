const express = require('express')
const app = express()
const request = require('request')

app.get('/robot',(req,res)=>{
    // 获取请求参数
    let {key,appid,msg} = req.query
    msg = encodeURI(msg)
    // 服务端请求跨域机器人接口
    request(`https://api.qingyunke.com/api.php?key=${key}&appid=appid&msg=${msg}`, (err, response, body)=>{
        if(!err && response.statusCode == 200){
            let data = JSON.parse(body);
            // 设置cors允许跨域
            res.set({
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            })
            res.json(data)
        }
    })
})

app.listen(4000,()=>{
    console.log('启动成功');
})
