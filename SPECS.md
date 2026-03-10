# Spécifications du Projet : CityGuessr

Ce document détaille l'architecture, les modèles de données, les flux principaux et toutes les fonctionnalités de l'application **CityGuessr**.

## 1. Vue d'ensemble de l'Architecture

Le projet utilise une architecture moderne basée sur du JavaScript/TypeScript (Full-stack) :
- **Framework Frontend/Backend :** Next.js (App Router)
- **Serveur Personnalisé :** Un serveur Node.js (`server.js`) gère à la fois l'application Next.js et un serveur **Socket.io** permettant les fonctionnalités multijoueurs en temps réel.
- **Cartographie :** Leaflet (via `react-leaflet`) pour l'affichage interactif de la carte et des marqueurs. Utilisé dans le mode solo, histoire, département, Europe, et dans la mini-carte du mode Nord ou Sud.
- **Calculs géographiques :** Fonctions utilitaires maison (`utils/gameUtils.ts`) utilisant la formule de Haversine pour le calcul de distance et les compas 8 points pour la direction.
- **Stockage de données :**
  - **Côté Client :** `localStorage` pour la sauvegarde de la progression du mode Histoire et des meilleurs scores (Plus ou Moins, Nord ou Sud).
  - **Côté Serveur (Mémoire) :** Stockage en mémoire RAM pour les instances de parties multijoueurs (Rooms) et le classement mondial (Leaderboard) du mode Contre-la-montre.
  - **Base de données :** Supabase pour le stockage persistant (configuration dans `lib/supabaseClient.ts`).
  - **Données Statiques :** Liste des villes stockée dans un fichier JSON (`data/cities.json`) et les niveaux du Mode Histoire dans `data/storyLevels.ts`.
- **Style :** Tailwind CSS v4.

---

## 2. Fonctionnalités Principales

L'application propose 9 modes de jeu basés sur la géographie.

### 2.1 Mode Solo (« France », « Capitales », « Département »)
- **France :** Deviner une ville aléatoire en France métropolitaine ou dans les DOM-TOM. 6 essais max. Carte avec zoom/dézoom dynamique.
- **Capitales :** Deviner une capitale mondiale.
- **Département :** Deviner une ville située dans un département choisi par l'utilisateur (filtrage par code postal). Menu de sélection avec grille de départements.

### 2.2 Mode Europe
- Deviner des villes dans un pays européen choisi par l'utilisateur.
- Sélection du pays via un menu dédié (`EuropeMenu.tsx`).
- Filtrage des villes par catégorie `country_<ID>`.

