const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser')
dotenv.config();
const cors = require('cors')
const helmet = require('helmet')
const sequelize = require('./config/database');
const userRoutes = require('./routers/user.router');
const autRouters = require('./routers/auth.router');
const walletRouters = require('./routers/wallet.routes');
const auditRouters = require('./routers/audit.routes');
const depositRouters = require('./routers/deposit.routes');
const exchangeRouters = require('./routers/exchange.routes');
const exchangeorderRouter = require('./routers/exchangeOrder.routes');
const exchangeraterRouter = require('./routers/exchangeRate.routes');
const transactionRouter = require('./routers/transaction.routes');
const withdrawelRouter = require('./routers/withdrawal.routes');
const ProfileRouter = require('./routers/profile.routes')
  
const app = express();
app.use(cors());
app.use(helmet());
app.use(bodyParser.json())
const port = process.env.PORT || 5000;
// console.log(bodyParser)
app.use(express.json());
app.use('/api', userRoutes);
app.use('/api',autRouters);
app.use('/api',walletRouters);
app.use('/api',auditRouters);
app.use('/api',depositRouters);
app.use('/api',exchangeRouters);
app.use('/api',exchangeorderRouter);
app.use('/api',exchangeraterRouter);  
app.use('/api',transactionRouter);
app.use('/api',withdrawelRouter);
app.use('/api',ProfileRouter);


// Test connexion à la base de données
// Connexion à la DB
sequelize.sync({ alter: false,force: false}) // alter ou force selon le besoin
  .then(() => console.log('Base de données synchronisée'))
  .catch(err => console.error('Erreur de connexion à la base :', err));

// je doit lancer le cerveur node js ici grâce à 
app.listen(port,()=>{
  console.log(`le cerveur est bien lancer avec succé sur le port ${port}`);
});