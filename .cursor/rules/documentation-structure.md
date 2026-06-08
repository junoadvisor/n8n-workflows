# Documentation Structure Rules

## 📁 Documentation Organization

### Main Folder (Root)

**ONLY these files should be in the root directory:**

1. ✅ **`README.md`** (MANDATORY)
   - Main project overview
   - Quick start guide
   - Integration summaries
   - Status and version information
   - **MUST be kept updated** with every major change

2. ✅ **`CHANGELOG.md`** (MANDATORY)
   - Version history
   - Chronological list of changes
   - Breaking changes highlighted
   - **MUST be updated** with every commit/release

3. ❌ **NO OTHER DOCUMENTATION** in root
   - All other `.md` files belong in `docs/`

---

### docs/ Folder

**ALL other documentation goes here:**

```
docs/
├── README.md                    # Documentation index/navigation
├── guides/                      # Step-by-step tutorials
│   ├── MIGRATION-GUIDE.md
│   ├── DEPLOYMENT-GUIDE.md
│   └── ...
├── reference/                   # Technical reference docs
│   ├── ARCHITECTURE.md
│   ├── AUTHENTICATION-GUIDE.md
│   ├── API-REFERENCE.md
│   └── ...
└── scripts/                     # Script documentation
    └── ...
```

---

## 📝 Documentation Rules

### When Creating Documentation

1. **Ask first**: "Does this belong in root or docs/?"
   - Root: ONLY README.md and CHANGELOG.md
   - docs/: Everything else

2. **Update README.md** when:
   - Adding new workflows
   - Changing architecture
   - Modifying authentication
   - Adding/removing providers
   - Updating status

3. **Update CHANGELOG.md** when:
   - Making any commit
   - Adding features
   - Fixing bugs
   - Updating documentation
   - Changing configuration

4. **Create in docs/** for:
   - Architecture details
   - Migration guides
   - Testing guides
   - API references
   - Deployment guides
   - Any specialized documentation

---

## 🚫 What NOT to Do

❌ Don't create these in root:
- `ARCHITECTURE.md`
- `MIGRATION-GUIDE.md`
- `DEPLOYMENT-GUIDE.md`
- `DEVELOPMENT-STATUS.md`
- `CLEANUP-SUMMARY.md`
- `GIT-PUSH-SUMMARY.md`
- `NEW-WORKFLOWS-SUMMARY.md`
- Any other `.md` files

❌ Don't forget to update:
- README.md (when making significant changes)
- CHANGELOG.md (with every commit)

---

## ✅ Correct Structure

```
n8n-workflows/
├── README.md                    ✅ Root - Project overview
├── CHANGELOG.md                 ✅ Root - Version history
│
├── docs/                        ✅ All other docs
│   ├── README.md                   Documentation index
│   ├── guides/
│   │   ├── GETTING-STARTED.md
│   │   ├── MIGRATION-GUIDE.md
│   │   └── DEPLOYMENT-GUIDE.md
│   ├── reference/
│   │   ├── ARCHITECTURE.md
│   │   ├── AUTHENTICATION-GUIDE.md
│   │   └── API-REFERENCE.md
│   └── project-info/            ✅ Project-specific docs
│       ├── DEVELOPMENT-STATUS.md
│       ├── CLEANUP-SUMMARY.md
│       └── ...
│
├── toast/
├── google/
├── ... (provider folders)
```

---

## 📋 Update Checklist

### Before Committing

- [ ] Is README.md updated with changes?
- [ ] Is CHANGELOG.md updated with new entry?
- [ ] Are all non-root docs in `docs/`?
- [ ] Is `docs/README.md` updated if needed?

### When Adding New Workflows

1. ✅ Create workflow JSON in provider folder
2. ✅ Update provider README
3. ✅ Update main README.md (workflow count, tables)
4. ✅ Add entry to CHANGELOG.md
5. ✅ Update docs/ if architecture/auth changed

### When Removing Workflows

1. ✅ Delete workflow JSON
2. ✅ Update provider README
3. ✅ Update main README.md
4. ✅ Add entry to CHANGELOG.md (mark as removed)

---

## 🎯 README.md Template

```markdown
# Project Name

**Status**: Development/Production  
**Version**: x.x.x  
**Last Updated**: YYYY-MM-DD

Brief description...

## Quick Start

## Integrations

## Documentation

See [docs/](./docs/) for complete documentation.

## Status

| Provider | Workflows | Status |
|----------|-----------|--------|
| ...      | ...       | ...    |

Total: XX workflows
```

---

## 📆 CHANGELOG.md Template

```markdown
# Changelog

## [Version] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Changed item description

### Fixed
- Bug fix description

### Removed
- Removed item description
```

---

## 💡 Tips

1. **Keep it simple**: Only README and CHANGELOG in root
2. **Stay organized**: Everything else in docs/
3. **Update religiously**: Every change = CHANGELOG entry
4. **Be descriptive**: Clear, concise documentation
5. **Think of others**: Write for new team members

---

## 🔄 Reorganization Process

If files are in the wrong place:

```bash
# Move project-specific docs to docs/project-info/
mv DEVELOPMENT-STATUS.md docs/project-info/
mv CLEANUP-SUMMARY.md docs/project-info/
mv GIT-PUSH-SUMMARY.md docs/project-info/

# Keep in root (only these two)
# - README.md
# - CHANGELOG.md
```

---

## ⚠️ Enforcement

When reviewing code or documentation:

1. **Check root**: Should only have README.md and CHANGELOG.md
2. **Check docs/**: Should have all other documentation
3. **Check updates**: README and CHANGELOG updated?
4. **Reject**: PRs that don't follow this structure

---

## 📖 Summary

**Root Folder**:
- ✅ README.md (always updated)
- ✅ CHANGELOG.md (always updated)
- ❌ Nothing else

**docs/ Folder**:
- ✅ Everything else
- ✅ Well-organized in subdirectories
- ✅ docs/README.md for navigation

**Remember**: If it's not README.md or CHANGELOG.md, it belongs in `docs/`!

---

**Last Updated**: 2026-06-08  
**Rule**: Mandatory for all documentation
