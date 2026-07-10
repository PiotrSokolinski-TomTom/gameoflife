# Game of life

Conway's game of life implementation in Kotlin, see [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

## Features

- CLI
  - allows user to define start state (size of the board N $\times$ N and its values).
  - allows user to randomize start state
  - interactive - press enter to generate next epoch
- HTML render
  - randomized 16 $\times$ 16 board which plays automatically in the browser, at localhost:8080, one epoch per second.
- API
  - random board at `/api/board` accepts params `width`, `height`, `seed`. All params are optional with defaults: `8`, `8`, `Random.Default`.
  - intergration tests for all endpoints
- React frontend
  - panning (click and drag)
  - zooming (scroll up and down)
  - shuffling the board (via search params and text fields)
  - simulation speed slider (0 to 60 fps)
  - click-to-convert cell

## Installation and running

In both cases navigate to repository root first.

Backend

```bash
cd backend && mvn install && mvn -pl api spring-boot:run
```

Frontend

```bash
cd frontend && npm i && npm run dev
```
