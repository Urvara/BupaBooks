# Bupa Books App

## Development

Install dependencies and start both the Vite client and Express API:

```sh
npm install
npm run dev
```

The client requests `/api/bookowners`; Vite proxies this route to the Express
server on port 3001. Express fetches the upstream book owners endpoint and
caches successful responses in memory for five minutes. Concurrent requests
share the same upstream fetch, and rate-limit responses are not retried by the
client.

To run the API separately, use `npm run server`. Set `PORT` to change its
listening port; if changed, update the proxy target in `vite.config.ts`.

`npm run build` type-checks and builds the client. The Express API must also be
deployed as a server-side service and routed under `/api` in production.


# Bupa Books App (client)

A React + TypeScript application that retrieves book owner data from an API and displays books grouped by owner age category:

- Adult Owners (18 years and above)
- Child Owners (below 18 years)

The application also provides filtering to display only Hardcover books.

---

## Features

✅ Fetches data from API on demand

✅ Groups books by owner age

✅ Sorts books alphabetically

✅ Filters Hardcover books only

✅ Displays loading and error states

✅ Uses React Query for server state management

✅ Uses TypeScript for type safety

✅ Optimized with useMemo and useCallback

---

## Tech Stack

- React
- TypeScript
- Vite
- React Query (@tanstack/react-query)
- Axios
- CSS

---



## Installation

```

Navigate to the project:

```bash
cd BupaBooksApp
```

Install dependencies:

```bash
npm install
```

---

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:5173
```

---

## Available Actions

### Get Books

Fetches all books from the API and displays them grouped under:

- Books owned by Adults
- Books owned by Children

### Hardcover Only

Fetches books and displays only books whose type is:

```text
hardcover
```

Grouped under:

- Hardcover Books owned by Adults
- Hardcover Books owned by Children

---

## Business Rules Implemented

### Adult Owners

Owners with age:

```text
>= 18
```

Books are displayed under:

```text
Books owned by Adults
```

### Child Owners

Owners with age:

```text
< 18
```

Books are displayed under:

```text
Books owned by Children
```

### Hardcover Filter

When the Hardcover Only button is clicked:

```text
book.type === "hardcover"
```

Only matching books are displayed.

### Sorting

Books are sorted alphabetically by book name using:

```typescript
book.name.localeCompare()
```

---

## Loading State

While data is being fetched:

```text
Loading...
```

is displayed to the user.

---

## Error Handling

API errors are handled gracefully and displayed to the user.

Examples:

```text
Network Error
```

```text
Unable to load book owners.
```

---

## Performance Optimizations

### useMemo

Used to avoid recalculating grouped and sorted book lists unless:

- API data changes
- Hardcover filter changes

### useCallback

Used to memoize click handlers:

- Get Books
- Hardcover Only

This prevents unnecessary recreation of functions during re-renders.

---

## Example Output

### Books owned by Adults

```text
Building Microservices
Clean Code
Domain Driven Design
Refactoring
```

### Books owned by Children

```text
Alice in Wonderland
Harry Potter
Peter Pan
```

---

## Scripts

Run development server:

```bash
npm run dev
```

Build production bundle:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Author

Urvara Tyagi