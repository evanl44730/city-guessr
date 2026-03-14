# CityGuessr 🌍

CityGuessr est une application web interactive de jeux géographiques. Le concept central : deviner l'emplacement de villes grâce à des indices visuels et géographiques.

## 🚀 Modes de Jeu

### 🗺️ Modes classiques (avec carte)
- **France** — Devinez une ville aléatoire en France métropolitaine ou DOM-TOM. 6 essais, avec dézoom progressif.
- **Capitales** — Testez vos connaissances sur les capitales mondiales.
- **Département** — Ciblez un département spécifique : devinez des villes uniquement dans cette zone.
- **Europe** — Choisissez un pays européen et devinez ses villes.

### 📖 Mode Histoire
- Progressez à travers des niveaux de difficulté croissante.
- Catégories : France, Capitales, départements spécifiques, pays européens.
- Progression sauvegardée localement.

### ⏱️ Contre-la-montre
- Maximum de villes en 2 minutes. Bonus de temps (+30s) / pénalité (-20s).
- **Leaderboard mondial temps réel** (Top 100) via Socket.io.

### 🌐 Multijoueur en ligne
- Salons privés (code 4 lettres). Jusqu'à plusieurs joueurs simultanés.
- Même ville pour tous, score basé sur les essais.
- Personnalisation : choix du mode, des catégories et du nombre de manches.

### 📅 Défi du Jour
- Une ville unique par jour, identique pour tous les joueurs.

### 📊 Plus ou Moins (Population)
- Deux villes affichées. Devinez laquelle a la population la plus élevée.
- Animation slide fluide. Meilleur score sauvegardé.

### 🧭 Nord ou Sud (Latitude)
- Même principe, mais comparez la **latitude** des villes.
- **Mini-carte** interactive au centre avec dégradé Nord/Sud, expandable en plein écran.

### 📡 Radar
- **Aucune carte.** Tapez des noms de villes et recevez des indices distance/direction.
- **Radar SVG animé** avec balayage rotatif et blips de triangulation.
- 4 niveaux de difficulté (Facile → Expert) contrôlant le pool de villes et le nombre d'essais.
- Progression par série : le joueur avance au niveau suivant s'il devine correctement.

### 🔮 L'Ombre Mystère
- Identifiez des **départements français** ou **pays européens** à partir de leur **silhouette**.
- 4 propositions. Score sans fin tant que le joueur ne se trompe pas.

### 📏 Le Juste Kilomètre
- Deux villes affichées. Estimez la **distance** entre elles avec un slider.
- 10 manches. Score sur 10 000 basé sur la précision.
- Carte de résultat montrant les deux villes reliées.

### 🗺️ Chrono Départements
- Trouvez **tous les départements français** sur une carte interactive le plus vite possible.
- Pénalité de +5 s par erreur. DOM-TOM affichés en encarts.

### 👤 Mon Profil
- Consultez vos **records et statistiques** pour tous les modes de jeu.
- Séries Radar par difficulté. Réinitialisation possible.

## 🛠️ Stack Technique

| Technologie | Usage |
|---|---|
| [Next.js](https://nextjs.org/) (App Router) | Frontend / Framework React 19 |
| [Tailwind CSS v4](https://tailwindcss.com/) | Style et design system |
| [Leaflet](https://leafletjs.com/) | Cartographie interactive |
| [Socket.io](https://socket.io/) | Multijoueur temps réel + Leaderboard |
| [Supabase](https://supabase.com/) | Base de données |
| Node.js (serveur custom) | Serveur WebSocket + Next.js |

## 📦 Installation

```bash
# Cloner le dépôt
git clone <URL_DU_DEPOT>
cd city-guessr

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
# ou
npm start
```

Accéder à l'application : [http://localhost:3000](http://localhost:3000)

> **Note :** Le projet utilise un Custom Server Node.js (`server.js`) qui gère conjointement Next.js et Socket.io sur le même port.

## 📂 Structure du Projet

```
├── app/                 # Pages et routing Next.js (App Router)
├── components/          # Composants React (23 fichiers)
│   ├── MainMenu.tsx     # Menu principal (12 modes + profil)
│   ├── GameOverlay.tsx  # Interface de jeu solo
│   ├── MapComponent.tsx # Carte Leaflet
│   ├── HigherLowerGame.tsx  # Plus ou Moins / Nord ou Sud
│   ├── MiniMapNorthSouth.tsx # Mini-carte avec dégradé N/S
│   ├── RadarGame.tsx    # Mode Radar (SVG animé)
│   ├── ShapeGame.tsx    # L'Ombre Mystère (silhouettes)
│   ├── DistanceGame.tsx # Le Juste Kilomètre (slider)
│   ├── DepartmentTimeAttack.tsx # Chrono Départements
│   ├── ProfilePage.tsx  # Page Profil & Records
│   ├── OnlineMenu.tsx   # Menu multijoueur (créer/rejoindre)
│   └── ...              # Menus, lobbys, leaderboard, sélecteurs de carte
├── data/                # Données statiques
│   ├── cities.json      # Base de données des villes
│   ├── storyLevels.ts   # Niveaux du mode Histoire
│   ├── departments.ts   # 101 départements français
│   └── europe.ts        # Pays européens
├── hooks/               # Hooks React (gestion d'état du jeu)
├── lib/                 # Configuration Supabase + Socket client
├── public/data/         # GeoJSONs (france-departments-dom, europe)
├── utils/               # Fonctions utilitaires (distance, direction, hints)
├── scripts/             # Scripts d'import de données
├── server.js            # Serveur Node.js (Next.js + Socket.io)
├── SPECS.md             # Spécifications techniques détaillées
└── README.md            # Ce fichier
```

## 📝 Spécifications Détaillées

Pour les détails techniques (modèles de données, flux, architecture) :
👉 **[`SPECS.md`](./SPECS.md)**

---
*Projet Next.js avec serveur Node.js embarqué.*
