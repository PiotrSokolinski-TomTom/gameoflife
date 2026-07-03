package com.tomtom.ascii

import java.util.Scanner

fun main() {
    val board = CLI.handleInput()
    println(OutputFormatter.custom(board, 'O', 'X'))
    val scanner = Scanner(System.`in`)
    while(true) {
        scanner.nextLine()
        board.tick()
        println(OutputFormatter.custom(board, 'O', 'X'))
    }
}