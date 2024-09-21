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

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
