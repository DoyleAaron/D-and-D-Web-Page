# D&D Web Page - Dayner Campaign

An interactive web application for managing and exploring the world of Dayner, a custom D&D campaign setting. This project includes an interactive map, lore documentation, character tracking, and various DM tools.

---

## 📁 Project Structure

```
D-and-D-Web-Page/
├── index.html              # Main entry point - website homepage
├── map.html                # Interactive map of Dayner
├── map.jpg                 # Map image asset
├── intro.mp4               # Introduction video
│
├── analysis/               # Map & data analysis tools
├── config/                 # Configuration files (Firebase, Vercel)
├── data/                   # JSON data files
├── docs/                   # Documentation & reference materials
├── scripts/                # JavaScript & Python utility scripts
├── tests/                  # Test files
├── tools/                  # Interactive HTML tools for map editing
│
├── DM_Private/             # 🔒 DM-only content (not for players!)
├── Lore/                   # 📚 Public campaign lore & world-building
└── static/                 # 🎨 Static assets (CSS, JS, images, audio)
```

---

## 📂 Folder Contents

### 🗂️ `/analysis/` - Analysis Pages
HTML pages for analyzing and visualizing map data:

| File | Description |
|------|-------------|
| `analyze-roads.html` | Road network analysis tool |
| `map-analysis.html` | General map data analysis |
| `map-visualization.html` | Map visualization interface |
| `road-analysis.html` | Detailed road connection analysis |
| `water-analysis.html` | Water regions and boundaries analysis |

---

### ⚙️ `/config/` - Configuration Files
Project configuration for deployment and services:

| File | Description |
|------|-------------|
| `firebase.json` | Firebase hosting configuration |
| `firestore.indexes.json` | Firestore database indexes |
| `firestore.rules` | Firestore security rules |
| `vercel.json` | Vercel deployment configuration |

---

### 📊 `/data/` - JSON Data Files
Data files used by the application:

| File | Description |
|------|-------------|
| `ship-route-errors.json` | Ship route validation errors log |
| `ship-route-validation.json` | Ship route validation results |

---

### 📖 `/docs/` - Documentation
Reference materials and project documentation:

| File | Description |
|------|-------------|
| `DAYNER_GEOGRAPHY_REFERENCE.md` | Geographic reference for the world of Dayner |
| `DaynerSettlements.md` | List and details of all settlements |
| `FIREBASE_SETUP.md` | Instructions for Firebase setup |
| `PORT_CONNECTIONS.md` | Port and harbor connection documentation |
| `SHIP_ROUTE_TASKS.md` | Ship route implementation tasks |
| `SHIP_ROUTES_TASK.md` | Additional ship routing documentation |

---

### 📜 `/scripts/` - Utility Scripts
JavaScript and Python scripts for data processing and analysis:

#### JavaScript Files
| File | Description |
|------|-------------|
| `analyze-boundaries.js` | Analyze map region boundaries |
| `analyze-land-borders.js` | Analyze land border connections |
| `dayner-map-data.js` | Main map data definitions |
| `map-coordinates.js` | Map coordinate system utilities |
| `map-scale.js` | Map scale and distance calculations |
| `road-data.js` | Road network data definitions |
| `validate-ship-routes.js` | Ship route validation logic |
| `water-land-boundaries.js` | Water-land boundary definitions |
| `water-regions-corrected.js` | Corrected water region data |

#### Python Files
| File | Description |
|------|-------------|
| `cross_reference_linker.py` | Cross-reference linking utility for lore |
| `lore_stats.py` | Statistics and analysis for lore content |

---

### 🧪 `/tests/` - Test Files
Test pages for validating functionality:

| File | Description |
|------|-------------|
| `test.html` | General test page |
| `test-content.html` | Content display tests |
| `test-road-network.html` | Road network functionality tests |

---

### 🛠️ `/tools/` - Interactive Tools
HTML-based tools for map editing and data management:

| File | Description |
|------|-------------|
| `marker-tool.html` | Add/edit map markers and locations |
| `region-tool.html` | Define and edit map regions |
| `road-tool.html` | Create and modify road networks |
| `ship-route-tool.html` | Design ship travel routes |

---

### 🔒 `/DM_Private/` - Dungeon Master Content
**⚠️ SPOILER WARNING: Players should not access this folder!**

Private DM notes, session planning, and secret information:

