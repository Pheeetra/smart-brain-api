export const handleRegister = (req, res, db, bcrypt) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password, 10);
    db.transaction(trx => {
        trx.insert({
            email: email,
            name: name,
            joined: new Date()
        })
        .into('users')
        .returning('*') // Return the entire user object
        .then(user => {
            console.log('Registered user:', user[0]); // Log the registered user
            return trx('login')
                .returning('email')
                .insert({
                    email: user[0].email,
                    hash: hash
                })
                .then(() => {
                    res.json(user[0]); // Send the user object to the client
                });
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => {
        console.error('Transaction error:', err); // Log the error for debugging
        res.status(400).json('unable to register');
    });
};
