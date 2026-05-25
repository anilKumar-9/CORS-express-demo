# CORS Practice with React and Express

## Overview

This project demonstrates how Cross-Origin Resource Sharing (CORS) works between a React frontend and an Express backend.

The goal of this project is to understand:

- What CORS is
- Why browsers block requests
- What an origin means
- How frontend and backend communicate
- How to configure CORS properly in Express
- What `credentials: true` means
- Common CORS mistakes
- Polling APIs using `setInterval`
- Using `useEffect` and `useRef`

---

# What is CORS?

CORS stands for:

```txt
Cross-Origin Resource Sharing
```

It is a browser security mechanism.

Browsers block requests between different origins unless the backend explicitly allows them.

---

# What is an Origin?

An origin consists of:

```txt
protocol + domain + port
```

Example:

```txt
http://localhost:5173
```

Breakdown:

| Part | Value |
|---|---|
| Protocol | http |
| Domain | localhost |
| Port | 5173 |

---

# Same Origin Example

Frontend:

```txt
http://localhost:3000
```

Backend:

```txt
http://localhost:3000
```

This is same origin.

No CORS issue occurs.

---

# Different Origin Example

Frontend:

```txt
http://localhost:5173
```

Backend:

```txt
http://localhost:3000
```

Ports are different.

Therefore:

```txt
Different Origin
```

Browser blocks the request unless backend allows it.

---

# Why Browsers Block Requests

Without CORS, malicious websites could:

- Read your private data
- Send unauthorized requests
- Access authenticated sessions
- Steal sensitive information

CORS protects users.

---

# What Happens During a Request?

## Step 1

Frontend sends request:

```js
fetch("http://localhost:3000/home")
```

---

## Step 2

Browser checks:

```txt
Is this request going to another origin?
```

If yes:

```txt
CORS policy applies
```

---

## Step 3

Backend must respond with headers like:

```txt
Access-Control-Allow-Origin
```

Example:

```txt
Access-Control-Allow-Origin: http://localhost:5173
```

---

## Step 4

Browser verifies the headers.

If allowed:

```txt
Request succeeds
```

Otherwise:

```txt
CORS Error
```

---

# Express Backend Setup

Install dependencies:

```bash
npm install express cors
```

---

# Backend Code

```js
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/home", (req, res) => {
  res.status(200).json({
    message: "server is up and running",
    uptime: process.uptime(),
  });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

---

# Understanding the CORS Configuration

## origin

```js
origin: "http://localhost:5173"
```

This means:

```txt
Allow requests from this frontend
```

Important:

This should contain the frontend URL, not backend URL.

---

# Wrong Example

```js
origin: "http://localhost:3000"
```

This is incorrect because backend is allowing itself.

---

# Correct Example

```js
origin: "http://localhost:5173"
```

---

# credentials: true

```js
credentials: true
```

Allows:

- Cookies
- Authentication headers
- Sessions
- Secure credentials

---

# Important Rule

This combination is invalid:

```js
origin: "*"
credentials: true
```

Browser blocks it.

Why?

Because allowing credentials for every origin is insecure.

---

# React Frontend Setup

Install dependencies:

```bash
npm install
```

---

# Frontend Code

```jsx
import { useEffect, useRef, useState } from "react";

function App() {
  const [data, setData] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/home", {
          method: "GET",
        });

        const dataReceived = await response.json();

        setData(JSON.stringify(dataReceived));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();

    intervalRef.current = setInterval(fetchData, 1000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <>
      <h1>React Frontend</h1>
      <p>{data}</p>
    </>
  );
}

export default App;
```

---

# Understanding the React Code

# useEffect

```js
useEffect(() => {}, []);
```

Runs only once when component mounts.

Used for:

- API calls
- subscriptions
- intervals
- side effects

---

# Why [] is Important

Wrong:

```js
useEffect(() => {}, [data]);
```

This recreates intervals every time state changes.

Correct:

```js
useEffect(() => {}, []);
```

Only one interval is created.

---

# useRef

```js
const intervalRef = useRef(null);
```

Used to store mutable values without re-rendering.

In this project it stores:

```txt
Interval ID
```

---

# Why useRef Instead of useState?

## useState

- Causes re-render
- Used for UI updates

---

## useRef

- Does not cause re-render
- Used for mutable values

Examples:

- Interval IDs
- DOM elements
- Timers
- WebSocket connections
- Previous values

---

# Polling APIs

This project fetches backend data every second.

```js
setInterval(fetchData, 1000)
```

This technique is called:

```txt
Polling
```

---

# Why Cleanup is Important

Without cleanup:

- Memory leaks happen
- Multiple intervals continue running
- Performance issues occur

Cleanup:

```js
return () => {
  clearInterval(intervalRef.current);
};
```

---

# Common CORS Errors

# 1. Wrong Origin

Wrong:

```js
origin: "http://localhost:3000"
```

Correct:

```js
origin: "http://localhost:5173"
```

---

# 2. Using credentials with *

Wrong:

```js
origin: "*"
credentials: true
```

Correct:

```js
origin: "http://localhost:5173"
credentials: true
```

---

# 3. Forgetting credentials in frontend

Frontend:

```js
fetch(url, {
  credentials: "include"
})
```

Backend:

```js
credentials: true
```

Both are required together.

---

# 4. Missing OPTIONS Support

Some requests trigger:

```txt
Preflight Request
```

Browser sends:

```txt
OPTIONS request
```

before actual request.

Usually happens with:

- PUT
- DELETE
- PATCH
- Authorization headers
- Custom headers

The `cors` package handles this automatically.

---

# What is Preflight?

Browser asks backend:

```txt
Can I send this request?
```

Backend responds with allowed methods and headers.

Then browser sends actual request.

---

# Request Flow Diagram

```txt
Frontend (5173)
        |
        | fetch request
        v
Browser checks origin
        |
        | different origin
        v
Backend (3000)
        |
        | sends CORS headers
        v
Browser verifies headers
        |
        | allowed
        v
Frontend receives response
```

---

# Project Structure

```txt
project/
│
├── backend/
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   └── App.jsx
│   └── package.json
```

---

# How to Run Backend

```bash
cd backend
npm install
node index.js
```

Server runs on:

```txt
http://localhost:3000
```

---

# How to Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Expected Output

Frontend continuously fetches:

```json
{
  "message": "server is up and running",
  "uptime": 25.635
}
```

and updates every second.

---

# Technologies Used

- React
- Express
- CORS middleware
- Fetch API
- useEffect
- useRef

---

# Key Learnings

This project helped understand:

- Browser security model
- Same origin policy
- Cross-origin communication
- Express CORS configuration
- Credentials handling
- API polling
- React side effects
- Interval cleanup
- Mutable refs

---

# Future Improvements

Possible next steps:

- JWT auth