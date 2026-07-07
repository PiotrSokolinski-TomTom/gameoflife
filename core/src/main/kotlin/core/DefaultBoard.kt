package com.tomtom.core

class DefaultBoard(
    override val cells: Array<IntArray> = Array(16) { IntArray(16) {0} }
): Board {

    override fun countAliveNeighbours(x: Int, y: Int): Int {
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