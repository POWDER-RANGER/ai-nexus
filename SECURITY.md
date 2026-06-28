# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x (prototype) | ✅ Active development |

## Reporting a Vulnerability

If you discover a security vulnerability in AI Nexus, please report it responsibly.

**Do NOT open a public issue.**

Instead, contact the maintainer directly:

- **GitHub:** [@POWDER-RANGER](https://github.com/POWDER-RANGER) via private security advisory
- **Repository:** Use [GitHub Security Advisories](https://github.com/POWDER-RANGER/ai-nexus/security/advisories) to report privately

## Response Timeline

| Phase | Timeframe |
|-------|-----------|
| Initial acknowledgment | Within 48 hours |
| Assessment & triage | Within 7 days |
| Fix & disclosure | Within 30 days (critical) / 90 days (standard) |

## Security Best Practices

- Never commit `.env` files or real secrets
- Use `.env.example` as a template only
- Rotate JWT secrets regularly
- Keep dependencies updated (Dependabot enabled)
- All production deployments should use HTTPS

## Current Security Controls

- `.gitignore` excludes `.env`, `*.pem`, `*.key`, `secrets/`
- `.env.example` contains only placeholder values
- GitHub Secret Scanning recommended (not yet enabled)

## Disclosure Policy

We follow coordinated disclosure. After a fix is released:

1. Security advisory published on GitHub
2. CVE requested if applicable
3. Public disclosure after 30 days from fix release

---

*Last updated: 2026-06-28*
