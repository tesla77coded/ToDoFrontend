# Todo Frontend (React + Vite + Tailwind)

Minimal, production-ready frontend for the **Todo Backend internship assignment**.
This repo is intended to be a small UI to exercise the backend APIs (auth, RBAC, tasks). Built with Vite, React and Tailwind.

---

## Contents

* `src/` — React source files (components, pages, context, api client)
* `public/` — static assets
* `index.html` — app entry
* `package.json` — scripts & deps
* `.gitignore` — files not to commit
* `README.md` — this file

---

## Features

* Register / Login (JWT auth)
* Persistent auth (token + user stored in `localStorage`)
* Protected dashboard (requires token)
* Create / Read / Update / Delete tasks
* Task fields: `title`, `description`, `dueDate`, `status`, `subtasks`
* Admin-only Users list & delete
* User profile editing (open via **My Account**)
* Sort & server-side search for tasks
* Tailwind-powered responsive UI (minimal polish)

---

## Quick start (local)

> Node 18+ recommended.

1. Clone repo (or use your local folder)

```bash
git clone git@github.com:YOUR_GITHUB_USERNAME/REPO_NAME.git
cd REPO_NAME
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` (local development)
   Create a `.env` in the project root (DO NOT commit it). Example:

```
VITE_API_URL=http://localhost:9000/api/v1
```

* `VITE_API_URL` must include the `/api/v1` prefix used by the backend.
* Vite only bakes `VITE_*` env vars at **build time**; for dev this is read automatically by Vite.

4. Run dev server

```bash
npm run dev
```

Open `http://localhost:5173` (Vite default). Login/register and exercise the app.

---

## Test production build locally (optional)

If you want to test the production build before deploying:

```bash
# build (ensure VITE_API_URL is set to the right backend)
npm run build

# preview the build
npm run preview
# or use an external static server:
# npx serve -s dist -l 5000
```

---

## Deploy (Vercel recommended)

Vercel auto-detects Vite projects.

1. Push your repo to GitHub.
2. Import the repo into Vercel: [https://vercel.com/new](https://vercel.com/new)
3. Configure (if Vercel doesn't auto-detect):

   * Build Command: `npm run build`
   * Output Directory: `dist`
4. Add environment variable in Vercel project settings:

   * `VITE_API_URL` = `https://todobackendassignment-wy0n.onrender.com/api/v1` (or your backend URL)
5. Deploy. Vercel will build and serve the site. Set the same `VITE_API_URL` for Preview (optional).

**Important:** After deploying, add the deployed frontend origin (e.g. `https://your-site.vercel.app`) to your backend CORS allowed origins.

---

## API / Backend expectations

This frontend expects the backend API to be at `VITE_API_URL` and follow these routes (mounted under `/api/v1`):

**Users**

* `POST /users/register` → `{ message, user }` (201)
* `POST /users/login` → `{ token, _id, name, email, isAdmin }` (200)
* `GET /users/me` (requires auth) → `{ user }`
* `PUT /users/:id` → updated user
* `GET /users/all` (admin)
* `DELETE /users/:id` (admin)

**Tasks**

* `POST /tasks` → created task (201)
* `GET /tasks?status=&q=&sort=` → list tasks
* `GET /tasks/:id` → single task
* `PUT /tasks/:id` → updated task
* `PATCH /tasks/:id/archive` → archived task
* `DELETE /tasks/:id` → delete task

---

## License

MIT — for educational/demo purposes (internship assignment).
