package com.tomtom.ascii

import com.tomtom.core.Board
import com.tomtom.core.IBoard
import java.util.Scanner

class CLI {
    companion object {
        fun handleInput(): IBoard {
            val scanner = Scanner(System.`in`)
            println("Size [1; 1000]:")
            val size = scanner.nextInt()
            if (size !in 1..1000) {
                throw IllegalArgumentException("Invalid size")
            }
            println("Randomize? [y/N]")
            if(scanner.next() == "y") {
                val board = Board(Array(size) { Array(size) { 0 } })
                board.randomizeBoard()
                return board
            }
            println("Board {0, 1}:")
            val cells = Array(size) { Array(size) { 0 } }
            for(i in 0..<size) {
                for(j in 0..<size) {
                    val state = scanner.nextInt()
                    if(state == 0 || state == 1) {
                        cells[i][j] = state
                    } else {
                        throw IllegalArgumentException("Invalid state")
                    }
                }
            }
            return Board(cells)
        }
    }

}

