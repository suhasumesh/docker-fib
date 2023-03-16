const keys = require('./keys');

// Express app setup:
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

//PG client setup:
const {Pool} = require('pg');
const pgClient = new Pool({
    user:keys.pgUser,
    host:keys.pgHost,
    database : keys.pgDatabase,
    password : keys.pgPassword,
    port : keys.pgPort
})

pgClient.on('error',()=>{console.log("Lost PG Connection");})

pgClient.query("CREATE TABLE IF NOT EXISTS values (number INT)")
.catch(err =>{
    console.log(err);
})
//Redis Client Setup:
const redis = require('redis');
const redisClient = redis.createClient({
    host : keys.redisHost,
    port : keys.redisPort,
    retry_strategy: ()=> 1000
})
const redisPublisher = redisClient.duplicate();


app.get('/',(req,res,next)=>{
    res.send('Hi');
})

app.get('/values/all',async (req,res,next)=>{
    const values = await pgClient.query('SELECT * FROM values');
    res.send(values.rows);                       // .rows actual information that we need 
})

app.get('/values/current',async (req,res,next)=>{
    redisClient.hGetAll('values',(err,values)=>{
        res.send(values);          // redis doesnt support Promise so using callback functions
    });
});

app.post('/values',async (req,res,next)=>{
    const index = req.value.index;
    if(parseInt(index)>40){
        return res.status(422).send('Index too high');
    }
    redisClient.hSet('values',iindes,'Nothing yet');
redisPublisher.publish('insert',index);
pgClient.query('INSERT INTO values(number) VALUES($1)',[index])
res.send({working:true});

})
app.listen(5000,err =>{
    console.log(err);
})

