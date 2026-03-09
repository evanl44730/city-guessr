# Spécifications du Projet : CityGuessr

Ce document détaille l'architecture, les modèles de données, les flux principaux et toutes les fonctionnalités de l'application **CityGuessr**.

## 1. Vue d'ensemble de l'Architecture

Le projet utilise une architecture moderne basée sur du JavaScript/TypeScript (Full-stack) :
- **Framework Frontend/Backend :** Next.js (App Router)
- **Serveur Personnalisé :** Un serveur Node.js (`server.js`) gère à la fois l'application Next.js et un serveur **Socket.io** permettant les fonctionnalités multijoueurs en temps réel.
- **Cartographie :** Leaflet (via `react-leaflet`) pour l'affichage interactif de la carte et des marqueurs.
- **Calculs géographiques :** Utilisation de la bibliothèque `geolib` pour calculer les distances.
- **Stockage de données :**
  - **Côté Client :** `localStorage` pour la sauvegarde de la progression du mode Histoire.
  - **Côté Serveur (Mémoire) :** Stockage en mémoire RAM pour les instances de parties multijoueurs (Rooms) et le classement mondial (Leaderboard) du mode Contre-la-montre.
  - **Données Statiques :** Liste des villes stockée dans un fichier JSON (`data/cities.json`) et les niveaux du Mode Histoire dans `data/storyLevels.ts`.
- **Style :** Tailwind CSS.

---

## 2. Fonctionnalités Principales

L'application propose plusieurs modes de jeu basés sur la géographie, où le but est de deviner l'emplacement d'une ville cible. À chaque essai, le jeu indique la distance et la direction par rapport à la ville cible, et effectue un dézoom sur la carte. Le joueur dispose de 6 essais maximum.

### 2.1 Mode Solo ("France", "Capitales", "Département")
- **France :** Deviner une ville aléatoire en France métropolitaine ou dans les DOM-TOM.
- **Capitales :** Deviner une capitale mondiale.
- **Département :** Deviner une ville située uniquement dans un département spécifique choisi par l'utilisateur (filtrage par code postal).

