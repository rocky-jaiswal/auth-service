# TODO

- Code cleanup
- HTTP tests needed
  - Ping
  - Create User
    - DB is down -> 500
  - Create Session
    - DB is down -> 500
  - Get user
    - Old token
    - DB is down -> 500
- Check / Test the setup of the MS Login

## Future Enhancements

1. Email verification - Send verification emails on signup
2. Password reset flow - Forgot password functionality
3. Refresh tokens - Long-lived tokens for token rotation
4. Rate limiting - Prevent brute force attacks
5. Account linking - Allow users to connect multiple OAuth providers
6. Session management - Track and revoke active sessions
7. Audit logging - Track login attempts, failures, etc.
