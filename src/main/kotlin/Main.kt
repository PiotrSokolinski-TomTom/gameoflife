package com.tomtom

fun main() {
    val cells: Array<Array<Int>> = arrayOf(
        arrayOf(0, 1, 1),
        arrayOf(0, 0, 1),
        arrayOf(0, 0, 1),
    )
    val board = Board(cells)
    for(i in 0..10) {
        println(board.toString())
        board.tick()
    }
}