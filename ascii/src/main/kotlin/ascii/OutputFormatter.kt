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
            var minWidth = Int.MAX_VALUE
            var maxWidth = 0
            var minHeight = Int.MAX_VALUE
            var maxHeight = 0
            for(key in cells.keys) {
                if(key.first < minWidth) {
                    minWidth = key.first
                }
                if(key.first > maxWidth) {
                    maxWidth = key.first
                }
                if(key.second < minHeight) {
                    minHeight = key.second
                }
                if(key.second > maxHeight) {
                    maxHeight = key.second
                }
            }
            for (i in minWidth until maxWidth) {
                for (j in minHeight until maxHeight) {
                    sb.append(if(cells.getOrDefault(Pair(i,j), CellState.ALIVE) == CellState.ALIVE) alive else dead)
                    sb.append(' ')
                }
                sb.append('\n')
            }
            return sb.toString()
        }
    }
}