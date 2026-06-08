# Documentation Index

Welcome to the n8n Workflows documentation. This directory contains all technical documentation, guides, and reference materials.

---

## 📚 Quick Navigation

### 🚀 Start Here
- **[Quick Reference](./QUICK-REFERENCE.md)** - Fast access to commands and examples
- [Main README](../README.md) - Project overview and quick start
- [Migration Guide](./guides/MIGRATION-GUIDE.md) - Deploy workflows to n8n

### Reference Documentation
- [n8n Zero Credential Storage](./reference/N8N-ZERO-CREDENTIAL-STORAGE.md) - **NEW!** Security architecture
- [Workflow Security Validation](./reference/WORKFLOW-SECURITY-VALIDATION.md) - **NEW!** Compliance audit report
- [Credential Management Architecture](./reference/CREDENTIAL-MANAGEMENT-ARCHITECTURE.md) - Internal credential flow
- [Architecture](./reference/ARCHITECTURE.md) - System architecture and API endpoints
- [Authentication Guide](./reference/AUTHENTICATION-GUIDE.md) - Authentication per provider
- [Authentication Verification](./reference/AUTHENTICATION-VERIFICATION-SUMMARY.md) - Verification results
- [Project Summary](./reference/SUMMARY.md) - Executive summary

### Guides
- [Restaurant Owner Setup Guide](./guides/RESTAURANT-OWNER-SETUP-GUIDE.md) - **NEW!** Configure all integrations
- [Migration Guide](./guides/MIGRATION-GUIDE.md) - Step-by-step deployment
- [GitHub Actions Deployment](./guides/GITHUB-ACTIONS-DEPLOYMENT.md) - Automated CI/CD deployment
- [Google Testing Guide](./guides/GOOGLE-TESTING-GUIDE.md) - Testing Google workflows

### Utilities
- [Scripts Directory](./scripts/) - Automation and verification scripts

### Provider Documentation
- [Toast POS](../toast/README.md) - Toast integration
- [Google Business Profile](../google/README.md) - Google reviews
- [Yelp Fusion](../yelp/README.md) - Yelp reviews
- [OpenTable](../opentable/README.md) - OpenTable reservations
- [Resy](../resy/README.md) - Resy reservations
- [Instagram](../instagram/README.md) - Instagram social media
- [Facebook](../facebook/README.md) - Facebook social media

### Change Log
- [CHANGELOG](../CHANGELOG.md) - Version history and changes

---

## 📂 Documentation Structure

```
n8n-workflows/
├── README.md                          # Main project overview
├── CHANGELOG.md                       # Version history
│
├── docs/                              # Documentation hub
│   ├── README.md                      # This file - documentation index
│   │
│   ├── guides/                        # Step-by-step guides
│   │   ├── RESTAURANT-OWNER-SETUP-GUIDE.md  # Restaurant owner configuration
│   │   ├── MIGRATION-GUIDE.md         # Deploy workflows to n8n
│   │   ├── GITHUB-ACTIONS-DEPLOYMENT.md  # Automated CI/CD deployment
│   │   └── GOOGLE-TESTING-GUIDE.md    # Test Google workflows
│   │
│   ├── reference/                     # Technical reference
│   │   ├── N8N-ZERO-CREDENTIAL-STORAGE.md  # n8n security architecture
│   │   ├── CREDENTIAL-MANAGEMENT-ARCHITECTURE.md  # Internal credential architecture
│   │   ├── ARCHITECTURE.md            # System architecture
│   │   ├── AUTHENTICATION-GUIDE.md    # Auth specs per provider
│   │   ├── AUTHENTICATION-VERIFICATION-SUMMARY.md  # Verification results
│   │   └── SUMMARY.md                 # Project summary
│   │
│   ├── scripts/                       # Automation scripts
│   │   ├── verify-authentication.py   # Verify auth configuration
│   │   ├── update_workflows.py        # Update workflow URLs
│   │   └── update_workflows.sh        # Shell script alternative
│   │
│   └── project-info/                  # Project-specific documents
│       ├── README.md                   # Project info index
│       └── SCHEMA_CHANGELOG.md         # Schema version history
│
├── toast/                             # Toast POS integration
│   ├── README.md                      # Toast documentation
│   └── *.json                         # Toast workflows
│
├── google/                            # Google Business Profile
│   ├── README.md                      # Google documentation
│   └── *.json                         # Google workflows
│
├── yelp/                              # Yelp Fusion API
│   ├── README.md                      # Yelp documentation
│   └── *.json                         # Yelp workflows
│
├── opentable/                         # OpenTable Platform
│   ├── README.md                      # OpenTable documentation
│   └── *.json                         # OpenTable workflows
│
├── resy/                              # Resy API
│   ├── README.md                      # Resy documentation
│   └── *.json                         # Resy workflows
│
├── instagram/                         # Instagram Graph API
│   ├── README.md                      # Instagram documentation
│   └── *.json                         # Instagram workflows
│
└── facebook/                          # Facebook Graph API
    ├── README.md                      # Facebook documentation
    └── *.json                         # Facebook workflows
```

