# Task 0: Project Scaffold & GitHub Setup

**Context:** First task. Create the project structure, initialize git, dotfiles, and CI.

**Directory:** `/home/starlyn/Escritorio/AL100`

## Steps

1. Create `.gitignore` with: node_modules, .next, .env, .env.local, *.pyc, __pycache__, .pytest_cache, venv, .vercel, dist, coverage, *.log, .DS_Store
2. Create `README.md` with project title "AL100 - Plataforma Inteligente de Recolección de Residuos Urbanos", architecture description, tech stack badges, quick start, module descriptions (Ciudadano, Chofer, Ayuntamiento, IA), license
3. Create `LICENSE` (MIT)
4. Create `CONTRIBUTING.md` (standard contributing guide)
5. Create `.github/workflows/ci.yml` with Node 22 + Python 3.12 lint/typecheck
6. Create `docker-compose.yml` with api (port 8000) and web (port 3000) services
7. Initialize git: `git init && git add . && git commit -m "chore: initial scaffold"`
8. Create `apps/web/public/` directory (empty, for Next.js)
9. Create `apps/api/` directory with empty `__init__.py` files for the clean architecture structure

**Report file:** `.superpowers/sdd/task-0-report.md`
After completion, write brief report there with format:
```
Status: DONE
Commits: <hash> - <message>
Tests: N/A (scaffold task)
```

**Global constraints:**
- Node >= 22
- Python >= 3.12
- Dark mode OLED theme
- All text in Spanish
