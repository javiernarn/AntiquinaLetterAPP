# For Jessa Mae — A Letter Worth Opening

A one-of-a-kind digital proposal: a sealed wax envelope, a short sequence of
questions where "No" can never actually be pressed, a celebration when she
says yes, and a private collection of letters she can open and re-open
whenever she wants. You sign in with Google to write and manage everything;
she never signs in at all — she just opens the link.

## What's inside

- **Public experience** (`/`) — hero → question sequence → celebration →
  wax-seal envelope → letter collection. No login required.
- **Admin dashboard** (`/admin`) — Google sign-in restricted to you, with
  full CRUD for letters and questions, live view of her answers, and an
  editor for the on-page copy.
- **Firebase Auth + Firestore** — the whole backend. No server to run.

## 1. Create a Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. Inside the project: **Build → Authentication → Sign-in method → Google → Enable**.
3. **Build → Firestore Database → Create database** (start in production mode).
4. **Project settings → General → Your apps → Add app → Web**. Copy the
   `firebaseConfig` values shown.

## 2. Configure the app

```bash
cp .env.example .env
```

Fill in `.env` with:
- The six `VITE_FIREBASE_*` values from step 1.
- `VITE_ADMIN_EMAILS` — your Google account email (comma-separate if more
  than one person should be able to edit).
- `VITE_RECIPIENT_NAME`, `VITE_RECIPIENT_FULL_NAME`, `VITE_SENDER_NAME`.

Then open `firestore.rules` and replace `'you@gmail.com'` inside `isAdmin()`
with the **same email(s)** you put in `VITE_ADMIN_EMAILS`. This is what
actually enforces "only I can edit" at the database level — the `.env`
value alone is just the client-side check.

## 3. Install and run locally

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` for the public page, and
`http://localhost:5173/admin` to sign in and start writing letters.

## 4. Deploy to Vercel

Firebase **Authentication** and **Firestore** are standalone cloud
services — they don't care where your frontend is hosted. Deploying the
site itself to Vercel and keeping Google Sign-In working are completely
independent; you're not tied to Firebase Hosting for any of this.

**a) Push the project to a GitHub repo, then in Vercel:**
1. [vercel.com/new](https://vercel.com/new) → import the repo.
2. Framework preset: **Vite**. Build command `npm run build`, output
   directory `dist` (Vercel usually detects this automatically).
3. Under **Environment Variables**, add every key from your `.env` —
   Vercel does not read your local `.env` file, so these have to be
   entered in its dashboard:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_ADMIN_EMAILS`
   - `VITE_RECIPIENT_NAME`, `VITE_RECIPIENT_FULL_NAME`, `VITE_SENDER_NAME`
4. Deploy. `vercel.json` (included) rewrites every route to `index.html`
   so client-side routes like `/admin` load correctly on refresh.

**b) Tell Firebase to trust your new domain.** This is the one step people
miss, and it's the reason Google Sign-In can fail after moving off
Firebase Hosting:
- Firebase Console → **Authentication → Settings → Authorized domains → Add domain**
- Add the domain Vercel gives you (e.g. `your-app.vercel.app`), and again
  for every custom domain you attach later. Preview deploys get random
  subdomains, so add your production domain here at minimum — for preview
  URLs to also support sign-in, add each one, or just test auth on the
  production domain.

**c) Firestore rules still deploy through Firebase, not Vercel** — that
part doesn't move:
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```
(Edit `.firebaserc` first and put your real project ID in place of
`your-firebase-project-id`.) Run this again any time you edit
`firestore.rules`.

That's the whole split: **Vercel serves the React app. Firebase still
handles sign-in, the database, and security rules.** Nothing about moving
the frontend to Vercel changes how Google Auth behaves — it only needs
that one authorized-domain entry.

## 5. Using it

- Go to `/admin`, sign in with Google, and:
  - **Questions tab** — write your own sequence (defaults to "Do you know
    how much I love you?", "Can I be honest with you?", "Will you be my
    girlfriend?" — add a "Will you marry me?" one any time).
  - **Letters tab** — write as many letters as you want, each with its own
    title, stamp emoji, envelope color, and body text.
  - **Page copy tab** — edit the hero title/body and the celebration
    message without touching code.
  - **Her responses tab** — every time someone opens the link, a live
    record appears here: her answers, whether she said yes, and which
    letters she's opened.
- Copy the link shown at the top of the dashboard and send it to Jessa.
  She opens it, answers the questions (the "No" button won't let her say
  no), and once she reaches "yes," the envelope appears and the letters
  unlock.

## Architecture

```
src/
  firebase.js              Firebase SDK init + admin email allow-list
  context/AuthContext.jsx  Google sign-in, admin gating, sign out
  services/                Firestore CRUD: letters, questions, responses, settings
  components/
    DodgeButton/            The "No" that can't be clicked
    QuestionFlow/            One-question-at-a-time flow with page-turn transitions
    Envelope/                 Wax-seal open animation
    LetterCard/ LetterViewer/ Letter grid + full-text modal
    Confetti/                 Celebration burst
    Shared/                  Background FX, loader, route guard
  pages/
    Proposal/    Public experience, stage machine: intro → questions → celebrate → envelope → letters
    Admin/       Login, dashboard shell, Letters/Questions/Responses/Settings panels
```

Data model (Firestore):
- `letters/{id}` — title, body, category, envelopeColor, stamp, order
- `questions/{id}` — text, subtext, yesLabel, noLabel, order, active
- `responses/{id}` — her answers, finalDecision, openedLetterIds, timestamps
- `settings/app` — the editable hero/celebration copy

Firestore rules make `letters`, `questions`, and `settings` publicly
**readable** but only admin-**writable**, and let anyone create/update
their own `responses` document (to log answers) while only the admin can
read or list them.

## Notes

- If you skip Firebase setup entirely, the public page still works using
  built-in default questions and letters (see `src/data/`) — but nothing
  is editable or saved until Firebase is configured.
- The icons in `public/icons/` and `public/favicon.svg` are a custom wax-seal
  "J" monogram generated for this project — replace them with your own art
  any time.
