# 🚀 CP - Training Tracker

> **Master competitive programming with intelligent practice sessions, track your progress, and climb the Codeforces ladder.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-View%20App-blue?style=flat&logo=vercel&logoColor=white)](https://cf-training-tracker.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.5-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.19.0-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

## 📖 Overview

Training Tracker is a comprehensive web application designed to help competitive programmers improve their skills through structured practice sessions. The app integrates with Codeforces API to provide personalized problem recommendations, track performance metrics, and visualize progress over time.

### 🎯 Key Features

- **🎲 Smart Problem Generation**: Generate random problems with customizable difficulty levels and tags
- **📊 Performance Analytics**: Track your solving speed, accuracy, and rating progression
- **🔥 Activity Heatmap**: Visualize your daily practice activity with an interactive heatmap
- **📈 Progress Charts**: Monitor your performance trends and improvement over time
- **🏷️ Tag-based Filtering**: Practice specific topics like DP, Graph Theory, or Data Structures
- **⚡ Real-time Sync**: Automatically sync with your Codeforces profile
- **🌙 Dark/Light Mode**: Beautiful UI with theme switching capability
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend

- **Next.js** - React framework with App Router
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization library
- **@uiw/react-heat-map** - Activity heatmap visualization
- **SWR** - Data fetching and caching
- **next-themes** - Theme switching (dark/light mode)
- **input-otp** - One-time password input component

### Backend & Data

- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Codeforces API** - Problem and user data
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **rate-limiter-flexible** - API rate limiting

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Vercel Analytics** - Performance monitoring

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB (for local development)

### Installation

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

## 📱 Usage Guide

### 1. Getting Started

- Enter your Codeforces handle on the home page
- The app will automatically fetch your profile data and submission history
- Set up your PIN for secure access (optional)

### 2. Training Sessions

- Navigate to the **Training** page
- Choose your preferred difficulty level or set custom ratings
- Select specific tags to focus on particular topics
- Generate problems and start your training session
- Track your progress in real-time

### 3. Performance Tracking

- View detailed statistics on the **Statistics** page
- Analyze your solving patterns with interactive charts
- Monitor your rating progression over time
- Review your activity heatmap

### 4. Upsolved Problems

- Access the **Upsolve** page to review problems you couldn't solve during training
- Track your improvement on previously attempted problems

## 🏗️ Project Structure

```
training-tracker/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── training/          # Training session page
│   ├── statistics/        # Analytics page
│   ├── upsolve/          # Upsolved problems page
│   └── reset-pin/        # PIN reset page
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── ActivityHeatmap.tsx
│   ├── ProgressChart.tsx
│   ├── Trainer.tsx
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
├── models/               # MongoDB schemas
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Features in Detail

### Smart Problem Generation

The app uses advanced algorithms to generate problems that match your current skill level and learning goals. Problems are selected based on:

- Your current Codeforces rating
- Historical performance on similar problems
- Selected difficulty range and tags
- Problem quality and popularity

### Performance Analytics

Comprehensive analytics help you understand your strengths and areas for improvement:

- **Solving Speed**: Track how quickly you solve problems
- **Accuracy Rate**: Monitor your success rate across different difficulties
- **Rating Progression**: Visualize your rating changes over time
- **Topic Mastery**: Identify which topics you excel at or need more practice

### Activity Tracking

- **Daily Heatmap**: See your practice consistency with a GitHub-style activity map
- **Session History**: Review all your training sessions with detailed metrics
- **Progress Charts**: Interactive charts showing your improvement trends

## 🤝 Contributing

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for guidelines on how to contribute to this project.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Inspiration**: This project is inspired by the excellent blog post on [Codeforces](https://codeforces.com/blog/entry/136704) by [pwned](https://codeforces.com/profile/pwned)
- **Rating Calculations**: Performance and rating calculations are based on the methodology described in the aforementioned blog post
- **Community**: Thanks to the competitive programming community for feedback and suggestions

---

<div align="center">
  <p>Made with ❤️ for the competitive programming community</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
