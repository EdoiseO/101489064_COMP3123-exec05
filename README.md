# COMP3123 - Lab Exercise 5

Phillip Onofua - 101489064

## Run the exercise

```bash
npm install
npm start
```

Open `http://localhost:8081/home`. The provided sample login is username
`bret` and password `bret@123`. No React, Next.js or Supabase packages are needed.

`npm run dev` runs the exercise with the already-configured nodemon.
`npm test` runs the HTTP route tests using Node's built-in test runner.
To choose a different port on macOS/Linux, run `port=8082 npm start`.

## Exercise endpoints

| Method | URL | Result |
| --- | --- | --- |
| GET | `/home` | Welcome page and plain HTML login form |
| GET | `/api/v1/user/profile` | Complete sample `user.json` |
| POST | `/api/v1/user/login` | JSON username/password validation |
| GET | `/api/v1/user/logout?username=bret` | Bold logout message |
| GET | `/api/v1/user/logout/bret` | Equivalent path-parameter logout |

Send the login request as raw JSON with `Content-Type: application/json`:

```json
{ "username": "bret", "password": "bret@123" }
```

Invalid usernames and passwords return the exact messages specified in the
exercise. Errors passed to the four-argument middleware return HTTP 500 with
`Server Error`. Malformed JSON is one reproducible error-handling test.

## In-class logging walkthrough

The separate in-class walkthrough remains in `server.js`, `Books.js` and
`Computers.js`. Run `npm run start:lab` for that server on port 8080. Its source
is separate from the user-API exercise and has not been replaced.

## Submission materials

The exercise ZIP excludes `node_modules`, generated logs and Q&A material.
Reusable requests are in `exercise5.postman_collection.json`, and genuine
screenshots are in `evidence/`. This README is the only Markdown file included.

- `evidence/2026-10-08-exercise-postman/`: seven Postman captures showing valid
  login, invalid username/password, logout, HTTP 500, and overlapping upper/lower
  views of the complete profile response.
- `evidence/2026-10-07-postman/`: four Postman captures of the separate
  books/computers logging walkthrough.

The native Postman captures retain their original filenames and bytes. Their
`.png` filenames contain JPEG image data; no screenshot content was changed.
The separate submission screenshot PDF includes these captures, the browser
login/logout evidence, and the genuine signed-in MongoDB Atlas overview.
The local sample login is not Atlas evidence.
