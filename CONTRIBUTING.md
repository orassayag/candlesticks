# Contributing

Contributions to this project are [released](https://help.github.com/articles/github-terms-of-service/#6-contributions-under-repository-license) to the public under the [project's open source license](LICENSE).

Everyone is welcome to contribute to this project. Contributing doesn't just mean submitting pull requests—there are many different ways for you to get involved, including answering questions, reporting issues, improving documentation, or suggesting new features.

## How to Contribute

### Reporting Issues

If you find a bug or have a feature request:

1. Check if the issue already exists in the [GitHub Issues](https://github.com/orassayag/candlesticks/issues)
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Error messages or console logs (if applicable)
   - Your environment details (OS, Node version, browser)

### Submitting Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the code style guidelines below
4. Test your changes thoroughly
5. Commit with clear, descriptive messages
6. Push to your fork and submit a pull request

### Code Style Guidelines

This project uses:

- **JavaScript (ES6+)** for both client and server
- **React.js** for the frontend
- **Node.js/Express** for the backend
- **ESLint** for code quality

Before submitting:

```bash
# Server
cd candlesticks/server
npm install
npm run lint
node index.js  # Test server

# Client
cd candlesticks/client
npm install
npm run lint
npm start  # Test client
```

### Coding Standards

1. **Code Structure**: Follow the existing project structure
   - Server: Keep logic separated in `/services`, `/utils`, `/startup`
   - Client: Follow component-based architecture in `/src/components`
2. **Error Handling**: Use proper error handling with Winston logging on server
3. **WebSocket Communication**: Follow existing Socket.io patterns
4. **Naming**: Use clear, descriptive names for variables and functions
5. **Comments**: Add explanatory comments for complex logic
6. **No Hardcoded Values**: Use configuration files for settings

### Adding New Features

When adding new features:

**Server-side:**

1. Add configurations in `config/config.js`
2. Create utilities in `utils/` folder
3. Add services in `services/` folder
4. Update routes in `startup/routes.js`
5. Test with multiple clients

**Client-side:**

1. Create reusable components in `src/components/`
2. Add API routes in `src/api/routes/`
3. Update settings in `src/settings/settings.js`
4. Ensure responsive design
5. Test in multiple browsers

### Testing Guidelines

1. **Server Testing**:
   - Start server and verify console logs
   - Test WebSocket connections
   - Verify data generation at correct intervals
   - Test interval switching functionality

2. **Client Testing**:
   - Verify chart renders correctly
   - Test real-time data updates
   - Test interval selection
   - Test historical data loading
   - Check responsive design

3. **Integration Testing**:
   - Test client-server communication
   - Verify data synchronization
   - Test reconnection scenarios
   - Test multiple concurrent clients

## Questions or Need Help?

Please feel free to contact me with any question, comment, pull-request, issue, or any other thing you have in mind.

- Or Assayag <orassayag@gmail.com>
- GitHub: https://github.com/orassayag
- StackOverflow: https://stackoverflow.com/users/4442606/or-assayag?tab=profile
- LinkedIn: https://linkedin.com/in/orassayag

Thank you for contributing! 🙏
