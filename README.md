# Purdue Foodies – Online Food Ordering (Front-End Project)

A multi-page front-end web application that simulates an online food ordering experience. Users can register and log in, browse restaurants, view menus, add items to a cart, manage their profile, and (as an admin) manage users.

This project was created as a **first front-end school project** and focuses on client-side architecture, state management, and React fundamentals without using a build tool.

---

## Project Overview

The application is built using:
- **HTML** as multi-page entry points
- **Tailwind CSS (CDN)** for styling
- **React 18 (UMD builds)** for UI rendering
- **Babel Standalone** to support JSX directly in the browser
- **localStorage** for persisting users, sessions, and cart data

No backend server or database is used; all data and authentication are simulated on the client.

---

## File Structure (Key Files)

> Some component files are not included due to file upload limits, but are referenced by the HTML pages.

### HTML Pages
- `restaurants.html` – Displays the list of restaurants.
- `menu.html` – Displays the menu for a selected restaurant (`menu.html?id=<restaurantId>`).
- `login.html` – User login page.
- `register.html` – User registration page.
- `profile.html` – User profile management page.
- `admin.html` – Admin-only page for managing users.

Each HTML page loads:
- Tailwind CSS via CDN
- React and ReactDOM (UMD)
- Babel standalone
- Shared navigation and cart components
- Page-specific JavaScript logic

---

## JavaScript – Data / State

### `cartDb.js`
- Manages shopping cart state
- Uses `localStorage` for persistence
- Stores items internally using a `Map`
- Exposes a global `cartStore`
- Integrates with React via `useSyncExternalStore`
- Dispatches a `cart:item-added` custom browser event when items are added

### `userDb.js`
- Manages user accounts and authentication
- Stores users in `localStorage`
- Passwords are hashed using SHA-256 via the Web Crypto API
- Tracks the logged-in user using a `currentUserId`
- Includes admin-only functionality:
  - List users (non-sensitive fields only)
  - Delete users (admin account protected)
- Includes a default demo admin account

---

## JavaScript – UI Logic

### `restaurants.js`
- Fetches restaurant data from a remote JSON endpoint
- Renders a responsive restaurant grid using React
- Each restaurant card links to its corresponding menu page

### `menu.js`
- Reads the restaurant ID from the URL query string
- Fetches restaurant data and displays menu items
- Allows users to add items to the cart
- Displays a toast notification when an item is added

### `admin.js`
- Renders the Admin Users table
- Restricts access to logged-in admin users only
- Redirects non-authenticated or non-admin users
- Loads users via `userDb.listUsers()`
- Allows deleting non-protected users with confirmation
- Refreshes the list after user removal

### `cart.js`
- Implements the slide-out cart drawer UI
- Subscribes to cart state using `cartStore`
- Displays line items, quantities, and subtotal
- Supports increment/decrement quantity controls
- Removes items by decrementing quantity to zero
- “Place Order” clears the cart and displays confirmation
- Exposes a global `window.cartDisplay` API for opening/closing the cart

### `login.js`
- Renders the login form UI
- Uses controlled inputs for credentials
- Authenticates users via `userDb.login()`
- Displays success or error messages
- Redirects to the restaurant list on successful login

### `register.js`
- Renders the registration form
- Collects user profile and password information
- Creates a new user via `userDb.createUser()`
- Displays validation and error feedback
- Designed for demo usage without forced auto-login

### `profile.js`
- Displays the current user’s profile information
- Redirects to login if no user is authenticated
- Supports read-only and edit modes
- Uses a draft state for safe editing
- Saves updates via `userDb.updateCurrentUserProfile()`
- Displays success or error messages on save

### `navbar.js`
- Renders the site-wide navigation bar
- Displays login/register buttons or user menu based on auth state
- Shows cart item count badge (hidden when empty)
- Provides profile navigation and logout functionality
- Displays admin-only links conditionally
- Opens the cart drawer via `window.cartDisplay.open()`

---

## How to Use the App

### Browsing Restaurants and Menus
1. Open `restaurants.html`
2. Click on a restaurant card
3. You will be redirected to `menu.html?id=<restaurantId>`

### Cart
- Click **Add** on a menu item to add it to the cart
- Cart state is saved in `localStorage` and persists across page reloads

### Authentication
- Register via `register.html`
- Log in via `login.html`
- Update profile information via `profile.html`

### Admin Access
- Admin page: `admin.html`
- Demo admin credentials (for project demonstration only):
  - **Username:** admin
  - **Password:** adminpassword

---

## Data Source

Restaurant and menu data is fetched from:
https://dummyjson.com/c/2d83-4f1d-4625-a81f

The app expects data in the format:
- `restaurants[]`
  - `id`
  - `name`
  - `cuisine`
  - `image`
  - `menu.items[]`

---

## Technical Notes

- React is loaded via CDN instead of a build tool
- JSX is compiled in the browser using Babel
- Application state is managed using browser APIs and custom stores
- Authentication and authorization are simulated client-side
- Semantic HTML and basic accessibility attributes are used

---

## Known Limitations

- Front-end only (no backend or real database)
- Authentication is not secure (localStorage-based)
- Not intended for production use
- Some component files are omitted from submission due to upload limits

---

## Possible Future Improvements

- Migrate to a modern build setup (Vite + React)
- Add React Router or a framework like Next.js
- Implement a real backend and database
- Add automated testing
- Improve form validation and error handling

---

## Academic Disclaimer

This project was created for educational purposes to demonstrate front-end development concepts and does not represent a production-ready system.
