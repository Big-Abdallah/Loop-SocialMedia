# ∞ LOOP

A social media app built around connection and community, a calmer, more considered space than a typical dopamine feed. Share posts, follow people, join conversations, and keep up with what matters to you.

Built with **React 19**, **Vite**, **Tailwind CSS 4**, and **HeroUI**, on top of a REST API.

🔗 **Live demo:** [app-note-nu.vercel.app](https://loop-social-media.vercel.app/)
---

## ✨ Features

### 🔐 Authentication
- Register and log in with full client-side validation (React Hook Form + Zod)
- Registration fields: name, username, email, gender, date of birth (13+), password with confirmation
- Strong-password rule: 8+ characters with upper/lower case, a number, and a special character
- Protected routes: guests are redirected to `/login`, signed-in users are redirected away from the auth pages

### 📰 Feed
- **Global feed** and a **following feed** with only the people you follow
- Create posts from a modal, with skeleton loaders while content loads
- Edit, delete, and **share** posts
- Like posts and view who liked them

### 💬 Comments
- Comment on posts and **reply** to comments
- Edit, delete, and like comments
- Post details page shows the top comment first, with a "view all comments" option

### 👥 People
- Follow / unfollow users
- **Follow suggestions** page
- Your own profile (with profile photo upload) and other users' profiles with their posts
- **Bookmarks** to save posts for later

### 🔔 Notifications
- Notifications page with an unread counter
- Mark a single notification or all notifications as read

---

## 🎨 Design

A custom design system, defined with Tailwind v4 `@theme` variables in `src/index.css`:

| Token          | Value     | Use                      |
| -------------- | --------- | ------------------------ |
| Page           | `#F7F5F1` | Warm ivory background    |
| Card           | `#FFFFFF` | Cards and surfaces       |
| Ink            | `#18171B` | Primary text             |
| Ink muted      | `#6E6B72` | Secondary text           |
| Border         | `#E6E2DA` | Hairline borders         |
| Accent (plum)  | `#4A2545` | Buttons, links, accents  |
| Accent soft    | `#F0E6EC` | Soft highlights          |

- **Typography:** Fraunces (serif) for headlines, Inter for UI and body text
- **Style:** slightly rounded rectangles with hairline borders instead of heavy shadows
- **Empty states** with custom illustrations for the feed, notifications, messages, and profile

---

## 🛠️ Tech Stack

| Category           | Tools                                          |
| ------------------ | ---------------------------------------------- |
| Framework          | React 19, Vite                                 |
| Routing            | React Router DOM 7                             |
| UI & Styling       | Tailwind CSS 4, HeroUI                         |
| Forms & Validation | React Hook Form, Zod, @hookform/resolvers      |
| HTTP Client        | Axios                                          |
| Icons              | Font Awesome (React), Lucide React             |
| State              | React Context API                              |
| Linting            | Oxlint                                         |

---

## 📁 Project Structure

```
src/
├── Api/                  # One small module per API call
│   ├── Auth/             # register, login, profile, profile photo, user posts
│   ├── Posts/            # feed, following feed, single post, likes, comments
│   │   └── CrudOperations/   # create, update, delete, share
│   ├── Comments/         # create, update, delete, like, replies
│   ├── Users/            # follow, suggestions, bookmarks
│   └── notifications/    # list, unread count, mark read
├── Components/
│   ├── Post/             # PostCard, CardHeader, PostBody, PostFooter, modals, skeleton
│   ├── Comment/          # CommentsSection
│   ├── Navbar.jsx
│   └── Footer.jsx
├── Contexts/             # AuthContext, getProfileContext (profile + unread count)
├── Layouts/              # AuthLayout, MainLayout
├── Page/                 # Feed, FollowingPosts, PostDetails, Profile, userProfile,
│                         # FollowSuggestions, Notifications, Login, Register, NotFound
├── ProtectedRoutes/      # AuthProtectedRoute, MainProtectedRoute
├── Schema/Auth/          # Zod schemas for login and register
├── Utils/                # timeAgo, calculateAge, formatJoinDate
└── index.css             # Design tokens (Tailwind @theme)
```

---

## 🗺️ Routes

| Path                       | Page                  | Access     |
| -------------------------- | --------------------- | ---------- |
| `/login`, `/register`      | Auth pages            | Guests     |
| `/` , `/feed`              | Global feed           | Signed in  |
| `/following-feed`          | Posts from followed users | Signed in |
| `/post-details/:id`        | Post + comments       | Signed in  |
| `/post-details/:id/likes`  | Post likes            | Signed in  |
| `/profile`                 | My profile            | Signed in  |
| `/userProfile/:userId`     | Another user's profile| Signed in  |
| `/suggestions`             | Follow suggestions    | Signed in  |
| `/notifications`           | Notifications         | Signed in  |

---

## 🔌 API

The app uses a hosted REST API at `https://route-posts.routemisr.com`. The JWT returned on sign-in is saved in `localStorage` and sent in a `token` header on protected requests.

| Area          | Endpoints (examples)                                                       |
| ------------- | -------------------------------------------------------------------------- |
| Users         | `POST /users/signup`, `POST /users/signin`, `GET /users/profile-data`      |
| Profile photo | `PUT /users/upload-photo`                                                  |
| Follow / save | `GET /users/suggestions`, `GET /users/bookmarks`                           |
| Posts         | `GET /posts`, `GET /posts/feed`, `GET /posts/:id`                          |
| Comments      | `/posts/:postId/comments`                                                  |
| Notifications | `GET /notifications`, `GET /notifications/unread-count`                    |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v20.19 or higher
- npm

### Installation

```bash
git clone https://github.com/Big-Abdallah/Loop-SocialMedia.git
cd Loop-SocialMedia
npm install
```

### Run in development

```bash
npm run dev
```

### Build for production

```bash
npm run build
npm run preview
```

---

## 📜 Available Scripts

| Script            | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the development server          |
| `npm run build`   | Build the app for production          |
| `npm run preview` | Preview the production build locally  |
| `npm run lint`    | Run Oxlint                            |

---

## ☁️ Deployment

Designed for Vercel. The app uses client-side routing, so all routes must be rewritten to `index.html` (a `vercel.json` with a catch-all rewrite) for direct links and refreshes to work.

---

## 🗺️ Roadmap

- [ ] Messages
- [ ] Dark mode
- [ ] Infinite scroll / pagination on the feed

---

## 👤 Author

**Abdallah** — [@Big-Abdallah](https://github.com/Big-Abdallah)

---

## 📄 License

No license has been added yet. Add a `LICENSE` file (e.g., MIT) to specify the terms.
