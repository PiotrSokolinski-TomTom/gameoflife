package com.tomtom.core

import kotlin.random.Random
import kotlin.random.nextUInt

class DefaultBoard(
    override var cells: Array<Array<Int>> = Array(16) { Array(16) {0} }
): Board {
    constructor(random: Random, cells: Array<Array<Int>>): this(cells) {
        this.random = random
    }

    var random: Random = Random.Default

    override fun tick() {
        val next = Array(cells.size) { Array(cells[0].size) {0} }
        for (x in cells.indices) {
            for (y in cells[x].indices) {
                val neighbours = countAliveNeighbours(x, y)
                next[x][y] = when (neighbours) {
                    2 -> cells[x][y]
                    3 -> 1
                    else -> 0
                }
            }
        }
        cells = next
    }

    fun randomizeBoard() {
        for (x in cells.indices) {
            for (y in cells[x].indices) {
                cells[x][y] = (random.nextUInt() % 2u).toInt()
            }
        }
    }

    private fun countAliveNeighbours(x: Int, y: Int): Int {
        var count = 0
        for (dx in -1..1) {
            for (dy in -1..1) {
                if (dx == 0 && dy == 0) continue
                val nx = x + dx
                val ny = y + dy
                if (nx in cells.indices && ny in cells[0].indices && cells[nx][ny] == 1) {
                    count++
                }
            }
        }
        return count
    }
}