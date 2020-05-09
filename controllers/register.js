const handleRegister = (req, res, db, bcrypt) => {
  const { email, first_name, last_name , password, phoneNumber } = req.body.user;
  if (!email || !first_name || !last_name ||!password || !phoneNumber) {
    return res.status(400).json('incorrect form submission');
  }
  const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
      trx.insert({
        first_name: first_name,
        last_name: last_name,
        email: email,
        password: hash,
        joined: new Date(),
        phonenumber:phoneNumber
      })
    .returning('id')
    .into('users')
    .then(user_id => {
      req.body.id = user_id[0]
      return trx('login').insert({
          user_id: user_id[0],
          login_datetime: new Date()
        })
    })
    .then(trx.commit)
    .then(
      db.transaction(trx1 => {
        trx1.select('*').from('users').where({id:parseInt(req.body.id) } )
        .then(user => {
          if (user.length) {
            res.json(user[0])
            console.log(user[0])
          } else {
            res.status(400).json('can not find user')
          }
        })
        .catch(err => res.status(405).json(err))
        //console.log(user_id);
      }))
    .catch(trx.rollback)
  })
}
/*.select().where('id', user_id)
        .then((users) => { 
          res.json(users[0])
        })*/
module.exports = {
  handleRegister: handleRegister
};

