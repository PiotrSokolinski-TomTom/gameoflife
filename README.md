# Game of life

Conway's game of life implementation in Kotlin, see [Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

## Features
- CLI
  - allows user to define start state (size of the board N $\times$ N and its values).
  - allows user to randomize start state
  - interactive - press enter to generate next epoch
- HTML render
  - randomized 16 $\times$ 16 board which plays automatically in the browser, at localhost:8080, one epoch per second.

## Planned next
- API via Springboot
  - initial state, randomization, control over display speed, endless canvas
- Reactive frontend via React
  - freely drawing initial state
  - adding stylesheets to make the app "prettier"
- Complex features
  - drawing using predefined shapes
  - additional cell states and their custom logic
  - optimization