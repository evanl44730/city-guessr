# Spécifications du Projet : CityGuessr

Ce document détaille l'architecture, les modèles de données, les flux principaux et toutes les fonctionnalités de l'application **CityGuessr**.

> **⚠️ RÈGLE DE MAINTENANCE :** Ce fichier (`SPECS.md`) et le fichier `README.md` doivent **obligatoirement** être mis à jour à chaque modification du code source (ajout/suppression/modification de fonctionnalité, de composant, de modèle de données ou de flux). Toute pull request ou session de développement qui modifie le comportement de l'application doit inclure la mise à jour correspondante de ces deux fichiers.

---

## 1. Vue d'ensemble de l'Architecture

Le projet utilise une architecture moderne basée sur du JavaScript/TypeScript (Full-stack) :
- **Framework Frontend/Backend :** Next.js (App Router)
- **Serveur Personnalisé :** Un serveur Node.js (`server.js`) gère à la fois l'application Next.js et un serveur **Socket.io** permettant les fonctionnalités multijoueurs en temps réel.
- **Cartographie :** Leaflet (via `react-leaflet`) pour l'affichage interactif de la carte et des marqueurs. Utilisé dans le mode solo, histoire, département, Europe, Le Juste km, Chrono Départements, L'Ombre Mystère, et dans la mini-carte du mode Nord ou Sud.
- **GeoJSON :** Fichiers GeoJSON (`france-departments-dom.geojson`, `europe.geojson`) pour le rendu des silhouettes (L'Ombre Mystère) et de la carte interactive (Chrono Départements).
- **Calculs géographiques :** Fonctions utilitaires maison (`utils/gameUtils.ts`) utilisant la formule de Haversine pour le calcul de distance et les compas 8 points pour la direction.
- **Stockage de données :**
  - **Côté Client :** `localStorage` pour la sauvegarde de la progression du mode Histoire, des meilleurs scores (Plus ou Moins, Nord ou Sud, Radar, Le Juste km, L'Ombre Mystère, Chrono Départements) et des séries Radar par difficulté.
  - **Côté Serveur (Mémoire) :** Stockage en mémoire RAM pour les instances de parties multijoueurs (Rooms) et le classement mondial (Leaderboard) du mode Contre-la-montre.
  - **Base de données :** Supabase pour le stockage persistant (configuration dans `lib/supabaseClient.ts`).
  - **Données Statiques :** Liste des villes stockée dans un fichier JSON (`data/cities.json`), les niveaux du Mode Histoire dans `data/storyLevels.ts`, la liste des départements français dans `data/departments.ts`, et la liste des pays européens dans `data/europe.ts`.
- **Style :** Tailwind CSS v4.
- **Socket Client :** Configuration centralisée dans `lib/socket.ts`.

---

## 2. Fonctionnalités Principales

L'application propose **12 modes de jeu** basés sur la géographie, ainsi qu'une **page Profil**.

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
- Menu dédié (`OnlineMenu.tsx`) pour créer ou rejoindre une room avec saisie de pseudo.
- Un hôte crée la partie et lance un nombre défini de manches (10 par défaut).
- Les joueurs devinent la même ville simultanément. La manche se termine lorsque tous les joueurs ont trouvé ou épuisé leurs essais.
- Score dynamique basé sur le nombre d'essais. Transition automatique entre manches (3s).
- Personnalisation par l'hôte : choix du mode de jeu (France, Europe, Capitales), inclusion/exclusion de catégories, nombre de manches.

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
- **Progression de série** : Le joueur avance au niveau suivant s'il devine correctement. Meilleures séries sauvegardées par difficulté dans `localStorage` (clé `radarBestStreaks`).
- **Victoire/Défaite** : Écrans dédiés avec possibilité de rejouer ou changer la difficulté.
- Composant : `RadarGame.tsx`.

### 2.10 Mode L'Ombre Mystère (« Shape »)
- **Objectif :** Identifier un département français ou un pays européen à partir de sa **silhouette** (forme GeoJSON blanche sur fond sombre).
- **Mécanique :**
  - 50 % de chances d'obtenir un département, 50 % un pays européen.
  - La silhouette est affichée sur une carte Leaflet sans fond (GeoJSON blanc, no-border).
  - 4 propositions de réponse (1 correcte + 3 distracteurs tirés du même pool).
  - Bonne réponse → +1 point, transition automatique 1,5 s vers la prochaine manche.
  - Mauvaise réponse → Game Over, possibilité de rejouer.
- **Score sans fin** : Enchaînement infini de manches tant que le joueur ne se trompe pas.
- **Meilleur score** sauvegardé dans `localStorage` (clé `shapeGameBestScore`).
- Composant : `ShapeGame.tsx`.
- Données GeoJSON chargées depuis `/data/france-departments-dom.geojson` et `/data/europe.geojson`.

### 2.11 Mode Le Juste Kilomètre (« Distance »)
- **Objectif :** Estimer la distance à vol d'oiseau entre deux villes françaises.
- **Mécanique :**
  - 10 manches au total. À chaque manche, deux villes (> 10 000 habitants) sont affichées.
  - Le joueur déplace un **slider** (10 km → 2 000 km) pour estimer la distance.
  - Score par manche : 0—1 000 points selon la précision (< 2 % d'erreur = 1 000 pts, ≥ 100 % d'erreur = 0 pts).
  - Après validation, une carte Leaflet montre les deux villes reliées par une ligne pointillée avec la distance réelle et l'erreur.
- **Score final** sur 10 000. **Meilleur score** sauvegardé dans `localStorage` (clé `distanceGameBest`).
- Labels de précision : Parfait, Excellent, Bien joué, Pas mal, Raté.
- Composant : `DistanceGame.tsx`.

### 2.12 Mode Chrono Départements (« Department Time Attack »)
- **Objectif :** Cliquer sur **tous les départements français** (métropole + DOM-TOM) le plus rapidement possible.
- **Mécanique :**
  - Un département cible est affiché avec son nom et son code. Le joueur doit le localiser sur la carte GeoJSON interactive de la France.
  - Les départements sont présentés dans un **ordre aléatoire**.
  - **Clic correct** → le département passe en vert, prochain département affiché.
  - **Clic incorrect** → flash rouge + pénalité de **+5 secondes**.
  - Les DOM-TOM (971, 972, 973, 974, 976) sont affichés dans un panneau latéral d'encarts miniatures.
- **Chronomètre** en temps réel (dixièmes de seconde). Le temps le plus bas gagne.
- **Meilleur temps** sauvegardé dans `localStorage` (clé `deptTimeAttackBest`).
- Composant : `DepartmentTimeAttack.tsx`.

### 2.13 Page Profil (« Mon Profil »)
- **Récapitulatif** des statistiques du joueur : étoiles du mode Histoire, niveaux complétés, nombre de records établis.
- **Carte de Chaleur Personnelle (Heatmap)** : Carte Leaflet (`Heatmap.tsx` importé dynamiquement sans SSR) affichant des marqueurs (`CircleMarker`) pour toutes les villes trouvées dans les différents modes de jeu.
- **Grille des Succès (Achievements)** : Liste de 26 badges dynamiques répartis en 4 catégories visuelles (Exploration, Histoire, Défis & Records, Insolites). Courbe très progressive (ex. 1 ➔ 1000 villes). **[NOUVEAU]** : Notifications "Toast" animées affichées en temps réel lorsqu'un succès est débloqué pendant une partie.
- **Grille des meilleurs scores** pour chaque mode de jeu : Contre-la-montre, Plus ou Moins, Nord ou Sud, L'Ombre Mystère, Le Juste km, Chrono Départements.
- **Section Radar** : Meilleures séries par difficulté (Facile, Moyen, Difficile, Expert).
- **Réinitialisation** : Bouton pour effacer tous les records, la progression du mode Histoire, la Heatmap et les Succès via `localStorage.removeItem`.
- Composant : `ProfilePage.tsx`.

---

## 3. Modèles de Données

### 3.1 Données des Villes (`CityData`)
Représente une ville (issu de `cities.json`) :
- `name` (string) : Nom de la ville.
- `zip` (string) : Code postal (utilisé pour filtrer par département).
- `population` (number) : Nombre d'habitants (utilisé par Plus ou Moins, Radar, Le Juste km).
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

### 3.7 Données des Départements (`DEPARTMENTS`)
Liste statique dans `data/departments.ts` :
- `id` (string) : Code du département (ex: '31', '75', '971').
- `name` (string) : Nom du département (ex: 'Haute-Garonne', 'Paris').

### 3.8 Données des Pays Européens (`EUROPEAN_COUNTRIES`)
Liste statique dans `data/europe.ts` :
- `id` (string) : Code ISO 2 lettres (ex: 'FR', 'ES').
- `name` (string) : Nom du pays (ex: 'France', 'Espagne').

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
1. **Création / Connexion :** Le joueur A (hôte) crée une room via `OnlineMenu.tsx`. Le serveur crée un `RoomState`. Le joueur B rejoint via le code.
2. **Lancement :** L'hôte démarre. Le serveur génère les villes et broadcast `game_started`.
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
4. **Victoire :** Distance < 1 km ou nom exact → écran victoire. Le joueur avance au niveau suivant.
5. **Défaite :** Essais épuisés → écran game over avec révélation de la ville.

### 4.6 Flux L'Ombre Mystère (Shape)
1. **Chargement :** GeoJSONs France + Europe chargés au montage.
2. **Génération de manche :** Un territoire aléatoire (50 % département, 50 % pays) est sélectionné. Sa silhouette s'affiche.
3. **Choix :** Le joueur clique sur une des 4 propositions.
4. **Résultat :** Bonne réponse → +1, auto-transition 1,5 s. Mauvaise → Game Over.
5. **Meilleur score** sauvegardé dans `localStorage`.

### 4.7 Flux Le Juste Kilomètre (Distance)
1. **Initialisation :** 10 paires de villes sont pré-générées.
2. **Estimation :** Le joueur déplace le slider pour estimer la distance.
3. **Validation :** Le score est calculé selon la précision. La carte montre les deux villes.
4. **Fin :** Après 10 manches, score final affiché avec record.

### 4.8 Flux Chrono Départements (Department Time Attack)
1. **Chargement :** GeoJSON France chargé. Les départements sont mélangés aléatoirement.
2. **Chronomètre :** Le timer démarre en dixièmes de seconde.
3. **Clic correct :** Le département passe en vert, prochain département ciblé.
4. **Clic incorrect :** Flash rouge + pénalité +5 s.
5. **Fin :** Tous les départements trouvés → temps final affiché avec meilleur temps.

---

## 5. Composants Principaux

| Composant | Description |
|---|---|
| `MainMenu.tsx` | Menu principal avec grille de sélection des 12 modes + bouton profil |
| `GameOverlay.tsx` | Interface de jeu solo (carte, recherche, indices, résultats) |
| `MapComponent.tsx` / `MapWrapper.tsx` | Carte Leaflet interactive avec marqueurs |
| `SearchInput.tsx` | Champ de recherche avec autocomplétion des villes |
| `StoryMenu.tsx` | Menu du mode histoire (catégories, niveaux, progression) |
| `DepartmentMenu.tsx` | Sélection de département |
| `EuropeMenu.tsx` | Sélection de pays européen |
| `EuropeMapSelector.tsx` | Carte interactive de sélection de pays européen |
| `FranceMapSelector.tsx` | Carte interactive de sélection de département français |
| `DailyMenu.tsx` | Menu du défi quotidien |
| `HigherLowerGame.tsx` | Modes Plus ou Moins et Nord ou Sud (générique via `gameType`) |
| `MiniMapNorthSouth.tsx` | Mini-carte Leaflet circulaire avec dégradé N/S et expansion en plein écran |
| `RadarGame.tsx` | Mode Radar complet (difficulté, radar SVG, recherche, historique) |
| `ShapeGame.tsx` | Mode L'Ombre Mystère (silhouettes GeoJSON, quiz 4 choix) |
| `DistanceGame.tsx` | Mode Le Juste Kilomètre (slider distance, carte résultat) |
| `DepartmentTimeAttack.tsx` | Mode Chrono Départements (carte cliquable, chronomètre) |
| `OnlineMenu.tsx` | Menu de création/rejoindre une room multijoueur (pseudo + code) |
| `MultiplayerMenu.tsx` / `Lobby.tsx` | Configuration et lobby multijoueur |
| `MultiplayerGameOverlay.tsx` | Interface de jeu multijoueur |
| `LiveLeaderboard.tsx` | Classement temps réel du mode Time Attack |
| `ProfilePage.tsx` | Page Profil : records, statistiques, séries Radar, réinitialisation |

---

## 6. Données Statiques

| Fichier | Description |
|---|---|
| `data/cities.json` | Base de données des villes (nom, coordonnées, population, code postal, catégories) |
| `data/storyLevels.ts` | Niveaux prédéfinis et fonctions de génération dynamique pour le mode Histoire |
| `data/departments.ts` | Liste des 101 départements français (id + nom) |
| `data/europe.ts` | Liste des pays européens supportés (id ISO + nom) |
| `public/data/france-departments-dom.geojson` | GeoJSON des départements français (métropole + DOM-TOM) |
| `public/data/europe.geojson` | GeoJSON des pays européens |

---

## 7. Clés `localStorage`

| Clé | Mode | Contenu |
|---|---|---|
| `city_guessr_story_progress` | Histoire | Progression des niveaux (JSON) |
| `city_guessr_daily_progress` | Défi du Jour | Progression quotidienne |
| `higherLowerBestScore` | Plus ou Moins | Meilleur score (population) |
| `higherLowerLatitudeBestScore` | Nord ou Sud | Meilleur score (latitude) |
| `timeAttackBestScore` | Contre-la-montre | Meilleur score |
| `shapeGameBestScore` | L'Ombre Mystère | Meilleur score |
| `distanceGameBest` | Le Juste km | Meilleur score (sur 10 000) |
| `deptTimeAttackBest` | Chrono Départements | Meilleur temps (dixièmes de s) |
| `radarBestStreaks` | Radar | Meilleures séries par difficulté (JSON) |
| `city_guessr_found_cities` | Global / Heatmap | Liste des villes trouvées (ID/Coordonnées/Infos stockées en JSON) |