### 2.2 Mode Histoire ("Story")
- Progression à travers des niveaux de difficulté croissante (Facile, Moyen, Difficile, Très Difficile, Expert).
- Catégories disponibles : France, Capitales mondiales, Haute-Garonne, Tarn, Loire-Atlantique, Aveyron.
- Sauvegarde de la progression localement (enregistrement du meilleur score/nombre d'essais pour chaque niveau débloqué).

### 2.3 Mode Contre-la-montre ("Time Attack")
- **Objectif :** Trouver le maximum de villes en 2 minutes.
- **Mécanique :** Gagner des points à chaque ville trouvée (plus la ville est trouvée vite/en peu d'essais, plus les points sont élevés). Du temps bonus est accordé (+30s) en cas de victoire, et une pénalité (-20s) en cas d'échec.
- **Classement :** Un leaderboard global et en temps réel (Top 100) maintient les meilleurs scores via Socket.io.

### 2.4 Mode Multijoueur en ligne ("Online")
- Système de salons (Rooms) privés avec un code de 4 lettres.
- Un hôte crée la partie et lance un nombre défini de manches (10 par défaut).
- Les joueurs devinent la même ville simultanément. La manche se termine lorsque tous les joueurs ont trouvé (ou épuisé leurs 6 essais).
- **Score Multijoueur :** Basé sur le nombre d'essais. Le classement est mis à jour à chaque manche.
- Transition automatique vers la manche suivante après un délai de 3 secondes.

---

## 3. Modèles de Données

### 3.1 Données des Villes (`CityData`)
Représente une ville (issu de `cities.json`) :
- `name` (string) : Nom de la ville.
- `coords` (Coordinates) : Latitude et longitude.
- `category` (string[]) : Catégories pour le tri (ex: `['france_metropole']`, `['world_capital']`).
- `zip` (string) : Code postal (utilisé pour filtrer par département).

### 3.2 Modèle de Niveau Histoire (`StoryLevel`)
Définit un niveau spécifique du mode histoire :
- `id` (number) : Identifiant unique.
- `cityName` (string) : La ville cible de ce niveau.
- `difficulty` (string) : 'Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Expert'.
- `minScoreToUnlock` (number) : Score requis pour débloquer (souvent 6, signifiant la réussite du niveau précédent).
- `category` (string) : Région/Thème du niveau.

### 3.3 État de la Session Joueur Local (`Guess`)
Gère l'historique des essais d'un joueur dans une manche :
- `city` (CityData) : La ville suggérée par le joueur.
- `distance` (number) : Distance en km par rapport à la cible.
- `direction` (string) : Direction vers la cible (Ex: 'NE', 'S').

### 3.4 État d'une Partie Multijoueur Serveur (`RoomState`)
Géré côté serveur dans `server.js` :
- `id` (string) : Code de la room (4 lettres).
- `hostId` (string) : Identifiant Socket de l'hôte.
- `players` (Map) : Collection d'objets `PlayerState`.
- `gameState` (string) : État de la partie ('lobby', 'playing', 'ended').
- `currentRound` (number) : Manche actuelle.
- `maxRounds` (number) : Nombre total de manches (10).
- `cities` (CityData[]) : Liste pré-générée des villes cibles pour toute la partie.

### 3.5 État du Joueur Multijoueur (`PlayerState`)
- `id` (string) : Socket ID.
- `username` (string) : Pseudo du joueur.
- `score` (number) : Score global.
- `attempts` (number) : Essais pour la manche actuelle.
- `finishedRound` (boolean) : Vrai si le joueur a trouvé la ville ou perdu.
- `totalAttempts` (number) : Nombre total d'essais cumulés.

---

## 4. Flux Principaux (Workflows)

### 4.1 Flux d'un Tour de Jeu Standard (Solo & Histoire)
1. **Initialisation :** Le mode est sélectionné. Une ville cible est choisie aléatoirement (ou fixée selon le niveau). L'état passe à `playing`. Le zoom initial de la carte est défini à 16.
2. **Essai du joueur :** Le joueur soumet un nom de ville via l'interface de recherche.
3. **Validation :** L'application cherche la ville dans ses données.
4. **Calculs :** La distance et direction sont calculées (`createGuess`) et ajoutées à la liste des essais. Le compteur d'essais est incrémenté.
5. **Vérification de l'état de victoire :**
   - *Si correspond:* État `won`. Si mode Histoire, la progression est sauvegardée dans le `localStorage`.
   - *Si 6 essais atteints et erreur:* État `lost`. Le zoom s'élargit totalement.
   - *Sinon:* Le zoom s'ajuste (dézoom dynamique) pour aider le joueur.

### 4.2 Flux Multijoueur (Socket.io)
1. **Création / Connexion :** Le joueur A (hôte) clique sur "Créer une partie". Le serveur crée une `RoomState` et émet `room_created`. Le joueur B rejoint avec le code (`join_room`).
2. **Lancement :** L'hôte clique sur "Démarrer". Le serveur génère 10 villes (`getRandomCities`), change l'état en `playing`, et broadcast `game_started` avec la première ville.
3. **Pendant la manche :** Les clients gèrent leurs essais localement. Quand un client finit (trouve la ville ou échoue après 6 essais), il émet l'événement `submit_round` avec le nombre d'essais utilisé.
4. **Calcul Score Centralisé :** Le serveur met à jour le score du joueur (max 1000 - pénalités selon les essais) et marque `finishedRound = true`.
5. **Fin de Manche :** Le serveur vérifie si tous les joueurs ont `finishedRound === true`.
   - *Si oui*, et s'il reste des manches, il lance un timeout de 3s puis broadcast `next_round` avec la nouvelle ville cible.
   - *Si dernière manche*, broadcast `game_over` avec le podium.

### 4.3 Flux Contre-la-montre (Time Attack)
1. **Démarrage :** Le chronomètre démarre à 120 secondes. Le joueur devine la ville cible.
2. **Réussite :** Des points sont ajoutés selon le nombre d'essais. +30 secondes sont créditées au timer. Le jeu charge immédiatement la prochaine ville.
3. **Échec (6 essais) :** Pénalité de -20 secondes. Prochaine ville.
4. **Fin du temps :** L'état passe à `ended`. Le client peut soumettre son score via `submit_score` sur le socket.
5. **Leaderboard :** Le serveur insère le score, trie, garde le Top 100, et émet `leaderboard_update` pour mettre à jour tous les clients connectés.
