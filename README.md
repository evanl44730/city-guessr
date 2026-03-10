# CityGuessr 🌍

CityGuessr est une application web interactive de jeu géographique. Le but du jeu est de deviner l'emplacement d'une ville cible. À chaque essai, le jeu indique la distance et la direction par rapport à la ville recherchée, et effectue un dézoom automatique sur la carte pour vous aider. Le joueur dispose de 6 essais maximum par ville.

## 🚀 Fonctionnalités Principales

CityGuessr propose plusieurs modes de jeu pour s'adapter à toutes les envies :

- **🧠 Mode Solo**
  - **France :** Devinez une ville aléatoire en France métropolitaine ou dans les DOM-TOM.
  - **Capitales :** Testez vos connaissances sur les capitales mondiales.
  - **Département :** Ciblez une zone spécifique en devinant des villes d'un seul département choisi via son numéro.

- **📖 Mode Histoire**
  - Progressez à travers des niveaux de difficulté croissante (Facile, Moyen, Difficile, Très Difficile, Expert).
  - Débloquez de nouvelles régions et catégories (France, Capitales mondiales, Haute-Garonne, Tarn, Loire-Atlantique, Aveyron, etc.).
  - Votre progression est sauvegardée localement dans votre navigateur.

- **⏱️ Mode Contre-la-montre (Time Attack)**
  - Trouvez le maximum de villes en 2 minutes chrono !
  - Gagnez du temps bonus (+30s) en cas de victoire, mais attention aux pénalités (-20s) en cas d'échec.
  - Grimpez dans le **Leaderboard mondial en temps réel** (Top 100).

- **🌐 Mode Multijoueur en ligne (Online)**
  - Créez des salons privés (Rooms) avec un code de 4 lettres pour jouer avec vos amis.
  - L'hôte configure et lance la partie (10 manches par défaut).
  - Affrontez-vous en temps réel : tous les joueurs cherchent la même ville simultanément.
  - Système de score dynamique basé sur le nombre d'essais.

## 🛠️ Stack Technique

Le projet repose sur une architecture moderne Full-Stack JavaScript/TypeScript :

- **Frontend / Framework :** [Next.js](https://nextjs.org/) (App Router), React 19
- **Style :** [Tailwind CSS v4](https://tailwindcss.com/)
- **Cartographie :** [Leaflet](https://leafletjs.com/) avec `react-leaflet`
- **Calculs Géographiques :** `geolib`
- **Backend / Temps Réel :** Serveur Node.js personnalisé (`server.js`) utilisant [Socket.io](https://socket.io/) pour le multijoueur (gestion des instances de parties) et le Leaderboard.
- **Base de données / Backend as a Service :** [Supabase](https://supabase.com/) (clients configurés)

## 📦 Installation et Lancement

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

1. **Cloner le dépôt :**
   ```bash
   git clone <URL_DU_DEPOT>
   cd city-guessr
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le serveur de développement :**
   Le projet utilise un Custom Server Node.js pour gérer conjointement l'application Next.js et Socket.io sur le même port. L'utilisation classique de `next dev` ne lancerait pas le serveur Socket.io.
   ```bash
   npm run dev
   # ou
   npm start
   ```

4. **Accéder à l'application :**
   Ouvrez votre navigateur et accédez à [http://localhost:3000](http://localhost:3000).

## 📂 Structure du Projet

L'architecture principale du projet est structurée ainsi :

- `/app` : Pages et routing de l'application Next.js (App Router).
- `/components` : Composants React réutilisables (interface, carte `Map`, barre de recherche, menus).
- `/data` : Fichiers statiques et listes de villes (`cities.json`, niveaux histoire dans `storyLevels.ts`, etc.).
- `/hooks` : Hooks React personnalisés (gestion de l'état du jeu).
- `/lib` : Configurations d'outils externes (comme le client Supabase).
- `/utils` : Fonctions utilitaires (calculs de score avec `geolib`, manipulation des données).
- `server.js` : Point d'entrée Node.js qui initialise Next.js et configure le serveur de WebSockets (`socket.io`) pour les Rooms multijoueurs et le Leaderboard.
- `SPECS.md` : Documentation technique détaillée des modèles de données et flux de l'application.

## 📝 Spécifications Détaillées

Pour plus de détails techniques précis sur l'architecture, les différents objets de données (`RoomState`, `PlayerState`, etc.) et les processus logiques de de l'application, veuillez consulter le fichier de spécifications :
👉 **[`SPECS.md`](./SPECS.md)**

---
*Ce projet a été initialisé avec Next.js et fonctionne de manière autonome avec son serveur Node.js embarqué.*
