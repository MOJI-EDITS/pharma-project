This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

This project is already linked to a Vercel project and includes a `vercel.json` deployment config.

### Recommended deployment steps

1. Deploy using Vercel from the dashboard or CLI.
2. Add these environment variables to the project settings:
   - `MONGODB_URI`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `OPENAI_API_KEY`
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_APP_URL`
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` (optional for Google sign-in)
3. Keep secrets in Vercel configuration only. Do not commit `.env.local` or any secret files.

The build command is `npm run build` and the app will deploy as a standard Next.js application.

For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
