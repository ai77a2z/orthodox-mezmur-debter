# Amharic Mezmur - Ethiopian Hymns Collection

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

A modern web application for discovering, sharing, and managing Amharic hymns and spiritual songs. This platform allows users to browse, search, and contribute to a growing collection of Ethiopian Christian hymns.

## 🌟 Features

- **Browse Hymns**: Explore a curated collection of Amharic hymns
- **User Accounts**: Create an account to save favorites and submit hymns
- **Admin Dashboard**: Manage hymn submissions and user content
- **Responsive Design**: Works on desktop and mobile devices
- **Easy Submission**: Simple form to submit new hymns
- **Search Functionality**: Find hymns by title, author, or lyrics

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (comes with Node.js)
- SQLite (included with the project)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/amharic-mezmur.git
   cd amharic-mezmur
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   node index.js
   ```
   The backend will start on `http://localhost:3001`

2. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 📂 Project Structure

```
amharic-mezmur/
├── backend/           # Node.js/Express server
│   ├── index.js      # Main server file
│   ├── db.js         # Database configuration
│   └── package.json  # Backend dependencies
├── frontend/         # React frontend
│   ├── src/          # Source files
│   └── public/       # Static files
└── README.md         # This file
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- All contributors who help maintain and grow this collection
- The Ethiopian Orthodox Tewahedo Church for preserving these hymns
- The open-source community for their invaluable tools and libraries

## 📬 Contact

For questions or support, please contact us at [support@amharicmezmur.com](mailto:support@amharicmezmur.com)

---

<div align="center">
  Made with ❤️ for the Ethiopian Christian community
</div>
