# VoltFlow

VoltFlow is a full-stack electric scooter web shop built with Laravel 12 and a React, TypeScript, and Vite frontend. It includes a public product catalogue, customer checkout and order tracking, and an administrator dashboard for managing products and orders.

## Technology stack

| Area | Technologies |
| --- | --- |
| Backend | PHP 8.2+, Laravel 12, Laravel Sanctum, Eloquent ORM |
| Database | MySQL |
| API documentation | OpenAPI 3.0, L5 Swagger |
| Frontend | React 19, TypeScript, Vite |
| UI and state | Tailwind CSS, Zustand, Recharts |
| Maps | Photon geocoding and OpenStreetMap |

## Main features

### Public area

- Responsive home page, navigation, and footer.
- User registration and login with Laravel Sanctum authentication.
- Public product catalogue with search, price and stock filters, sorting, and pagination.
- Individual product pages with current price, availability, description, and image.

### Customer area

- Persistent shopping cart with quantity controls and calculated totals.
- Checkout that creates an order from the current cart and validates available stock.
- Profile page with basic account information and paginated order history.
- Detailed order page with products, prices, delivery address, and current status.
- Customers can cancel their own order while it is still pending.
- Shipping-address lookup and an OpenStreetMap preview without an API key.

### Administrator area

- Dashboard overview with customer, product, order, and revenue totals.
- Recharts visualizations for order statuses and the latest 14 days of revenue.
- Paginated user table with the number of orders per user.
- Responsive product management table with create, edit, delete, and local image upload.
- Products referenced by existing orders cannot be deleted.
- Paginated order table with customer and status information.
- Controlled order status workflow: pending, processing, shipped, delivered, or cancelled.

### Backend and API

- Role-based access for `user` and `admin` accounts.
- API Resources provide consistent JSON responses.
- Database transactions protect stock and order creation from partial updates.
- Product and order endpoints support filtering, sorting, and pagination.
- Complete Swagger/OpenAPI documentation for every backend route.

## Project structure

```text
iteh-voltflow/
├── backend/                         Laravel 12 REST API
├── frontend/                        React and TypeScript application
└── README.md
```

## Prerequisites

Install the following before starting:

- Git
- PHP 8.2 or newer with the extensions required by Laravel and MySQL
- Composer 2
- MySQL 8 or a compatible MySQL server
- Node.js `^20.19.0` or `>=22.12.0`, and npm

## Installation from GitHub

### 1. Clone the repository

```bash
git clone https://github.com/aleksandar-iteh/iteh-voltflow.git
cd iteh-voltflow
```

### 2. Create the database

Create an empty MySQL database named `voltflow`:

```sql
CREATE DATABASE voltflow
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;
```

The database name and credentials may be changed, but they must match the backend `.env` file.

### 3. Configure the Laravel backend

```bash
cd backend
composer install
```

Copy the environment file:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```bash
# macOS or Linux
cp .env.example .env
```

Update the relevant values in `backend/.env`:

```dotenv
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=voltflow
DB_USERNAME=root
DB_PASSWORD=
```

Then initialize the application:

```bash
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan l5-swagger:generate
```

The seeders create demo users, products, orders, and order items. Use `php artisan migrate:fresh --seed` later if you intentionally want to delete all existing database data and rebuild it.

### 4. Configure the React frontend

Open a second terminal from the project root:

```bash
cd frontend
npm ci
```

Copy the frontend environment file:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```bash
# macOS or Linux
cp .env.example .env
```

The default frontend configuration is:

```dotenv
VITE_API_URL=/api
VITE_GEOCODING_URL=https://photon.komoot.io/api
```

During development, Vite proxies `/api` and `/storage` requests to `http://localhost:8000`.

## Running the application

Start the Laravel API from the `backend` directory:

```bash
php artisan serve
```

Start the frontend from the `frontend` directory in another terminal:

```bash
npm run dev
```

The main development URLs are:

| Service | URL |
| --- | --- |
| Frontend | [http://localhost:5173](http://localhost:5173) |
| Backend API | [http://localhost:8000/api](http://localhost:8000/api) |
| Swagger UI | [http://localhost:8000/api/documentation](http://localhost:8000/api/documentation) |
| OpenAPI JSON | [http://localhost:8000/docs](http://localhost:8000/docs) |

## Demo accounts

All seeded accounts use the password `password`.

| Role | Email |
| --- | --- |
| Administrator | `admin@voltflow.rs` |
| Customer | `marko.petrovic@example.com` |
| Customer | `ana.jovanovic@example.com` |
| Customer | `nikola.ilic@example.com` |

These credentials are intended only for local development and demonstration.

## API documentation

Swagger UI supports the complete API and Sanctum Bearer authentication. Log in through `/api/login`, copy the returned `access_token`, select **Authorize** in Swagger UI, and enter the token.

Regenerate the OpenAPI specification after changing routes, request validation, resources, or annotations:

```bash
cd backend
php artisan l5-swagger:generate
```

## Tests and code quality

Run backend tests and formatting checks:

```bash
cd backend
php artisan test
vendor/bin/pint --test app/OpenApi config/l5-swagger.php
```

Run frontend linting and create a production build:

```bash
cd frontend
npm run lint
npm run build
```

## Troubleshooting

- **Database connection error:** verify that MySQL is running, the `voltflow` database exists, and all `DB_*` values in `backend/.env` are correct.
- **Uploaded images are not visible:** run `php artisan storage:link` in `backend` and keep the Laravel server running on port `8000`.
- **Frontend API requests fail:** confirm that both development servers are running on ports `5173` and `8000` and that `VITE_API_URL=/api`.
- **Swagger UI shows outdated endpoints:** run `php artisan l5-swagger:generate` again.
- **Map lookup returns no result:** try a more complete shipping address and verify internet access to Photon and OpenStreetMap services.
