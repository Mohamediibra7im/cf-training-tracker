# Contributing to Training Tracker

Thank you for your interest in contributing to the Training Tracker project! We welcome contributions from the competitive programming community. Please read the following guidelines to help you get started.

## Ways to Contribute

- 🐛 **Report Bugs**: Open an issue with detailed bug reports.
- 💡 **Feature Requests**: Suggest new features or improvements.
- 📝 **Code Contributions**: Submit pull requests for bug fixes or new features.
- 📚 **Documentation**: Help improve documentation and guides.
- 🌟 **Star the Repository**: Show your support by starring the project.

## Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

## Code Style

- Follow the existing code style and formatting.
- Use TypeScript for all new code.
- Write meaningful commit messages.
- Add tests for new features when possible.

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/training-tracker.git
   cd training-tracker
   ```
2. **Install dependencies**
   ```bash
   npm install
   # If you encounter peer dependency issues, use:
   npm install --legacy-peer-deps
   ```
3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
4. **Run the development server**
   ```bash
   npm run dev
   ```
5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

Made with ❤️ for the competitive programming community.

