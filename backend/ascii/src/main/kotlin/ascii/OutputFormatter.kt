package com.tomtom.ascii

import com.tomtom.core.Board
import com.tomtom.core.Position

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
            for(key in cells) {
                if(key.x < minX) {
                    minX = key.x
                }
                if(key.x > maxX) {
                    maxX = key.x
                }
                if(key.y < minY) {
                    minY = key.y
                }
                if(key.y > maxY) {
                    maxY = key.y
                }
            }
            for (i in minX until maxX) {
                for (j in minY until maxY) {
                    sb.append(if(cells.contains(Position(i,j))) alive else dead)
                    sb.append(' ')
                }
                sb.append('\n')
            }
            return sb.toString()
        }
    }
}