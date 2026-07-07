package com.tomtom.core

import kotlin.collections.indices
import kotlin.random.Random
import kotlin.random.nextUInt

class GameOfLife {
    companion object {
        fun tick(board: Board): Board {
            val next = Array(board.cells.size) { IntArray(board.cells[0].size) {0} }
            for (x in board.cells.indices) {
                for (y in board.cells[x].indices) {
                    val neighbours = board.countAliveNeighbours(x, y)
                    next[x][y] = when (neighbours) {
                        2 -> board.cells[x][y]
                        3 -> 1
                        else -> 0
                    }
                }
            }
            return DefaultBoard(next)
        }

        fun randomBoard(width: Int, height: Int, random: Random = Random.Default): Board {
            return DefaultBoard(Array(width) {
                IntArray(height) {
                    (random.nextUInt() % 2u).toInt()
                }
            })
        }
    }
}