---

## 📖 Document Descriptions

### Main Documents

#### [README.md](../README.md)
- **Purpose:** Project overview and quick start
- **Audience:** All users
- **Contents:**
  - Architecture overview
  - Available integrations
  - Quick start guide
  - Configuration instructions
  - Version history

#### [CHANGELOG.md](../CHANGELOG.md)
- **Purpose:** Track all changes and versions
- **Audience:** Developers and maintainers
- **Contents:**
  - Version history
  - Breaking changes
  - New features
  - Bug fixes

---

### Guides (`docs/guides/`)

#### [MIGRATION-GUIDE.md](./guides/MIGRATION-GUIDE.md)
- **Purpose:** Deploy workflows from Supabase to direct backend API calls
- **Audience:** DevOps and developers
- **Contents:**
  - Architecture changes explained
  - Environment variable setup
  - Credential configuration
  - Step-by-step deployment
  - Testing procedures
  - Troubleshooting

#### [GOOGLE-TESTING-GUIDE.md](./guides/GOOGLE-TESTING-GUIDE.md)
- **Purpose:** Test Google Business Profile workflows
- **Audience:** QA and developers
- **Contents:**
  - OAuth token acquisition
  - Testing GET reviews
  - Testing POST replies
  - Common test scenarios
  - Error testing
  - Automated testing scripts

---

### Reference Documentation (`docs/reference/`)

#### [ARCHITECTURE.md](./reference/ARCHITECTURE.md)
- **Purpose:** Complete system architecture documentation
- **Audience:** Architects and senior developers
- **Contents:**
  - Architecture overview
  - Backend API endpoints for all providers
  - n8n workflow structure
  - Security layers
  - Deployment considerations
  - Rate limiting information

#### [AUTHENTICATION-GUIDE.md](./reference/AUTHENTICATION-GUIDE.md)
- **Purpose:** Authentication specifications for all providers
- **Audience:** Developers implementing integrations
- **Contents:**
  - Provider-by-provider auth requirements
  - HTTP Request node configuration
  - Token management
  - OAuth flows
  - Security best practices
  - Troubleshooting authentication issues

#### [AUTHENTICATION-VERIFICATION-SUMMARY.md](./reference/AUTHENTICATION-VERIFICATION-SUMMARY.md)
- **Purpose:** Results of authentication configuration verification
- **Audience:** QA and security teams
- **Contents:**
  - Verification status per provider
  - Configuration checklist
  - Testing commands
  - Security compliance
  - Changes made

#### [SUMMARY.md](./reference/SUMMARY.md)
- **Purpose:** Executive summary of the project
- **Audience:** Stakeholders and new team members
- **Contents:**
  - Project overview
  - What was accomplished
  - Requirements met
  - Architecture changes
  - Files created/updated

---

### Scripts (`docs/scripts/`)

#### [verify-authentication.py](./scripts/verify-authentication.py)
- **Purpose:** Automated verification of authentication configuration
- **Usage:** `python3 docs/scripts/verify-authentication.py`
- **Output:** Detailed report of auth configuration per workflow

#### [update_workflows.py](./scripts/update_workflows.py)
- **Purpose:** Update workflow URLs to backend APIs
- **Usage:** `python3 docs/scripts/update_workflows.py`
- **Note:** Already executed; kept for reference

#### [update_workflows.sh](./scripts/update_workflows.sh)
- **Purpose:** Shell script alternative for updating workflows
- **Usage:** `bash docs/scripts/update_workflows.sh`
- **Note:** Already executed; kept for reference

---

### Project Information (`docs/project-info/`)

#### [SCHEMA_CHANGELOG.md](./project-info/SCHEMA_CHANGELOG.md)
- **Purpose:** Track database schema changes
- **Contents:** Version history, migrations, schema updates

---

### Provider Documentation

Each provider folder contains:
- **README.md** - Provider-specific documentation
- **Workflow JSON files** - n8n workflow definitions

#### Provider Documentation Includes:
- Available workflows and endpoints
- Authentication requirements
- Request/response examples
- curl test commands
- Provider-specific features
- API limitations
- Troubleshooting

---

## 🎯 Document Usage by Role

