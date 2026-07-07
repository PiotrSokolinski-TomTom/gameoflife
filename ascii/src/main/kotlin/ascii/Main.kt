package com.tomtom.ascii

import com.tomtom.core.GameOfLife
import java.util.Scanner

fun main() {
    var board = CLI.handleInput()
    println(OutputFormatter.simple(board))
    val scanner = Scanner(System.`in`)
    while(true) {
        scanner.nextLine()
        board = GameOfLife.tick(board)
        println(OutputFormatter.simple(board))
    }
}