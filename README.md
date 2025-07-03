# 🌐 PostGraphile JWT-Enabled API

API berbasis [PostGraphile](https://www.graphile.org/postgraphile/) dengan dukungan JWT, introspeksi schema, dan auto expose ke GraphiQL. Cocok untuk digunakan sebagai backend modern berbasis PostgreSQL + GraphQL + Role-based Access.

## 🚀 Fitur

- Auth via JWT (Bearer Token atau Query Param `?jwt=`)
- GraphiQL IDE dengan autentikasi
- Endpoint introspeksi schema GraphQL
- Output introspeksi bisa JSON atau `.graphql` (SDL)
- Dynamic multi-schema (selain `pg_catalog` dan `information_schema`)
- Plugin `postgraphile-plugin-connection-filter` aktif

## 📦 Instalasi

### 1. Clone repo ini

```bash
git clone https://github.com/hansendusenov/postgrahpile-framework.git
cd postgrahpile-framework
```

### 2. Install dependencies

```bash
npm install
```

### 3. Buat file `.env`

Salin dari file `.env.example` dan sesuaikan:

```bash
cp .env.example .env
```

Isi variabel `.env` sebagai berikut:

```env
DATABASE_URL=postgres://username:password@localhost:5432/nama_database
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

## 🏁 Menjalankan Server

```bash
node server.js
```

Jika ingin menjalankan otomatis saat develop:

```bash
npm install -g nodemon
nodemon server.js
```

## 🌐 Endpoint Tersedia

| Endpoint | Deskripsi |
|---------|-----------|
| `/graphql?jwt=...` | GraphQL endpoint (butuh JWT) |
| `/graphiql?jwt=...` | IDE GUI (GraphiQL) dengan autentikasi |
| `/schema-introspection?jwt=...` | Introspeksi schema dalam format JSON |
| `/schema-introspection?format=graphql&jwt=...` | Introspeksi schema dalam format `.graphql` (SDL) |

## 🧪 Contoh JWT

Gunakan JWT dengan `payload` seperti ini (sesuaikan `aud` jika perlu):

```json
{
  "role": "admin",
  "aud": "postgraphile"
}
```

JWT bisa dikirim sebagai:
- Header: `Authorization: Bearer <token>`
- Atau Query Param: `?jwt=<token>`

## 🔐 Catatan Keamanan

Pastikan role (`admin`, `user`, dll) yang digunakan dalam JWT juga tersedia di database PostgreSQL, misalnya:

```sql
CREATE ROLE admin;
```

## 🧑‍💻 Kontributor

- Hansen Dusenov – [hansendusenov.web.id](https://hansendusenov.web.id)

## 📄 Lisensi

MIT License