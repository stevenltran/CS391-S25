# CS391-S25

CS391 Class Project S25 - SparkBytes! 

This is our CS391 Class Final Project, SparkBytes! for Spring 2025. SparkBytes! is a web application to post Boston University (BU) events that provide
foods or snacks. The aim is to reduce food waste resulting from over-purchasing for events and at the same time, help BU constituencies access free food.  

The web-app will be deployed but if you want:

To clone the repository, run the following commands: 

```bash
git clone https://github.com/stevenltran/CS391-S25.git
cd CS391-S25
```

To run for development, run the following commands:

```bash
npm install
npm run dev
```

To run for production, run the following commands:

```bash
npm install
npm run build
npm start
```
This project uses Firebase for:

- Authentication
- Firestore Database
- Cloud File Storage
- Cloud Functions
- Cloud Notifications
- Hosting

To get started with Firebase:
1. Install Firebase CLI
```bash
npm install -g firebase-tools
```
2. Login to Firebase
```bash
firebase login
```
3. Link the Firebase Project
```bash
firebase use --add
```
4. (optional) Deploy to Firebase
```bash
npm run build
firebase deploy
```

Overview of the SparkBytes! Website:

Features

- `Event Food Posting`: Event organizers can post details about leftover food availability
- `User Notifications`: Real-time alerts about nearby food opportunities
- `Eligibility Management`: Controls which BU constituencies can access different food offerings
- `Food Source Management`: Tracking and managing sources of available food
- `User Authentication`: Secure login system restricted to BU community members
- `Role-Based Access Control`: Different permissions for students, faculty, staff, and administrators
- `Food Availability Tracking`: Real-time updates on food status (available, claimed, gone)
- `Location Services`: Find food opportunities based on campus location



