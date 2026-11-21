# csv-exporter

A React front end that uploads accounting CSV files to a Django REST API. The API runs a pandas computation on the rows, saves the result for the user, and the client shows it in an MUI DataGrid that you can filter and export back to CSV.

## Features

- Sign up and log in (passwords are hashed with Django's `make_password`)
- CSV upload with column mapping via `react-csv-importer`
- Server-side computation with pandas: sum of `Montant` grouped by `EcritureDate` and `CompteNum` (pivot table)
- Results shown in an MUI DataGrid with the built-in toolbar (filter, column picker, density, CSV export/print)
- Per-user history of past computations, each one can be reopened in the grid

## Tech stack

- **Backend:** Python, Django 4, Django REST Framework, django-cors-headers, pandas, NumPy, PostgreSQL
- **Frontend:** React 18 (Create React App), React Router 6, MUI + MUI X DataGrid, axios, Bootstrap 5 (CDN)

## Project structure

```
csv-exporter/
├── project/                 # Django project
│   ├── manage.py
│   ├── project/             # settings, root urls, wsgi/asgi
│   └── csv_importer/        # app: models, serializers, views, urls, migrations
├── client/                  # React app
│   ├── public/
│   └── src/
│       ├── views/           # Home (upload), History, Login, Register, Profile
│       ├── components/      # DataTable, Layout, Navbar, ...
│       └── CONSTANT.js      # API base URL and small helpers
├── example.csv              # sample input file
├── requirements.txt
└── .env.example
```

## Setup

### Backend

Requires Python 3.8+ and a running PostgreSQL server (the `Computation` model uses `JSONField`, and the app imports `django.contrib.postgres`).

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a database (for example `csv_importer`), then set the environment variables listed in `.env.example`. The settings read plain environment variables; nothing loads a `.env` file automatically, so export them in your shell:

| Variable | Required | Default |
|---|---|---|
| `DJANGO_SECRET_KEY` | yes | none |
| `DJANGO_DEBUG` | no | `False` (set `True` for local dev) |
| `DJANGO_ALLOWED_HOSTS` | no | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | no | `http://localhost:3000` |
| `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` | password yes | `csv_importer` / `postgres` / empty / `localhost` / default port |

```bash
cd project
python manage.py migrate
python manage.py runserver      # http://127.0.0.1:8000
```

### Frontend

```bash
cd client
npm install
npm start                       # http://localhost:3000
```

Optionally copy `client/.env.example` to `client/.env` and set `REACT_APP_API_URL` (defaults to `http://127.0.0.1:8000/api/`).

## API

All routes are under `/api/`.

| Method | Route | Purpose |
|---|---|---|
| `GET` / `POST` / `DELETE` | `users` | list users / sign up / delete all users |
| `POST` | `users/validate` | log in with `email` and `password` |
| `GET` / `POST` | `data` | list all computations / run a computation on `{ raw, type, user }` |
| `GET` | `records/<user_id>` | a user's past computations, newest first |

## Usage

1. Register and log in.
2. On the home page, upload a CSV and map its columns. The importer expects the French FEC accounting columns:
   `JournalCode, JournalLib, EcritureNum, EcritureDate, CompteNum, CompteLib, CompteAuxNum, CompteAuxLib, PieceRef, PieceDate, EcritureLib, Montant, Sens, EcritureLet, DateLet, ValidDate, MontantDevise, Idevise` plus optional `CompCode` and `Periode`.
   The computation itself only uses `EcritureDate`, `CompteNum` and `Montant`.
3. Click **Finish**. The summed result appears in the data grid, where it can be filtered or exported.
4. Open **History** to see and reopen earlier results.

`example.csv` is a sample file in this format.
