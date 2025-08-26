# React Native Movie App - README

<h1 align="center">React Native Movie App</h1>
<p align="center">A feature-rich movie discovery and bookmarking application built with React Native and Expo</p>

# Video Clip: https://youtu.be/qLm-KBGVrGs?si=kTAxl1Ynn7yrD8cW

## 📱 Overview

The React Native Movie App is a mobile application that allows users to discover popular movies, search for specific titles, view detailed information, and save their favorite movies for later reference. The app integrates with The Movie Database (TMDB) API for movie data and uses Appwrite as a backend service for user data and analytics.

## ✨ Features

- **Movie Discovery**: Browse popular and trending movies
- **Search**: Find movies by title with real-time search results
- **Movie Details**: View comprehensive information about any movie
- **Save Movies**: Bookmark favorite movies for later viewing
- **Trending Analytics**: See what movies are popular among users
- **Beautiful UI**: Visually appealing interface with smooth animations

## 🛠️ Tech Stack

- **React Native**: Core framework for mobile development
- **Expo**: Development platform for React Native
- **TypeScript**: Type-safe JavaScript
- **NativeWind**: Tailwind CSS for React Native styling
- **Expo Router**: File-based navigation system
- **Appwrite**: Backend as a Service for database and user data
- **TMDB API**: Movie data source

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI
- TMDB API Key
- Appwrite Account

### Installation

1. Clone the repository

```bash
git clone https://github.com/AlienX77-cmd/React-Native-Movie-App.git
cd React-Native-Movie-App
```

2. Install dependencies

```bash
npm install
# or
yarn
```

3. Configure environment variables
   Create a `.env` file in the root directory with the following variables:

```
EXPO_PUBLIC_MOVIE_API_KEY=your_tmdb_api_key
EXPO_PUBLIC_APPWRITE_PROJECT_ID=your_appwrite_project_id
EXPO_PUBLIC_APPWRITE_DATABASE_ID=your_appwrite_database_id
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=your_appwrite_collection_id
EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_ID=your_appwrite_saved_movies_id
```

4. Start the development server

```bash
npm start
# or
yarn start
```

5. Launch on your preferred platform

```bash
# For iOS
npm run ios

# For Android
npm run android
```

## 📁 Project Structure

```
React-Native-Movie-App/
├── app/                    # Expo Router screens
│   ├── (tabs)/             # Tab-based screens
│   └── movie/              # Movie details
├── assets/                 # Static assets
├── components/             # Reusable components
├── constants/              # App constants
├── interfaces/             # TypeScript interfaces
├── services/               # API and backend services
├── types/                  # Type definitions
└── docs/                   # Documentation
```

## 📚 Documentation

Detailed documentation is available in the `docs` folder:

- [System Architecture](./docs/SystemArchitecture.md)
- [Architecture Diagrams](./docs/ArchitectureDiagrams.md)
- [Database Schema](./docs/DatabaseSchema.md)
- [API Integration](./docs/APIIntegration.md)
- [Component Structure](./docs/ComponentStructure.md)
- [Developer Guide](./docs/DeveloperGuide.md)

## 🧩 Core Components

- **MovieCard**: Displays movie information in a card layout
- **SearchBar**: Input component for searching movies
- **SaveButton**: Button for saving/unsaving movies
- **TrendingCard**: Special component for trending movies

## 🔄 Data Flow

1. **Movie Data**: Fetched from TMDB API
2. **User Data**: Stored in Appwrite backend
3. **Events**: Managed through custom event system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [TMDB](https://www.themoviedb.org/) for providing the movie data API
- [Appwrite](https://appwrite.io/) for backend services
- [Expo](https://expo.dev/) for React Native tooling
- [NativeWind](https://www.nativewind.dev/) for styling utilities



