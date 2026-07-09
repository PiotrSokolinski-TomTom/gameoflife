# Game of life

Conway's game of life implementation in Kotlin, see [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

## Features

- CLI
  - allows user to define start state (size of the board N $\times$ N and its values).
  - allows user to randomize start state
  - interactive - press enter to generate next epoch
- HTML render
  - randomized 16 $\times$ 16 board which plays automatically in the browser, at localhost:8080, one epoch per second.

## How to run?

Backend

```bash
cd backend && mvn install && cd api && mvn spring-boot:run
```

Frontend

```bash
cd frontend && npm i && npm run dev
```
