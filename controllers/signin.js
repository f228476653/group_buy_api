const jwt = require('jsonwebtoken');
const redisClient = require('../middleware/auth').redisClient;


const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submision')
  }
  return  db.select('*').from('users')
    .where('email', '=', email)
    .then(data => {
      if( data.length>0 ){
        const isValid = bcrypt.compareSync(password, data[0].password);
        if (isValid) {
            console.log(data[0])
            return data[0]
        } else {
          return Promise.reject('incorrect form password')
        }
      } else{
        return Promise.reject("Haven't registered7")
      }
    })
}
const getAuthTokenId =(req, res) => {
    const { authorization } = req.headers
    redisClient.get(authorization, function(err, reply) {
      if (err|| !reply){
        return res.status(400).json('Unauthorized')
      }
      return res.json({id:reply})
    });
}

const signToken = (email) =>{
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT, {expiresIn: '1 day'})
   
}

const setToken=(key, value)=>{
  return Promise.resolve(redisClient.set(key,value))
}

const createSession = (user) =>{
  //JWT token, return user data
  const { email, id} = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {return { success: true, userId: id, token }})
    //.catch(err => res.json(err))
}

const signinAuthentication = ( db, bcrypt ) => (req, res) =>{
  const { authorization } =req.headers;
  return authorization ? getAuthTokenId():
    handleSignin(db, bcrypt,req, res)
    .then(data => { return data.id && data.email ? createSession(data): Promise.reject(data) })
    .then(session => res.json(session))
    //.catch(err => res.json(err))
}
module.exports = {
  signinAuthentication: signinAuthentication
}