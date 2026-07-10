package com.tomtom.core

import kotlin.collections.indices
import kotlin.random.Random
import kotlin.random.nextUInt

class GameOfLife {
    companion object {
        fun tick(board: Board): Board {
            val next = HashMap<Pair<Int, Int>, CellState>()
            val cellsToCompute = HashSet<Pair<Int, Int>>()
            cellsToCompute.addAll(board.cells.keys)
            /**
             * silently drops duplicates too
             */
            for(cell in board.cells) {
                cellsToCompute.addAll(board.deadNeighbours(cell.key.first, cell.key.second))
            }

            for (cell in cellsToCompute) {
                val aliveCount = board.countAliveNeighbours(cell.first, cell.second)
                val current = board.cells[Pair(cell.first, cell.second)] ?: CellState.DEAD
                /**
                 * less than 2 -> dies of underpopulation (not preserved to next generation)
                 * 2 -> state preserved to next generation
                 * 3 -> force-alive
                 * more than 3 -> dies of overpopulation (not preserved to next generation)
                    if(aliveCount == 2 && board.cells[cell] == CellState.ALIVE || aliveCount == 3) {
                        next[Pair(cell.first, cell.second)] = CellState.ALIVE
                    }
                 */
                for (rule in board.gameRules) {
                    val newState = when {
                        rule.change.containsKey(aliveCount) -> rule.change.getValue(aliveCount)
                        rule.keep.contains(aliveCount) -> current
                        else -> continue
                    }
                    if (newState == CellState.ALIVE) next[Pair(cell.first, cell.second)] = CellState.ALIVE
                }
            }
            return DefaultBoard(next)
        }

        fun randomBoard(width: Int, height: Int, random: Random = Random.Default): Board {
            val cells = HashMap<Pair<Int, Int>, CellState>()
            for(i in 0 until width) {
                for(j in 0 until height) {
                    when((random.nextUInt() % 2u).toInt()) {
                        1 -> cells[Pair(i, j)] = CellState.ALIVE
                    }

                }
            }
            return DefaultBoard(cells)
        }

        fun parseString(string: String): Board {
            val cells = HashMap<Pair<Int, Int>, CellState>()
            for ((i, line) in string.lines().withIndex()) {
                for ((j, cell) in line.withIndex()) {
                    if(cell == '1') {
                        cells[Pair(i, j)] = CellState.ALIVE
                    }
                }
            }
            return DefaultBoard(cells)
        }
    }
}