```
DM_Private/
├── To Do DND.md            # DM task list
├── Characters/             # Character sheets and stats
│   ├── Animals/            # Animal companions & creatures
│   │   └── Fantasy/        # Fantasy creature stats
│   ├── Important/          # Key NPCs and plot characters
│   ├── Magical/            # Magical beings
│   └── NPCs/               # General NPC information
├── Creatures/              # Custom creature definitions
├── Guilds/                 # Guild information and missions
├── Party/                  # Party tracking
│   ├── Date.md             # In-game date tracking
│   ├── Exp.md              # Experience points log
│   ├── Inventory.md        # Party inventory
│   └── Notes.md            # General party notes
└── Sessions/               # Session planning and notes
    ├── Campaign one plot.md
    ├── Session 1-14.md     # Individual session notes
    ├── Notes/              # Additional session notes
    └── Session Story/      # Story progression tracking
```

---

### 📚 `/Lore/` - Campaign Lore
Public world-building content accessible to players:

```
Lore/
└── DND/
    ├── DND.md                          # Main lore index
    ├── Character Lore.md               # Character lore overview
    ├── CHARACTER_LOCATION_TRACKING.md  # Character locations
    ├── CONSISTENCY_AUDIT.md            # Lore consistency notes
    ├── CROSS_REFERENCE_TRACKING.md     # Cross-reference system
    ├── General Lore of Dayner.md       # World overview
    ├── Kingdoms.md                     # Kingdom summaries
    ├── WORLD_BUILDING_MASTER_PLAN.md   # World-building guidelines
    │
    ├── Calendar/                       # In-game date entries
    │   └── [YYYY-MM-DD.md files]
    │
    ├── Character Lore/                 # Character information
    │   ├── Beasts & Creatures/
    │   ├── Historic Characters/
    │   ├── Modern Characters/
    │   └── Player Characters/
    │
    ├── General 5e lore/                # Standard D&D 5e lore
    │
    ├── General Lore of Dayner/         # World details
    │   ├── Demographics/
    │   ├── Geography & Climate/
    │   ├── History/
    │   ├── Organizations/
    │   ├── Politics/
    │   └── Religion/
    │
    ├── Kingdoms/                       # Individual kingdom lore
    │   ├── Braewood/
    │   ├── Islefield/
    │   ├── Kluimont/
    │   └── Lavalto/
    │
    └── Sessions/                       # Session summaries (player-safe)
        └── Notes/
```

---

### 🎨 `/static/` - Static Assets
Frontend assets for the web application:

```
static/
├── audio/                  # Background music and sound effects
│
├── css/                    # Stylesheets
│   ├── auth.css            # Authentication page styles
│   ├── base.css            # Base/reset styles
│   ├── calendar.css        # Calendar component styles
│   ├── components.css      # Reusable component styles
│   ├── layout.css          # Page layout styles
│   ├── map.css             # Map interface styles
│   ├── quiz.css            # Quiz feature styles
│   ├── responsive.css      # Mobile/responsive styles
│   ├── sidebar.css         # Sidebar navigation styles
│   └── variables.css       # CSS custom properties
│
├── images/                 # Character portraits and graphics
│   └── [Character].png/jpg # Character images
│
└── js/                     # JavaScript modules
    ├── auth.js             # Authentication logic
    ├── checklist.js        # Checklist functionality
    ├── firebase-config.js  # Firebase initialization
    ├── inventory.js        # Inventory management
    ├── journal.js          # Journal/notes functionality
    ├── main.js             # Main application logic
    ├── map.js              # Interactive map logic
    ├── quiz.js             # Lore quiz functionality
    ├── road-network.js     # Road pathfinding system
    ├── road-network-tests.js # Road network tests
    └── tests.js            # General test utilities
```

---

## 🚀 Getting Started

### Prerequisites
- Web browser (Chrome, Firefox, Edge recommended)
- Firebase account (for full functionality)
- Node.js (optional, for local development)

### Running Locally
1. Clone the repository
2. Open `index.html` in a web browser
3. Or use a local server: `python -m http.server 8000`

### Deployment
The site is configured for deployment on:
- **Vercel** - see `config/vercel.json`
- **Firebase Hosting** - see `config/firebase.json`

---

## 🗺️ Features

- **Interactive Map** - Explore the world of Dayner with clickable regions, cities, and routes
- **Lore Database** - Searchable collection of world lore, characters, and history
- **Travel Calculator** - Calculate travel times via roads or ship routes
- **Session Journal** - Track campaign progress and party notes
- **DM Tools** - Private tools for campaign management

---

## 📝 For Dungeon Masters

The `DM_Private/` folder contains sensitive campaign information. Make sure to:
- Keep this folder excluded from player-accessible deployments
- Use the session notes for campaign planning
- Track party progress in the `Party/` subfolder

---

## 🤝 Contributing

This is a personal campaign project, but feel free to use it as inspiration for your own D&D web tools!

---

*Welcome to Dayner. May your adventures be legendary.*
