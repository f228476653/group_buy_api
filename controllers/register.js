const handleRegister = (req, res, db, bcrypt) => {
  const { email, first_name, last_name , password, phoneNumber } = req.body.user;
  if (!email || !first_name || !last_name ||!password || !phoneNumber) {
    return res.status(402).json('incorrect form submission');
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
    .then(id => {
      res.json(id[0]);
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.json(err))
}
/*.select().where('id', user_id)
        .then((users) => { 
          res.json(users[0])
        })*/
module.exports = {
  handleRegister: handleRegister
};

