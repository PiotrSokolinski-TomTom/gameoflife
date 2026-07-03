package com.tomtom

class Board(
    var cells: Array<Array<Boolean>> = Array(16) { Array(16) {false} }
) {

    private fun countAliveNeighbours(x: Int, y: Int): Int {
        var count = 0
        for (dx in -1..1) {
            for (dy in -1..1) {
                if (dx == 0 && dy == 0) continue
                val nx = x + dx
                val ny = y + dy
                if (nx in cells.indices && ny in cells[0].indices && cells[nx][ny]) {
                    count++
                }
            }
        }
        return count
    }

    fun tick() {
        val next = Array(cells.size) { Array(cells[0].size) {false} }
        for (x in cells.indices) {
            for (y in cells[x].indices) {
                val neighbours = countAliveNeighbours(x, y)
                next[x][y] = when {
                    cells[x][y] && neighbours == 2 -> true
                    neighbours == 3 -> true
                    else -> false
                }
            }
        }
        cells = next
    }

    override fun toString(): String =
        buildString {
            for (row in cells) {
                for (cell in row) {
                    append(if (cell) "1 " else "0 ")
                }
                appendLine()
            }
        }
}