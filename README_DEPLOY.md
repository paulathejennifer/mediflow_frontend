# Deployment (Vercel)

This project is configured for platform-native Vercel deployments. The repository includes a GitHub Actions workflow that builds the Next.js app and triggers a Vercel deployment on push to `main`.

Required GitHub Secrets:
- `VERCEL_TOKEN` — Personal or service token from Vercel (used to authenticate the Action).
- `VERCEL_ORG_ID` — Your Vercel organization ID.
- `VERCEL_PROJECT_ID` — Your Vercel project ID.

How to get IDs:
1. In Vercel, open your Project Settings → General → Project ID.
2. For Org ID, open Account Settings → Teams / Organizations and copy the ID.
3. Create a personal token in Vercel Settings → Tokens.

Add the three values as GitHub repository secrets (Settings → Secrets & variables → Actions).

Notes:
- The GitHub Actions workflow runs `npm ci --legacy-peer-deps` and `npm run build` before deployment.
- For Vercel native deployment, set the Vercel Install Command to `npm ci --legacy-peer-deps`.
- Root Directory should remain the repo root (where `package.json` lives), not `src/` or `public/`.
- If you leave Vercel install command blank, it may default to `npm install` and fail because this repo currently has an `eslint` peer dependency conflict.

Local build verification (recommended before pushing):
```
# use legacy peer deps because this repo currently contains a peer dependency conflict
npm ci --legacy-peer-deps
npm run build
```
