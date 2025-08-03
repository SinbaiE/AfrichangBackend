# AfriChange - Backend

Ce dépôt contient le code source du backend pour l'application AfriChange, une plateforme d'échange de devises peer-to-peer.

## Description

Le backend est construit avec Node.js et Express. Il utilise Sequelize comme ORM pour interagir avec une base de données MySQL. L'API RESTful expose des points de terminaison pour gérer les utilisateurs, les portefeuilles, les offres d'échange, et le processus d'échange P2P.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- [Node.js](https://nodejs.org/) (version 14.x ou supérieure)
- [NPM](https://www.npmjs.com/) (généralement inclus avec Node.js)
- [MySQL](https://www.mysql.com/) ou un autre client de base de données compatible.

## Installation

Suivez ces étapes pour cloner le dépôt et installer les dépendances :

1.  **Clonez le dépôt :**
    ```bash
    git clone <URL_DU_DEPOT>
    cd backendnode
    ```

2.  **Installez les dépendances NPM :**
    ```bash
    npm install
    ```

## Configuration

L'application nécessite des variables d'environnement pour se connecter à la base de données.

1.  **Créez un fichier `.env`** à la racine du projet en copiant l'exemple :
    ```bash
    cp .env.example .env
    ```

2.  **Modifiez le fichier `.env`** avec vos propres informations de connexion à la base de données :
    ```
    DB_HOST=localhost
    DB_USER=votre_utilisateur_mysql
    DB_PASSWORD=votre_mot_de_passe_mysql
    DB_NAME=africhange_db
    ```

3.  **Base de données :** Assurez-vous d'avoir créé une base de données MySQL avec le nom que vous avez spécifié dans `DB_NAME`.

## Démarrage de l'application

Pour démarrer le serveur, vous pouvez utiliser l'une des commandes suivantes :

-   **Pour le développement (avec redémarrage automatique) :**
    ```bash
    npm run dev
    ```

-   **Pour la production :**
    ```bash
    npm start
    ```

Le serveur démarrera sur le port `3000` par défaut.

## Points de terminaison de l'API

Voici un aperçu des principaux points de terminaison :

-   `POST /exchange-offers`: Créer une nouvelle offre d'échange.
-   `GET /exchange-offers`: Lister toutes les offres ouvertes.
-   `POST /exchange-offers/:id/accept`: Accepter une offre et exécuter l'échange.
-   `DELETE /exchange-offers/:id`: Annuler une offre que vous avez créée.
-   `GET /exchange-orders/user/:userId`: Lister les échanges complétés pour un utilisateur.

Pour plus de détails, veuillez consulter le code dans le répertoire `routers/`.
