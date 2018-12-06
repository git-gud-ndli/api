API
===

## Lancer la base de données Postgres + Adminer

Lancer la commande `docker-compose up` pour lancer une instance de Postgres
et de Adminer disponible sur : http://localhost:8080.

Voici les informations de connexion à Postgres :
  - Serveur : PostgreSQL
  - Serveur : `db`
  - Utilisateur : `postgres`
  - Mot de passe : `example`
  - Base de données : `postgres`

Pour lancer les migrations : `npm run migrate`
Pour rollback : `npm run rollback`
