const bcrypt = require('bcryptjs')
const db = require('../db/database')

class User {
  constructor(email, password, fullname, street, postal, city) {
    this.email = email;
    this.password = password;
    this.name = fullname;
    this.address = {
      street,
      postalCode: postal,
      city,
    };
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection('users').insertOne({
        email: this.email,
        password: hashedPassword,
        name: this.name,
        address: this.address
    });
  }

  getUserWithEmail() {
    return db.getDb().collection('users').findOne({email: this.email})
  }

  async existAlready() {
    const existingUser = await this.getUserWithEmail();
    if(existingUser) {
      return true
    }
    false;
  }

  comparePassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword)
  }
}

module.exports = User;
