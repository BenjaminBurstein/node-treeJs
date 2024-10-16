# Wizard - Hackathon Node.js & Socket.io

Wizard est un jeu 3D où le but est d'affronter votre adversaire en jetant des sorts tout en évitant ses sorts invisibles pour ne pas perdre la partie.

## Présentation
### Pages
Ce site est composé de 4 pages :
- Connexion : accèder à la page d'accueil
- Accueil : donner du contexte et l'accès au jeu
- Jeu : combattre les forces du mal
- Classement : liste des 10 meilleurs joueurs et de la maison en tête du classement

### Jeu
Les mécaniques de jeu :
- Z : Avancer
- Q : Tourner à gauche
- S : Reculer
- D : Tourner à droite
- Trackpad / souris : Changer son angle de vue
- Click gauche : Lancer des sorts


### Remarques
Suite à des problèmes d'importation de Locomotive Scroll sur le projet, vous trouverez 2 types de page d'accueil :
- celle actuellement sur le projet : sans animation et responsive
- celle sur un [CodePen](https://codepen.io/karen160/full/bGxpXRY)  : avec des animations et non responsive


## Installation
### Le projet
Cloner le projet

Vérifier que votre version de node est supérieur ou égal à 19.6.1

Allez dans les dossiers front et back, et pour chaque, installez leurs dépendances et lancez le projet.
```
cd front
npm install
npm run dev
```
```
cd back
npm install
npm run start
```

### Le jeu
A présent, configurez les variables d'environnemment pour pouvoir lancer le jeu. 

Récupérez sur votre terminal front votre adresse ip (exemple : `Network: http://192.168.0.12:3000`).

Sur les fichiers ``Test.vue`` et ``Game.vue``, se trouvant dans le dossier front/components, remplacez la valeur de la constante `ADDRESS_IP` par celle récupéré ci dessus en modifiant ``:3000`` en ``:3001`` (exemple: ``const ADDRESS_API = http://192.168.0.12:3001``).

Faite de même dans le fichier ``app.js``, se trouvant dans le dossier back, en remplacant la valeur de la constant `NUMBER_ADDRESS_API` par les nombres de votre adresse ip ce trouvant entre `http://` et `:3000` (exemple: `const NUMBER_ADDRESS_API = 192.168.0.12`).


## Tester
### Se connecter
Pour tester localement le projet sans avoir à se connecter, rendez vous sur votre navigateur avec la page de connexion du projet ouverte.

Inspectez cette page et allez dans l'onglet Appli, puis rentrez les informations suivantes dans Stockage de session :
- token | 123456
- userId | 1

Vous pouvez à présent accéder à la page d'accueil en rechargeant la page.

### Jouer sur un seul ordinateur
Pour lancer le jeu seul, il faut ouvrir un nouvel onglet en naviguant privé et répéter les étapes de connection ci-dessus en modifiant les valeurs de token et userId.

Vérifiez que le token et le userId sont bien différent entre vos deux onglets.

### Jouer sur deux ordinateurs
Pour pouvoir jouer sur deux ordinateurs différents il faut que ces ordinateurs soient connectés sur le même wifi (même adresse IP).

Vérifiez que le token et le userId sont bien différent entre les deux ordinateurs.


## Auteurs
Equipe 4 :
- [Nathan Szigeti](https://github.com/nathanszig)
- [Alexandre Caramel](https://github.com/Terminev)
- [Benjamin Burstein](https://github.com/SunnyBenji)
- [Karen Azoulay](https://github.com/Karen160)
