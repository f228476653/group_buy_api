const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json('incorrect form submission');
  }
  db.select('*').from('users')
    .where('email', '=', email)
    .then(data => {
      console.log(data)
      const isValid = bcrypt.compareSync(password, data[0].password);
      if (isValid) {
          res.json(data[0])
          console.log('success')
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
}

module.exports = {
  handleSignin: handleSignin
}