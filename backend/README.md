# ScribeCount Email — Backend API

.NET 10 Web API with MySQL (XAMPP) for the ScribeCount Email Angular frontend.

## Project structure

```
backend/
├── ScribeCount.Email.csproj
├── package.json           # npm start → dotnet run
├── Controllers/
├── Data/                  # AppDbContext + EF migrations
├── DTOs/
├── Entities/
├── SeedData/              # flow-templates.json (34 templates from frontend)
├── Services/
├── Properties/
├── Program.cs
└── scripts/
    └── export-flow-templates.mjs
```

## Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [XAMPP](https://www.apachefriends.org/) with MySQL
- [Node.js](https://nodejs.org/) (optional, for `npm start` and template export)

## 1. Start MySQL (XAMPP)

1. Open **XAMPP Control Panel**
2. Click **Start** next to **MySQL**
3. (Optional) Open phpMyAdmin → create database `scribecount_email`  
   The API will create it automatically on first run if your MySQL user has permission.

Default connection (in `appsettings.json`):

```
Server=localhost;Port=3306;Database=scribecount_email;User=root;Password=;
```

If your XAMPP MySQL root user has a password, update `ConnectionStrings:DefaultConnection` in `appsettings.Development.json`.

## Deploy on Railway

Railpack was detecting **Python** because the repo root had a misnamed `requirements.txt` (project scope doc). That file is now `docs/SCOPE_OF_WORK.txt`. Deploy the **backend** folder only.

### Railway service settings

| Setting | Value |
|---------|--------|
| **Root Directory** | `backend` |
| **Builder** | Railpack (default) |
| `ASPNETCORE_ENVIRONMENT` | `Production` |

`backend/railpack.json` and `backend/railway.toml` tell Railpack to build and run the .NET API:

```bash
dotnet ScribeCount.Email.dll
```

### Database (Production)

When `ASPNETCORE_ENVIRONMENT=Production`, the API uses Railway MySQL from `appsettings.Production.json`:

```
Server=thomas.proxy.rlwy.net;Port=17287;Database=railway;User=root;Password=***;SslMode=Required;
```

Override with a Railway variable if needed:

| Variable | Example |
|----------|---------|
| `ConnectionStrings__DefaultConnection` | Full MySQL connection string |
| `MYSQL_URL` | Auto-injected when MySQL service is linked |

### Frontend CORS (after you deploy the Angular app)

Add your frontend URL on the API service:

```
Cors__Origins__0=https://your-frontend.up.railway.app
```

### CLI equivalent of the production database

```bash
mysql -h thomas.proxy.rlwy.net -u root -p --port 17287 --protocol=TCP railway
```

On first deploy, EF migrations run automatically on startup.

## 2. Export flow templates (after frontend changes)

```bash
node scripts/export-flow-templates.mjs
# or from backend folder:
npm run export-templates
```

This reads the TypeScript template files from `frontend/src/app/core/services/flow-templates-*.data.ts` and writes `SeedData/flow-templates.json`.

## 3. Run the API

From the `backend` folder:

```bash
npm start
```

Or with .NET directly:

```bash
dotnet run
```

API base URL: **http://localhost:5065**

On startup the API will:

- Apply EF Core migrations
- Seed all **34 flow templates** into MySQL (if the table is empty)

## 4. Run the frontend

```bash
cd frontend
npm start
```

Frontend: **http://localhost:4200**  
Configured API URL: `http://localhost:5065/api/v1` (see `frontend/src/environments/environment.ts`)

## API endpoints

| Area | Endpoints |
|------|-----------|
| Auth | `POST /api/v1/auth/register`, `POST /api/v1/auth/login`, `GET /api/v1/auth/me` |
| Flow templates | `GET /api/v1/flow-templates` |
| User flows | `GET/POST/PUT/DELETE /api/v1/flows` |
| Mailbox | `GET /api/v1/mailbox/setup-instructions`, `POST /api/v1/mailbox/connect`, `GET /api/v1/mailbox/messages` |

## Connect your email inbox (new users)

After registering, you are guided to **Settings → Inbox Connection**.

### Gmail

1. Enable **2-Step Verification** on your Google account
2. Create an **App Password**: Google Account → Security → App passwords
3. In ScribeCount Email settings use:
   - **IMAP:** `imap.gmail.com` port `993` (SSL)
   - **SMTP:** `smtp.gmail.com` port `587` (TLS)
   - **Username:** your full Gmail address
   - **Password:** the 16-character app password (not your regular password)
4. Click **Test connection**, then **Save and sync inbox**

### Outlook / Microsoft 365

1. Enable IMAP in Outlook: Settings → Mail → Sync email
2. Use:
   - **IMAP:** `outlook.office365.com:993`
   - **SMTP:** `smtp.office365.com:587`
3. If 2FA is on, use a Microsoft **app password**

### Yahoo Mail

1. Generate an app password in Yahoo Account Security
2. **IMAP:** `imap.mail.yahoo.com:993` · **SMTP:** `smtp.mail.yahoo.com:587`

### After connecting

- Go to **Email → Inbox** to see synced messages
- Use **Compose** to send via your connected SMTP account
- Click **Sync** in settings anytime to pull new mail

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Unable to connect to MySQL` | Start MySQL in XAMPP; check port 3306 |
| `Access denied for user 'root'` | Set the correct password in `appsettings.json` |
| Gmail auth fails | Use an app password, not your normal password |
| CORS errors | Ensure API runs on port 5065 and frontend on 4200 |
| Empty flow library | Run `npm run export-templates` and restart API |
