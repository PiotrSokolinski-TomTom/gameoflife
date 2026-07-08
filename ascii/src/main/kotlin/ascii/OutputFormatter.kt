package com.tomtom.ascii

import com.tomtom.core.Board
import com.tomtom.core.CellState

class OutputFormatter {
    companion object {
        fun simple(board: Board): String {
            return custom(board, '1', '0')
        }

        fun custom(board: Board, alive: Char, dead: Char): String {
            val sb = StringBuilder()
            val cells = board.cells
            var minX = Int.MAX_VALUE
            var maxX = 0
            var minY = Int.MAX_VALUE
            var maxY = 0
            for(key in cells.keys) {
                if(key.first < minX) {
                    minX = key.first
                }
                if(key.first > maxX) {
                    maxX = key.first
                }
                if(key.second < minY) {
                    minY = key.second
                }
                if(key.second > maxY) {
                    maxY = key.second
                }
            }
            for (i in minX until maxX) {
                for (j in minY until maxY) {
                    sb.append(if(cells.getOrDefault(Pair(i,j), CellState.ALIVE) == CellState.ALIVE) alive else dead)
                    sb.append(' ')
                }
                sb.append('\n')
            }
            return sb.toString()
        }
    }
}