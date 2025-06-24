const bcrypt = require('bcryptjs');

const { Wallet, User } = require('../models');

class UserController {

  async create(req, res) {
    try {
      const { name, email,  password,phone } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // console.log(hashedPassword)
      const user = await User.create({ name, email, phone, password: hashedPassword });
      res.status(201).json({message:'is ok',user});
      console.log({message:'is ok',user});
  
      // Création automatique des portefeuilles pour les devises disponibles
      const currencies = ['XOF', 'NGN', 'GHS', 'USD'];
      await Promise.all(currencies.map(currency => {
        return Wallet.create({
          userId: user.id,
          currency,
          balance: 0.00
        });
      }));
  
      res.status(201).json({ message: 'Inscription réussie avec portefeuilles', user });
    } catch (error) {
      res.status(500).json({ error: error.message, details: error.errors });
    }
  }
  
  // Read all
  async index(req, res) {
    try {
      const users = await User.findAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Read one
  async show(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Update
  async update(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const { name, email,  password,phone } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      await user.update({ name, email, phone, password: hashedPassword });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Delete
  async destroy(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      await user.destroy();
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new UserController();
