# Poker Tracker
A comprehensive application for tracking and analyzing your poker sessions to improve your game and maximize profits.
## Overview
Poker Tracker is a full-stack application designed for poker players who want to track their performance across different locations and analyze their results over time. With Poker Tracker, you can record session details, track your profits, and gain valuable insights through statistics and visualizations.
## Features
- **Session Management**: Create, view, update, and delete poker sessions
- **Real-time Tracking**: Track active poker sessions
- **Comprehensive Analytics**:
    - Total hours played and profit earned
    - Most profitable weeks and locations
    - Weekly and monthly performance summaries
    - Location-based statistics with profit per hour calculations

- **Data Visualization**: Visual representation of your poker performance over time
- **Responsive Design**: Access your stats from any device

## Project Structure
The project is organized into two main components:
- : React application built with Next.js and Tailwind CSS **poker-tracker-frontend**
- : NestJS REST API with Prisma ORM for database interactions **poker-tracker-backend**

## Technology Stack
### Frontend
- React 19.1.0
- Next.js 15.4.2
- Tailwind CSS
- TypeScript

### Backend
- NestJS 10.4.19
- Prisma 6.12.0
- TypeScript
- Jest 29.5.0 for testing

## Getting Started
### Prerequisites
- Node.js (latest LTS version recommended)
- npm package manager

### Installation
1. Clone the repository:
``` bash
   git clone https://github.com/yourusername/poker-tracker.git
   cd poker-tracker
```
1. Install dependencies:
``` bash
   npm install
```
1. Set up the backend:
``` bash
   cd poker-tracker-backend
   npm install
```
1. Set up the frontend:
``` bash
   cd ../poker-tracker-frontend
   npm install
```
### Running the Application
1. Start the backend server:
``` bash
   cd poker-tracker-backend
   npm run start:dev
```
1. Start the frontend development server:
``` bash
   cd ../poker-tracker-frontend
   npm run dev
```
1. Access the application at `http://localhost:3000`

## API Endpoints
The backend API provides the following endpoints:
- `GET /poker-sessions`: Retrieve all poker sessions
- `GET /poker-sessions/active`: Retrieve active poker sessions
- `GET /poker-sessions/:id`: Retrieve a specific poker session
- `POST /poker-sessions`: Create a new poker session
- `PUT /poker-sessions/:id`: Update a poker session
- `PUT /poker-sessions/:id/end`: End an active poker session
- `DELETE /poker-sessions/:id`: Delete a poker session

## Key Features Explained
### Session Tracking
Record all your poker sessions with details like:
- Location
- Buy-in amount
- Cash out amount
- Start and end times
- Duration
- Profits/losses

### Analytics
The application provides several analytical tools:
- **Overall Statistics**: View your total hours played, total profit, and average profit per hour
- **Time-based Analysis**: Weekly and monthly performance summaries
- **Location Intelligence**: Determine your most profitable venues

### Performance Optimization
Identify patterns in your play:
- Discover your most profitable days and times
- Recognize which poker venues yield the best returns
- Track your improvement over time

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the MIT License - see the LICENSE file for details.
## Acknowledgments
- Thank you to all contributors who have helped shape this project
- Inspired by the need for better poker session tracking tools
