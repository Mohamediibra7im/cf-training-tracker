# 📘 Comprehensive Usage Guide

Welcome to the CF Training Tracker usage guide! This document provides detailed instructions on how to use all features of the application effectively.

## 📑 Table of Contents

1. [🚀 Getting Started](#getting-started)

   - [Creating an Account](#creating-an-account)
   - [Logging In](#logging-in)
   - [Syncing Your Codeforces Profile](#syncing-your-codeforces-profile)
   - [PIN Management](#pin-management)

2. [🔔 Notification System](#notification-system)

   - [Understanding Notifications](#understanding-notifications)
   - [Notification Center](#notification-center)
   - [Managing Your Notifications](#managing-your-notifications)
   - [Admin Notification Management](#admin-notification-management)

3. [🏋️ Training Sessions](#training-sessions)

   - [Setting Up a Training Session](#setting-up-a-training-session)
   - [Difficulty Levels](#difficulty-levels)
   - [Tag Selection](#tag-selection)
   - [Problem Generation Algorithm](#problem-generation-algorithm)
   - [Working Through Problems](#working-through-problems)
   - [Submitting Solutions](#submitting-solutions)
   - [Session Results](#session-results)

4. [📊 Statistics and Analytics](#statistics-and-analytics)

   - [Performance Overview](#performance-overview)
   - [Rating Progression](#rating-progression)
   - [Activity Heatmap](#activity-heatmap)
   - [Problem Tags Distribution](#problem-tags-distribution)
   - [Interpreting Your Performance Data](#interpreting-your-performance-data)

5. [🔍 Upsolving](#upsolving)

   - [What is Upsolving?](#what-is-upsolving)
   - [Managing Your Upsolve List](#managing-your-upsolve-list)
   - [Tracking Upsolve Progress](#tracking-upsolve-progress)

6. [⚙️ Account Settings](#account-settings)

   - [Changing Your PIN](#changing-your-pin)
   - [Resetting a Forgotten PIN](#resetting-a-forgotten-pin)
   - [Theme Settings](#theme-settings)

7. [📱 Mobile Usage](#mobile-usage)

   - [Responsive Design Features](#responsive-design-features)
   - [Touch Interaction Tips](#touch-interaction-tips)

8. [❓ Troubleshooting](#troubleshooting)
   - [Common Issues](#common-issues)
   - [Contact Support](#contact-support)

---

## 🚀 Getting Started <a name="getting-started"></a>

### Creating an Account <a name="creating-an-account"></a>

1. Navigate to the CF Training Tracker homepage
2. Enter your Codeforces handle in the input field
3. Create a 4-digit PIN that you'll use for future logins
4. Click "Register" to create your account
5. The application will fetch your Codeforces profile data and submission history

> **Note**: Your Codeforces handle must be valid and active for registration to succeed.

### Logging In <a name="logging-in"></a>

1. On the homepage, enter your Codeforces handle
2. Enter your 4-digit PIN
3. Click "Login" to access your account

### Syncing Your Codeforces Profile <a name="syncing-your-codeforces-profile"></a>

Your profile is automatically synced upon login, but you can manually sync at any time:

1. Click on your profile avatar in the navigation bar
2. Select "Sync Profile" from the dropdown menu
3. Wait for the sync process to complete

The sync process updates:

- Your current Codeforces rating and rank
- Recent submissions
- Solved problems list

### PIN Management <a name="pin-management"></a>

Your PIN is your secure password for accessing CF Training Tracker. Keep it safe and do not share it with others.

---

## 🔔 Notification System <a name="notification-system"></a>

The CF Training Tracker includes a comprehensive notification system to keep you updated with important announcements, new features, system maintenance, and other updates.

### Understanding Notifications <a name="understanding-notifications"></a>

The notification system supports five types of notifications:

- **📢 Announcements**: Important platform news and updates
- **✨ New Features**: Information about newly released features
- **🔧 Maintenance**: System maintenance and downtime notifications
- **📥 Updates**: General system updates and improvements
- **⚠️ Alerts**: Critical information requiring immediate attention

### Notification Center <a name="notification-center"></a>

#### Accessing the Notification Center

1. Look for the bell icon (🔔) in the top navigation bar
2. The bell shows a red badge with the count of unread notifications
3. Click the bell icon to open the notification center panel

#### Notification Center Features

The notification center provides:

- **Real-time Updates**: New notifications appear instantly
- **Visual Indicators**: Different icons for each notification type
- **Read/Unread Status**: Clear visual distinction between read and unread notifications
- **Timestamps**: When each notification was created
- **Priority Display**: Notifications are ordered by creation date (newest first)

### Managing Your Notifications <a name="managing-your-notifications"></a>

#### Marking Notifications as Read

1. **Individual**: Click the green checkmark (✓) button next to any notification
2. **Automatic**: Notifications are marked as read when you click the main notification area

#### Deleting Notifications

1. Click the red X button next to any notification
2. Confirm deletion in the popup dialog
3. **Note**: Deleting a notification only removes it from your view - other users will still see it

#### Notification States

- **Unread**: White background with bold text
- **Read**: Gray background with normal text
- **Hidden**: Removed from your notification list (delete action)

### Admin Notification Management <a name="admin-notification-management"></a>

> **Admin Access Required**: This section applies only to users with admin privileges.


## 🏋️ Training Sessions <a name="training-sessions"></a>

### Setting Up a Training Session <a name="setting-up-a-training-session"></a>

1. Navigate to the "Training" page from the main navigation
2. Configure your training session:
   - Select difficulty level or custom rating range
   - Choose problem tags to focus on
   - Set the number of problems for the session
3. Click "Generate Problems" to start your training session

### Difficulty Levels <a name="difficulty-levels"></a>

CF Training Tracker offers predefined difficulty levels:

| Level  | Rating Range | Description               |
| ------ | ------------ | ------------------------- |
| Easy   | 800-1200     | Suitable for beginners    |
| Medium | 1200-1600    | Intermediate difficulty   |
| Hard   | 1600-2000    | Advanced problems         |
| Expert | 2000-2400    | Expert-level challenges   |
| Custom | User-defined | Set your own rating range |

Choose a level slightly above your current rating for optimal learning.

### Tag Selection <a name="tag-selection"></a>

Tags allow you to focus on specific algorithm types or problem categories:

1. Click on the tag selector dropdown
2. Check the boxes for tags you want to include
3. Common tags include:
   - Dynamic Programming
   - Graph Theory
   - Data Structures
   - Greedy Algorithms
   - Math
   - Implementation

### Problem Generation Algorithm <a name="problem-generation-algorithm"></a>

The problem generation system considers:

- Your selected difficulty level
- Chosen tags
- Your solving history (to avoid repeating problems)
- Problem quality (based on Codeforces ratings)

### Working Through Problems <a name="working-through-problems"></a>

During a training session:

1. Problems are displayed one at a time
2. Each problem includes:
   - Problem title and ID
   - Difficulty rating
   - Tags
   - Link to the problem on Codeforces
3. A timer tracks how long you spend on each problem
4. Indicate whether you solved the problem successfully

### Submitting Solutions <a name="submitting-solutions"></a>

1. Click the "Open Problem" button to access the problem on Codeforces
2. Solve the problem in your preferred programming environment
3. Submit your solution on Codeforces
4. Return to CF Training Tracker and mark the problem as:
   - Solved: If your solution passed all test cases
   - Attempted: If you tried but couldn't solve it correctly

### Session Results <a name="session-results"></a>

After completing a session:

1. View a summary of your performance
2. See statistics on:
   - Problems solved/attempted
   - Average solving time
   - Success rate
   - Rating change (estimated)
3. Unsolved problems are automatically added to your "Upsolve" list

---

## 📊 Statistics and Analytics <a name="statistics-and-analytics"></a>

### Performance Overview <a name="performance-overview"></a>

The Statistics page provides a comprehensive overview of your competitive programming journey:

1. Navigate to the "Statistics" page
2. View your overall performance metrics:
   - Total problems solved
   - Average success rate
   - Average solving time
   - Rating progression

### Rating Progression <a name="rating-progression"></a>

Track how your problem-solving ability has improved over time:

1. The rating chart shows your estimated CF Training Tracker rating
2. Compare it with your actual Codeforces rating
3. Identify trends and periods of improvement

### Activity Heatmap <a name="activity-heatmap"></a>

The activity heatmap visualizes your training consistency:

1. Each cell represents a day
2. Color intensity indicates activity level
3. Hover over cells to see exact problem counts
4. Use this to maintain a consistent practice schedule

### Problem Tags Distribution <a name="problem-tags-distribution"></a>

Analyze your strengths and weaknesses across different problem categories:

1. The tags distribution chart shows your performance by tag
2. Identify tags with:
   - High success rates (your strengths)
   - Low success rates (areas needing improvement)
   - Low attempt counts (topics to explore)

### Interpreting Your Performance Data <a name="interpreting-your-performance-data"></a>

Use analytics to guide your training:

1. Focus on tags with lower success rates
2. Gradually increase difficulty as success rates improve
3. Maintain consistent practice schedules (visible in the heatmap)
4. Track rating progression to validate improvement

---

## 🔍 Upsolving <a name="upsolving"></a>

### What is Upsolving? <a name="what-is-upsolving"></a>

Upsolving is the practice of revisiting problems you couldn't solve during contests or training sessions. It's a critical skill for improvement in competitive programming.

### Managing Your Upsolve List <a name="managing-your-upsolve-list"></a>

1. Navigate to the "Upsolve" page
2. View your list of unsolved problems from previous training sessions
3. Problems are sorted by:
   - Recently added (default)
   - Difficulty rating
   - Problem tags

### Tracking Upsolve Progress <a name="tracking-upsolve-progress"></a>

For each problem in your upsolve list:

1. Click "Solve Now" to open the problem on Codeforces
2. After solving, mark it as "Solved" in CF Training Tracker
3. Optionally, remove problems you no longer wish to attempt
4. View statistics on your upsolving performance

> **Tip**: Set a goal to upsolve at least one problem each day to steadily improve your skills.

---

## ⚙️ Account Settings <a name="account-settings"></a>

### Changing Your PIN <a name="changing-your-pin"></a>

1. Click on your profile avatar in the navigation bar
2. Select "Settings" from the dropdown menu
3. Click "Reset PIN"
4. Enter your current PIN and your new 4-digit PIN
5. Confirm your new PIN
6. Click "Save" to update your PIN

### Resetting a Forgotten PIN <a name="resetting-a-forgotten-pin"></a>

If you forget your PIN:

1. Click "Forgot PIN?" on the login page
2. Enter your Codeforces handle
3. Follow the verification process:
   - Submit a compilation error to problem 4A on Codeforces
   - Verify the submission
4. Once verified, create a new 4-digit PIN

### Theme Settings <a name="theme-settings"></a>

CF Training Tracker supports both light and dark themes:

1. Click the theme toggle button in the navigation bar
2. Switch between light and dark mode
3. Your preference is saved for future sessions

---

## 📱 Mobile Usage <a name="mobile-usage"></a>

### Responsive Design Features <a name="responsive-design-features"></a>

CF Training Tracker is fully responsive and works on all device sizes:

1. Navigation transforms into a hamburger menu on small screens
2. Charts and visualizations adapt to the screen width
3. Touch-friendly interface elements

### Touch Interaction Tips <a name="touch-interaction-tips"></a>

For optimal mobile experience:

1. Use landscape mode for better visualization of charts
2. Tap on chart elements to see detailed information
3. Use the pull-to-refresh gesture to update your data

---

## ❓ Troubleshooting <a name="troubleshooting"></a>

### Common Issues <a name="common-issues"></a>

**Problem**: Cannot log in with correct handle and PIN

- Verify your Codeforces handle is entered exactly as it appears on Codeforces
- Try resetting your PIN if you continue to have issues

**Problem**: Profile sync not working

- Check your internet connection
- Try again after a few minutes

**Problem**: Problems not generating for training

- Try selecting different tags or difficulty levels
- Clear any active filters that might be limiting results

**Problem**: Performance statistics not updating

- Ensure you're marking problems correctly as solved/attempted
- Allow time for the Codeforces API to update with your submissions

### Contact Support <a name="contact-support"></a>

If you encounter persistent issues:

1. Check the [GitHub repository](https://github.com/Mohamediibra7im/cf-training-tracker) for known issues
2. Create a new issue with:
   - Detailed description of the problem
   - Steps to reproduce
   - Screenshots if applicable
   - Your browser and device information

---

## 🔄 Regular Updates

CF Training Tracker is actively maintained and regularly updated with new features and improvements. Check the GitHub repository for the latest updates and changelog.

Happy coding and improving your competitive programming skills with CF Training Tracker!

---

<div align="center">
  <p>📝 This usage guide is a living document and may be updated as new features are added.</p>
  <p>Last updated: September 4, 2025</p>
</div>