### 2.3 Mode Histoire (« Story »)
- Progression à travers des niveaux de difficulté croissante (Facile, Moyen, Difficile, Très Difficile, Expert).
- Catégories disponibles : France, Capitales mondiales, départements spécifiques (Haute-Garonne, Tarn, Loire-Atlantique, Aveyron), pays européens.
- Niveaux générés dynamiquement pour les départements et pays (`generateStoryLevelsForDepartment`, `generateStoryLevelsForCountry`).
- Sauvegarde de la progression localement (meilleur score/nombre d'essais pour chaque niveau débloqué).

### 2.4 Mode Contre-la-montre (« Time Attack »)
- **Objectif :** Trouver le maximum de villes en 2 minutes.
- **Mécanique :** Gagner des points à chaque ville trouvée. Temps bonus (+30s) en cas de victoire, pénalité (-20s) en cas d'échec.
- **Classement :** Leaderboard mondial en temps réel (Top 100) via Socket.io.

### 2.5 Mode Multijoueur en ligne (« Online »)
- Système de salons (Rooms) privés avec un code de 4 lettres.
- Un hôte crée la partie et lance un nombre défini de manches (10 par défaut).
- Les joueurs devinent la même ville simultanément. La manche se termine lorsque tous les joueurs ont trouvé ou épuisé leurs essais.
- Score dynamique basé sur le nombre d'essais. Transition automatique entre manches (3s).

### 2.6 Mode Défi du Jour (« Daily »)
- Une ville unique par jour, identique pour tous les joueurs.
- Ville déterminée par une fonction de hachage seeded basée sur la date (`getDailyCity`).
- Menu dédié (`DailyMenu.tsx`) pour sélectionner la catégorie du défi.

### 2.7 Mode Plus ou Moins (« Higher/Lower » – Population)
- Deux villes affichées côte à côte (A et B).
- Le joueur doit deviner si la ville B a une **population plus élevée ou plus basse** que la ville A.
- Animation de glissement (slide) vers la gauche en cas de bonne réponse : la ville B devient A, une nouvelle ville C apparaît.
- Alternance de couleurs de fond entre les phases pour un rendu fluide.
- Sauvegarde du **meilleur score** dans `localStorage`.
- Composant : `HigherLowerGame.tsx` avec `gameType='population'`.

### 2.8 Mode Nord ou Sud (« North/South » – Latitude)
- Même mécanique que Plus ou Moins, mais comparaison de la **latitude** au lieu de la population.
- Le joueur doit deviner si la ville B est **plus au Nord ou plus au Sud** que la ville A.
- **Mini-carte** circulaire au centre (remplace le badge « VS ») :
  - Affiche la position de la ville A sur une carte Leaflet sombre.
  - Dégradé Nord/Sud : blanc en haut, orange en bas, avec labels N/S.
  - **Expandable** : clic pour agrandir la carte en plein écran via un React Portal (évite les problèmes de contexte de transform CSS).
  - Contrôles interactifs (zoom, déplacement) en mode agrandi.
- Composant : `HigherLowerGame.tsx` avec `gameType='latitude'`, mini-carte via `MiniMapNorthSouth.tsx`.

### 2.9 Mode Radar
- Mode sans carte. Le joueur doit deviner la ville cible uniquement grâce à des indices distance/direction.
- **Sélection de difficulté** avant chaque partie :
  | Difficulté | Villes cibles           | Essais |
  |------------|-------------------------|--------|
  | Facile     | > 100 000 habitants     | 8      |
  | Moyen      | > 20 000 habitants      | 6      |
  | Difficile  | > 5 000 habitants       | 5      |
  | Expert     | Toutes les villes       | 4      |
- **Mécanique** : Le joueur tape une ville. Le jeu renvoie un indice (ex : *« À 245 km au Nord-Est »*).
- **Radar SVG animé** :
  - Cercles concentriques (anneaux de portée).
  - Ligne de balayage rotative animée.
  - Blips verts représentant les essais, positionnés par angle/distance.
  - Le centre du radar = la cible. Les blips montrent où les essais sont situés par rapport à la cible.
  - Le dernier blip pulse pour le repérer facilement.
  - Labels cardinaux (N, S, E, O).
- **Historique** : Liste de toutes les tentatives avec distance et direction.
- **Victoire/Défaite** : Écrans dédiés avec possibilité de rejouer ou changer la difficulté.
- Composant : `RadarGame.tsx`.

---

## 3. Modèles de Données

### 3.1 Données des Villes (`CityData`)
Représente une ville (issu de `cities.json`) :
- `name` (string) : Nom de la ville.
- `zip` (string) : Code postal (utilisé pour filtrer par département).
- `population` (number) : Nombre d'habitants (utilisé par Plus ou Moins et Radar).
- `coords` (Coordinates) : Latitude (`lat`) et longitude (`lng`).
- `category` (string[]) : Catégories pour le tri (ex: `['france_metropole']`, `['world_capital']`, `['country_spain']`).

### 3.2 Modèle de Niveau Histoire (`StoryLevel`)
Définit un niveau spécifique du mode histoire :
- `id` (number) : Identifiant unique.
- `cityName` (string) : La ville cible de ce niveau.
- `difficulty` (string) : 'Easy' | 'Medium' | 'Hard' | 'Very Hard' | 'Expert'.
- `minScoreToUnlock` (number) : Score requis pour débloquer.
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

### 3.6 État du Mode Radar (`GuessEntry`)
- `city` (CityData) : La ville devinée.
- `distance` (number) : Distance à la cible en km.
- `direction` (string) : Direction cardinale vers la cible.
- `angle` (number) : Angle en degrés (de la cible vers l'essai) pour le positionnement sur le radar.

---

## 4. Flux Principaux (Workflows)

### 4.1 Flux d'un Tour de Jeu Standard (Solo, Histoire, Département, Europe)
1. **Initialisation :** Le mode est sélectionné. Une ville cible est choisie aléatoirement (ou fixée). Le zoom initial de la carte est défini à 16.
2. **Essai du joueur :** Le joueur soumet un nom de ville via l'interface de recherche.
3. **Calculs :** La distance et direction sont calculées et ajoutées à la liste des essais.
4. **Vérification :**
   - *Si correspond :* État `won`. Si mode Histoire, progression sauvegardée.
   - *Si 6 essais atteints :* État `lost`.
   - *Sinon :* Dézoom dynamique pour aider le joueur.

### 4.2 Flux Multijoueur (Socket.io)
1. **Création / Connexion :** Le joueur A (hôte) crée une room. Le serveur crée un `RoomState`. Le joueur B rejoint via le code.
2. **Lancement :** L'hôte démarre. Le serveur génère 10 villes et broadcast `game_started`.
3. **Pendant la manche :** Les clients gèrent leurs essais localement. À la fin, ils émettent `submit_round`.
4. **Score :** Le serveur met à jour le score (max 1000 - pénalités).
5. **Fin de Manche :** Si tous ont fini : timeout 3s → `next_round` ou `game_over`.

### 4.3 Flux Contre-la-montre (Time Attack)
1. Le chronomètre démarre à 120 secondes.
2. Réussite : +points, +30s, prochaine ville.
3. Échec : -20s, prochaine ville.
4. Fin du temps : score soumis via socket. Leaderboard Top 100.

### 4.4 Flux Plus ou Moins / Nord ou Sud
1. **Initialisation :** Deux villes aléatoires (A et B) sont choisies. Score à 0.
2. **Choix :** Le joueur clique sur « Plus élevée / Plus basse » (population) ou « Plus au Nord / Plus au Sud » (latitude).
3. **Révélation :** La valeur de B est affichée. Correct → animation slide, B → A, nouvelle ville C. Incorrect → Game Over.
4. **Meilleur score** sauvegardé en `localStorage` (clé séparée pour population et latitude).

### 4.5 Flux Mode Radar
1. **Sélection difficulté :** Le joueur choisit parmi 4 niveaux. Le pool de villes cibles et le nombre d'essais sont ajustés.
2. **Partie :** Le joueur tape un nom de ville. Le jeu calcule distance et direction (Haversine + compas).
3. **Radar :** Un blip est ajouté au radar SVG. L'angle est calculé de la cible vers l'essai (`calcAngle(target, guess)`), la distance est normalisée en ratio du rayon.
4. **Victoire :** Distance < 1 km ou nom exact → écran victoire.
5. **Défaite :** Essais épuisés → écran game over avec révélation de la ville.

---

## 5. Composants Principaux

| Composant | Description |
|---|---|
| `MainMenu.tsx` | Menu principal avec grille de sélection des 9 modes |
| `GameOverlay.tsx` | Interface de jeu solo (carte, recherche, indices, résultats) |
| `MapComponent.tsx` / `MapWrapper.tsx` | Carte Leaflet interactive avec marqueurs |
| `SearchInput.tsx` | Champ de recherche avec autocomplétion des villes |
| `StoryMenu.tsx` | Menu du mode histoire (catégories, niveaux, progression) |
| `DepartmentMenu.tsx` | Sélection de département |
| `EuropeMenu.tsx` | Sélection de pays européen |
| `DailyMenu.tsx` | Menu du défi quotidien |
| `HigherLowerGame.tsx` | Modes Plus ou Moins et Nord ou Sud (générique via `gameType`) |
| `MiniMapNorthSouth.tsx` | Mini-carte Leaflet circulaire avec dégradé N/S et expansion en plein écran |
| `RadarGame.tsx` | Mode Radar complet (difficulté, radar SVG, recherche, historique) |
| `MultiplayerMenu.tsx` / `Lobby.tsx` | Création/rejoindre une room multijoueur |
| `MultiplayerGameOverlay.tsx` | Interface de jeu multijoueur |
| `LiveLeaderboard.tsx` | Classement temps réel du mode Time Attack |
