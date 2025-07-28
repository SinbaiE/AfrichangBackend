const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const {User} = require('../models');

class UserAuthController {
    // une methode pour l'autantification d'un utilisateur
    async login(req , res ){
        const {email,password} = req.body ;
        try {
            const user = await User.findOne({where:{email}});
            if (!user) {
                return res.status(400).json({message:'not found'});
            }
            
            /**
             * verification des mots de passe 
            */
           
           const validPassword = await bcrypt.compare(password,user.password);
           if (!validPassword) {
               return res.status(400).json({message:'mot de pass incorect veiller ressayer'})
            }
            
            /**
             * creation d'un tocken d'authentification
            */
            const token = JWT.sign(
               { userId: user.id },
               process.env.JWT_SECRET,
               { expiresIn: '1d' }
            );
           res.status(200).json({message:'connexion reussi',token});

       } catch (error) {
        res.status(500).json({error:error.message});
       }
    }

}
module.exports = new UserAuthController();