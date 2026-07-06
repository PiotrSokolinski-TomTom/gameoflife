package com.tomtom.ascii

import com.tomtom.core.Board

class OutputFormatter {
    companion object {
        fun simple(board: Board): String {
            return custom(board, '1', '0')
        }

        fun custom(board: Board, alive: Char, dead: Char): String {
            val sb = StringBuilder()
            val cells = board.cells
            for (row in cells) {
                for (cell in row) {
                    sb.append(if(cell == 1) alive else dead)
                    sb.append(' ')
                }
                sb.append('\n')
            }
            return sb.toString()
        }
    }
}