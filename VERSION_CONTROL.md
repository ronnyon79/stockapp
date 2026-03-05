# Version Control Guidelines

## Commit Strategy

- **Small, frequent commits** - Bump version for every feature or fix
- **Commit message format** - Version number only (e.g., `v0.3.1`)
- **Git tags** - Tag each version: `git tag v0.3.1`

## CHANGELOG

Before each commit:
1. Update the **Changelog** section in `README.md`
2. Document what changed in that version (Added, Changed, Fixed, Removed)
3. Include the date

## Push Workflow

- **Always ask before pushing** to GitHub
- Human must approve before any `git push`

## Version Numbering

Follow semantic versioning: `vMAJOR.MINOR.PATCH`

- **MAJOR** - Breaking changes
- **MINOR** - New features (backwards compatible)
- **PATCH** - Bug fixes (backwards compatible)

## Example Workflow

```bash
# 1. Update README.md changelog with new version

# 2. Stage changes
git add .

# 3. Commit with version number
git commit -m "v0.3.1"

# 4. Tag the version
git tag v0.3.1

# 5. Ask for push permission
# [Wait for human approval]

# 6. Push
git push origin main
git push origin --tags
```

---
*Created: 2026-03-05*
