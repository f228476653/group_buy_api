const redis = require('redis');
const redisClient  = redis.createClient(process.env.REDIS_URI);

const requireAuth =(req,res,next) =>{
    const { authorization } = req.headers;
    if(!authorization){
        return res.status(401).json('Unauthorized');
    }
    return redisClient.get(authorization, (err, reply)=>{
        console.log(err)
        console.log(reply)
        if (err|| !reply) {
            return res.status(401).json('Unauthorized');
        }
        return next();
    })
}

//next(),表示下一個動作,呼叫next() 等於叫下一個動作(req, res)
//app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db)})


module.exports= {
    redisClient:redisClient,
    requireAuth: requireAuth
}