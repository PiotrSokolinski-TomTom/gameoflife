package com.tomtom.core

import kotlin.collections.indices
import kotlin.random.Random
import kotlin.random.nextUInt

class GameOfLife {
    companion object {
        fun tick(board: Board): Board {
            val alive = board.cells

            val neighbourCounts = HashMap<Position, Int>(alive.size * 2)
            for (cell in alive) {
                for (dx in -1..1) {
                    for (dy in -1..1) {
                        if (dx == 0 && dy == 0) continue
                        val neighbour = Position(cell.x + dx, cell.y + dy)
                        neighbourCounts.merge(neighbour, 1) { acc, _ -> acc + 1 }
                    }
                }
            }

            val next = HashSet<Position>(alive.size)
            for ((cell, aliveNeighbours) in neighbourCounts) {
                /**
                 * less than 2 -> dies of underpopulation (not preserved to next generation)
                 * 2 -> state preserved to next generation
                 * 3 -> force-alive
                 * more than 3 -> dies of overpopulation (not preserved to next generation)
                 */
                if (aliveNeighbours == 3 || (aliveNeighbours == 2 && cell in alive)) {
                    next.add(cell)
                }
            }
            return DefaultBoard(next)
        }

        fun randomBoard(width: Int, height: Int, random: Random = Random.Default): Board {
            val cells = HashSet<Position>()
            for(i in 0 until width) {
                for(j in 0 until height) {
                    when((random.nextUInt() % 2u).toInt()) {
                        1 -> cells.add(Position(i, j))
                    }

                }
            }
            return DefaultBoard(cells)
        }

        fun parseString(string: String): Board {
            val cells = HashSet<Position>()
            for ((i, line) in string.lines().withIndex()) {
                for ((j, cell) in line.withIndex()) {
                    if(cell == '1') {
                        cells.add(Position(i, j))
                    }
                }
            }
            return DefaultBoard(cells)
        }
    }
}