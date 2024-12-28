## Blog App Built with React Native and Firebase

### Features

- **CRUD Operations**: Users can create, read, update, and delete blog posts.
- **User Authentication**: Secure user authentication using Firebase to allow users to sign up, log in, and manage their accounts.
- **Authorization**: Only authorized users can edit or delete their own blog posts, ensuring data security and integrity.
- **Responsive Design**: A user-friendly interface optimized for all devices.
- **Search Functionality**: Easily find blog posts using the integrated search bar.

### Technologies Used

- **React Native**: For building a cross-platform mobile application with a single codebase.
- **Expo**: Simplifies development, testing, and deployment across iOS and Android platforms.
- **Firebase**: Backend services, including:
  - **Authentication**: For secure user login and registration.
  - **Realtime Database**: To store and retrieve blog posts.

### Getting Started

1. Clone the repository.
2. Install dependencies using `npm install` or `yarn install`.
3. Install Expo CLI:
   ```
   npm install -g expo-cli
   ```
4. Run the app:
   ```
   npx expo start -c
   ```

### Dependencies

All dependencies and their specific versions are listed in the `package.json` file. Key dependencies include:

- `expo`
- `react-native`
- `firebase`
