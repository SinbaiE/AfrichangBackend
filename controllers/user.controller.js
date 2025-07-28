const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const { Op } = require("sequelize");

const { Wallet, User } = require('../models');

class UserController {

  async create(req, res) {
    try {
      const { FirstName, LastName, email,  password, phone, country} = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ email }, { phone }],
        },
      })
      // console.log(FirstName);
      // console.log(existingUser)

      
      if (existingUser) {
          return res.status(400).json({
              message: "Un utilisateur avec cet email ou ce numéro de téléphone existe déjà",
            })
          }
          
          // console.log(hashedPassword)
      const user = await User.create({ 
        FirstName,
        LastName,
        email,
        password: hashedPassword,
        phone,
        country,
        kycStatus: "pending",
        accountStatus: "active",
      });

      // génération des tocken
      const token = JWT.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
      //retirer le mot de pass dans les données de l'utilisateurs avant de le retouner
      // const userResponse = this.sanitizeUser(user);
      res.status(201).json({
        message:'utilisateur enregistrer avec succès',
        token,
        user
      });
      // console.log({message:'is ok',user});
  
      // Création automatique des portefeuilles pour les devises disponibles
      const currencies = ['XOF', 'NGN', 'GHS', 'KES'];
      await Promise.all(currencies.map(currency => {
        return Wallet.create({
          userId: user.id,
          currency,
          balance: 0.00
        });
      }));
  
      res.status(201).json({ 
        message: 'Inscription réussie avec portefeuilles', 
        user });
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

      const { FirstName, LastName, email,  password, phone, country} = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

        await User.update({ 
        FirstName,
        LastName,
        email,
        password: hashedPassword,
        phone,
        country,
        kycStatus: "pending",
        accountStatus: "active",
      });
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  // Delete
  async destroy(req, res) {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) 
        return res.status(404).json({
            message: 'User not found' 
          });

      await user.destroy();
      res.json({ message: 'User deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }



}
module.exports = new UserController();
