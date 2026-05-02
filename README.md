# ⚽ FootballStats — Full-Stack Statistics Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green.svg)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg)](https://tailwindcss.com/)

A professional, feature-rich football statistics platform providing real-time match data, comprehensive player analytics, and automated news aggregation. Built with a focus on high performance, modern design aesthetics, and seamless user experience.

---

## 🌟 Key Features

### 🔴 Live Match Dashboard
- **Real-Time Scores**: Automatic polling for live matches across major European leagues (PL, La Liga, Serie A, etc.).
- **Match Timelines**: Detailed event logs including goals (scorers/assists), cards, and substitutions.
- **League Filters**: Quickly filter matches by competition, date, or status.

### 📊 Advanced Player & Team Analytics
- **Attribute Visualization**: Interactive Radar charts for player skill analysis (Speed, Shooting, Passing, etc.).
- **Performance Tracking**: Bar charts showing season-by-season goal and appearance trends.
- **Squad Rosters**: Complete team lists with player positions, nationalities, and market insights.

### 🆚 Player Comparison Tool
- **Side-by-Side Analytics**: Select any two players to compare their career stats and physical profiles.
- **Dynamic Metrics**: Instant visual feedback highlighting superior statistics in green.

### 📰 News Aggregator
- **Automated Sync**: Background cron jobs fetch the latest football news from BBC Sport, Sky Sports, and The Guardian.
- **Featured Articles**: High-impact news layout with external link integration.

---

## 🛠️ Tech Stack

**Frontend:**
- React 18 (Vite)
- Tailwind CSS (Premium Dark Theme)
- Recharts (Data Visualization)
- Lucide React (Icons)
- Axios & React Router v6

**Backend:**
- Node.js & Express
- SQLite (better-sqlite3) for high-performance local storage
- Node-Cron for automated data synchronization
- RSS-Parser for news aggregation

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A [Football-Data.org](https://www.football-data.org/) API Key (Free tier supported)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gnanesh-coder/Football-Statistics-Platform.git
   cd Football-Statistics-Platform
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=3001
   FOOTBALL_DATA_API_KEY=your_api_key_here
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

The app will be available at `http://localhost:5173`.

---

## 📸 Screenshots

| Dashboard Overview | Player Comparison |
| :--- | :--- |
| ![Dashboard](file:///C:/Users/user/.gemini/antigravity/brain/05e60dcc-0b50-4ee4-90f0-9ba00ac493bc/.system_generated/click_feedback/click_feedback_1777730311649.png) | ![Comparison](file:///C:/Users/user/.gemini/antigravity/brain/05e60dcc-0b50-4ee4-90f0-9ba00ac493bc/compare_players_png_1777730902385.png) |

| Player Analytics | League Standings |
| :--- | :--- |
| ![Analytics](file:///C:/Users/user/.gemini/antigravity/brain/05e60dcc-0b50-4ee4-90f0-9ba00ac493bc/player_detail_png_1777730929812.png) | ![Standings](file:///C:/Users/user/.gemini/antigravity/brain/05e60dcc-0b50-4ee4-90f0-9ba00ac493bc/.system_generated/click_feedback/click_feedback_1777730385242.png) |

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.

---
*Created with ❤️ by [Gnanesh](https://github.com/gnanesh-coder)*
