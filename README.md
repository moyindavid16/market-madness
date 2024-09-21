This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Setup
Create a .env file in the root and paste this in there
```
DATABASE_URL="postgresql://mm-db_owner:DoFaH64dYNvy@ep-proud-unit-a5tuepe7-pooler.us-east-2.aws.neon.tech/mm-db?sslmode=require"
# uncomment next line if you use Prisma <5.10
# DATABASE_URL_UNPOOLED="postgresql://mm-db_owner:PASSCODE@ep-proud-unit-a5tuepe7.us-east-2.aws.neon.tech/mm-db?sslmode=require"

NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/api/onboarding"
```
Replace PASSCODE in the DATABASE_URL with DoFaH64dYNvy

Create a .env.local file in the root and paste this in there
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YXBwYXJlbnQtaG9y****bmV0LTQzLmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_0mipygNY2BqPmCqAsnSmspgSUAXaV****rZip3VP4q60z4
```
Remove the 4 asteriks in the keys above


Then run the following commands from root directory
Install dependencies
```
npm i
```

Run Migrations
```
npx prisma migrate dev
```
