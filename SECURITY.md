# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **[security@dmv.gg](mailto:security@dmv.gg)**. You will receive a response from us within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

## Security Measures

This project implements several security measures:

1. Branch Protection Rules
   - Main branch is protected
   - Pull request reviews are required
   - Status checks must pass before merging

2. Dependency Management
   - Regular dependency updates
   - Automated vulnerability scanning

3. Code Quality
   - Automated testing
   - Code review guidelines
   - Static code analysis

## Best Practices for Contributors

1. Never commit sensitive information like API keys or credentials
2. Keep dependencies up to date
3. Follow the security guidelines in CONTRIBUTING.md
4. Run tests locally before submitting PRs
5. Review code for security implications 