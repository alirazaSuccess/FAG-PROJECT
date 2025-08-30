
# FAG — Full Fixed Project (Frontend + Backend)

This package bundles your original **frontend** and the **fixed backend** with referral/bonus logic.

## Structure
- `frontend/` — React app (your original code with minor patch in `Login_Signup.js` to pass `refCode` from URL)
- `Backend/` — Node/Express/Mongo backend (fixed, referral + bonus implemented)

## Run Backend
```bash
cd Backend
cp .env.example .env   # then edit values if needed
npm i
npm run dev
```
The backend runs on `http://localhost:5000` by default.

## Run Frontend
```bash
cd frontend
npm i
npm start
```
The frontend runs on `http://localhost:3000` by default.

## Referral Flow
- Each user has a unique `refCode`.
- Share link format: `http://localhost:3000/register?ref=REF123456`
- When a new user signs up via that link, they attach to the parent.
- When a user reaches `BONUS_AFTER` direct referrals (default 3), they get `BONUS_AMOUNT` (default 100) in balance.

## Important Endpoints
- `POST /api/users/signup` — accepts `refCode`
- `POST /api/users/login`
- `GET /api/users/me` (Bearer token)
- `GET /api/users/referral` (Bearer token) — returns `refCode` and share link
- `GET /api/users/subusers` (Bearer token) — direct referrals
- `GET /api/users/tree` (Bearer token) — depth-2 tree
