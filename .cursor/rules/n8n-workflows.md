# n8n Workflows Development Rules

## Project Location

**Working Directory**: `/Users/svallamkonda/Documents/GitLab/neuraltable-2/n8n-workflows`

⚠️ **IMPORTANT**: All workflow development, testing, and documentation must be done in this directory. Do not use `/Users/svallamkonda/Documents/GitLab/junoadvisor-v2/juno-auditor-database/` for n8n workflows.

## Project Status

**⚠️ EARLY DEVELOPMENT - FIRST ITERATION**

This is the initial development phase. The codebase is evolving rapidly.

### What This Means

- **No Migration Docs**: Don't create migration guides or backward compatibility docs
- **No Migration Scripts**: Don't create scripts for migrating between versions
- **Expect Changes**: Architecture, authentication, and APIs will change
- **Keep It Simple**: Focus on working code, not production hardening
- **Iterate Fast**: Prototype first, optimize later

---

## Development Guidelines

### 1. Language Consistency

Use **JavaScript/Node.js** for all scripts and utilities:
- ✅ JavaScript/Node.js for automation scripts
- ✅ JSON for n8n workflow definitions (required by n8n)
- ❌ No Python (remove existing Python scripts)
- ❌ No TypeScript (keep it simple for now)
- ❌ No Shell scripts (use Node.js instead)

**Rationale**: JavaScript is n8n's native language, making integration and debugging easier.

### 2. Testing

- Create test scripts with **mock URLs** for local testing
- Use `test-workflows.js` for all testing
- Don't require actual API credentials for basic tests
- Mock responses should be in `tests/mocks/` directory

### 3. Documentation

- **README.md per provider**: Keep it minimal
- **No versioning docs**: Don't track version history in detail
- **No migration guides**: Skip backward compatibility docs
- **Code comments**: Only for non-obvious logic
- **CHANGELOG.md**: Track major changes only

### 4. File Organization

```
n8n-workflows/
├── tests/                  # Test scripts and mocks
│   ├── test-workflows.js   # Main test runner
│   └── mocks/              # Mock responses
├── scripts/                # Utility scripts (JavaScript only)
├── [provider]/             # Provider workflows
│   ├── *.json              # Workflow definitions
│   └── README.md           # Minimal docs
└── README.md               # Main docs
```

### 5. Workflow Development

- Keep workflows simple and readable
- Use environment variables for configuration
- Don't hardcode URLs or credentials
- Test with mock endpoints first

### 6. What NOT to Create

❌ **Migration guides** (MIGRATION-GUIDE.md)
❌ **Version compatibility docs**
❌ **Upgrade scripts**
❌ **Python scripts** (use JavaScript)
❌ **TypeScript** (keep it simple)
❌ **Shell scripts** (use JavaScript)
❌ **Deprecation notices**
❌ **Backward compatibility layers**

### 7. What TO Create

✅ **Working workflows** (.json files)
✅ **Test scripts** with mocks (JavaScript)
✅ **Minimal README** per provider
✅ **Environment variable examples**
✅ **Quick start guide**

---

## Testing Guidelines

### Mock Configuration

All test scripts should support mock mode:

```javascript
// test-workflows.js
const config = {
  mockMode: true,  // Use mock URLs
  n8nInstance: process.env.N8N_URL || 'http://localhost:5678',
  mockServer: 'http://localhost:3000'  // Local mock server
};
```

### Test Data

- Keep test data in `tests/mocks/[provider].json`
- Use realistic but fake data
- Don't require real API credentials

### Running Tests

```bash
# Test with mocks
node tests/test-workflows.js --mock

# Test with real n8n (requires setup)
node tests/test-workflows.js --real
```

---

## Code Style

### JavaScript

- Use modern ES6+ syntax
- Use async/await for promises
- Use template literals for strings
- Use arrow functions
- Keep functions small and focused

### JSON (Workflows)

- Use 2-space indentation
- Keep consistent structure
- Use descriptive node names
- Comment with node descriptions

---

## When to Refactor

Only refactor when:
- Code is duplicated 3+ times
- A pattern emerges across multiple workflows
- Performance is actually a problem (measure first)

Don't refactor for:
- Theoretical future requirements
- "Best practices" without context
- Premature optimization

---

## Questions to Ask Before Adding Anything

1. **Is this needed now?** (Not "might be needed later")
2. **Is this the simplest solution?**
3. **Can this be tested with mocks?**
4. **Is this JavaScript/JSON only?**

If you answer "no" to any of these, reconsider.

---

## Summary

- ✅ Focus on working code
- ✅ Use JavaScript for all scripts
- ✅ Test with mocks
- ✅ Keep docs minimal
- ❌ No migration docs/scripts
- ❌ No Python/TypeScript
- ❌ No premature optimization

---

**Remember**: This is iteration 1. Keep it simple. Make it work. Iterate.

**Last Updated**: 2026-06-08
