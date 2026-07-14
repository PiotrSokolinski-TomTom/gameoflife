package com.tomtom.ascii

import com.tomtom.core.DefaultBoard
import com.tomtom.core.Board
import com.tomtom.core.GameOfLife
import com.tomtom.core.Position
import java.util.Scanner

class CLI {
    companion object {
        fun handleInput(): Board {
            val scanner = Scanner(System.`in`)
            println("Size [1; 1000]:")
            val size = scanner.nextInt()
            if (size !in 1..1000) {
                throw IllegalArgumentException("Invalid size")
            }
            println("Randomize? [y/N]")
            if(scanner.next() == "y") {
                return GameOfLife.randomBoard(size, size)
            }
            println("Board {0, 1}:")
            val cells = HashSet<Position>()
            for(i in 0..<size) {
                for(j in 0..<size) {
                    val state = scanner.nextInt()
                    if(state == 1) {
                        cells.add(Position(i, j))
                    } else {
                        throw IllegalArgumentException("Invalid state")
                    }
                }
            }
            return DefaultBoard(cells)
        }
    }

}

