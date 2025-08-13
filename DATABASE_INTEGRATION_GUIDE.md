# Database Integration Guide

This guide explains how to integrate your application with the PostgreSQL database using Drizzle ORM.

## ✅ Current Setup Status

Your application is **already configured** with:
- ✅ Drizzle ORM with PostgreSQL
- ✅ Database schema defined in `shared/schema.ts`
- ✅ Database connection configured in `server/db.ts`
- ✅ Database operations implemented in `server/dbStorage.ts`
- ✅ API routes updated to use database storage

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
# Database Configuration
DATABASE_URL=postgres://myappuser:mypassword@localhost:5432/myappdb

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 2. Database Setup

#### Option A: Local PostgreSQL
```bash
# Install PostgreSQL locally
# Create database
createdb myappdb

# Update DATABASE_URL in .env
DATABASE_URL=postgres://myappuser:mypassword@localhost:5432/myappdb
```

#### Option B: Neon Database (Cloud)
```bash
# Sign up at https://neon.tech
# Create a new project
# Copy the connection string
# Update DATABASE_URL in .env
```

### 3. Run Database Migrations

```bash
# Generate initial migration
npm run db:generate

# Run migrations
npm run db:migrate

# Or use the setup script
node setup-database.js
```

### 4. Start the Application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

## 📊 Database Schema

Your database includes a `transactions` table with the following structure:

```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL, -- "credit" or "debit"
  sub_type TEXT NOT NULL, -- "Weekly", "240💎", "esewa", "bank", etc.
  index INTEGER, -- only for credit transactions
  rate REAL, -- only for credit transactions
  amount REAL NOT NULL,
  profit REAL, -- calculated for credit transactions
  quantity INTEGER, -- only for debit transactions
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## 🔧 Available API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/:id` | Get a single transaction |
| POST | `/api/transactions` | Create a new transaction |
| PUT | `/api/transactions/:id` | Update a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

## 🧪 Testing the Integration

### Test Database Connection
```bash
# Test with curl
curl http://localhost:5000/api/transactions

# Test with Postman or similar tool
```

### Create a Test Transaction
```bash
curl -X POST http://localhost:5000/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "type": "credit",
    "subType": "Weekly",
    "amount": 1000,
    "rate": 1.5,
    "index": 1
  }'
```

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run db:generate` | Generate new migration |
| `npm run db:migrate` | Run pending migrations |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio (database GUI) |

## 🔍 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check DATABASE_URL format
   - Ensure PostgreSQL is running
   - Verify credentials

2. **Migration errors**
   - Run `npm run db:generate` first
   - Check for schema conflicts

3. **Permission errors**
   - Ensure database user has proper permissions
   - Check firewall settings

### Debug Database Issues
```bash
# Check database connection
node -e "import('./server/db.js').then(({db}) => db.select().from(import('./shared/schema.js').transactions).limit(1).then(console.log).catch(console.error))"
```

## 📈 Performance Tips

1. **Connection Pooling**: Use connection pooling for production
2. **Indexes**: Add indexes for frequently queried columns
3. **Caching**: Implement Redis caching for read-heavy operations
4. **Monitoring**: Use database monitoring tools

## 🔄 Switching Database Providers

### From Local to Neon
1. Update `DATABASE_URL` in `.env`
2. Run migrations: `npm run db:migrate`
3. No code changes needed!

### From PostgreSQL to MySQL
1. Update `drizzle.config.ts` dialect
2. Update dependencies
3. Update connection string format

## 📚 Additional Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon Database Documentation](https://neon.tech/docs)