### For Developers
1. Start with [Main README](../README.md)
2. Review [Architecture](./reference/ARCHITECTURE.md)
3. Study [Authentication Guide](./reference/AUTHENTICATION-GUIDE.md)
4. Check provider-specific [README files](../toast/README.md)
5. Use [verify-authentication.py](./scripts/verify-authentication.py) to validate

### For DevOps/Deployment
1. Read [Migration Guide](./guides/MIGRATION-GUIDE.md)
2. Follow deployment steps
3. Configure environment variables
4. Set up credentials per [Authentication Guide](./reference/AUTHENTICATION-GUIDE.md)
5. Test with provider curl examples

### For QA/Testing
1. Review provider [README files](../google/README.md)
2. Use [Google Testing Guide](./guides/GOOGLE-TESTING-GUIDE.md) as example
3. Execute test commands from each provider README
4. Run [verify-authentication.py](./scripts/verify-authentication.py)
5. Verify responses match documentation

### For Security Review
1. Read [Authentication Guide](./reference/AUTHENTICATION-GUIDE.md)
2. Review [Authentication Verification Summary](./reference/AUTHENTICATION-VERIFICATION-SUMMARY.md)
3. Check [Architecture Security Layers](./reference/ARCHITECTURE.md#security-layers)
4. Run [verify-authentication.py](./scripts/verify-authentication.py)
5. Audit credentials configuration

### For New Team Members
1. Start with [Main README](../README.md)
2. Read [Summary](./reference/SUMMARY.md) for project overview
3. Review [Architecture](./reference/ARCHITECTURE.md)
4. Check [CHANGELOG](../CHANGELOG.md) for recent changes
5. Pick a provider and review its README

---

## 🔍 Finding Information

### By Topic

| Topic | Document |
|-------|----------|
| **Getting Started** | [Main README](../README.md) |
| **Architecture** | [Architecture](./reference/ARCHITECTURE.md) |
| **Authentication** | [Authentication Guide](./reference/AUTHENTICATION-GUIDE.md) |
| **Deployment** | [Migration Guide](./guides/MIGRATION-GUIDE.md) |
| **Testing** | [Google Testing Guide](./guides/GOOGLE-TESTING-GUIDE.md), Provider READMEs |
| **Security** | [Authentication Guide](./reference/AUTHENTICATION-GUIDE.md), [Architecture](./reference/ARCHITECTURE.md) |
| **API Endpoints** | [Architecture](./reference/ARCHITECTURE.md), Provider READMEs |
| **Changes** | [CHANGELOG](../CHANGELOG.md) |
| **Verification** | [Authentication Verification](./reference/AUTHENTICATION-VERIFICATION-SUMMARY.md) |

### By Provider

| Provider | Documentation |
|----------|---------------|
| **Toast POS** | [toast/README.md](../toast/README.md) |
| **Google Business** | [google/README.md](../google/README.md) |
| **Yelp Fusion** | [yelp/README.md](../yelp/README.md) |
| **OpenTable** | [opentable/README.md](../opentable/README.md) |
| **Resy** | [resy/README.md](../resy/README.md) |
| **Instagram** | [instagram/README.md](../instagram/README.md) |
| **Facebook** | [facebook/README.md](../facebook/README.md) |

---

## 📝 Documentation Standards

### Markdown Conventions
- Use ATX-style headers (`#` for H1, `##` for H2, etc.)
- Include table of contents for documents > 100 lines
- Use code blocks with language specification
- Include examples for all API calls

### File Naming
- Use UPPERCASE for major documents (README.md, CHANGELOG.md)
- Use kebab-case for guides (MIGRATION-GUIDE.md)
- Use descriptive names (AUTHENTICATION-GUIDE.md, not AUTH.md)

### Content Guidelines
- Write for your audience (technical for devs, clear for stakeholders)
- Include examples and code snippets
- Provide troubleshooting sections
- Link to related documents
- Keep documents focused (single purpose)

---

## 🔄 Keeping Documentation Updated

### When to Update
- **README.md:** New features, changed configuration
- **CHANGELOG.md:** Every change (always)
- **Provider README:** API changes, new endpoints
- **Architecture:** Structural changes
- **Authentication Guide:** New providers, auth changes

### Update Checklist
- [ ] Update affected documents
- [ ] Add entry to CHANGELOG
- [ ] Update version numbers if applicable
- [ ] Test examples and commands
- [ ] Update cross-references
- [ ] Run verification scripts

---

## 📞 Support

### Documentation Issues
- Missing information? Open an issue
- Incorrect examples? Submit a correction
- Unclear explanation? Request clarification

### Getting Help
1. Check this documentation index
2. Review the specific document
3. Run verification scripts
4. Check CHANGELOG for recent changes
5. Review provider-specific README

---

**Last Updated:** 2026-06-08  
**Documentation Version:** 2.0
