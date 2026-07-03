package com.tomtom

fun main() {
    val cells: Array<Array<Boolean>> = Array(16){Array(16){false}}
    cells[3][4] = true
    cells[4][4] = true
    cells[4][5] = true
    cells[4][6] = true
    val board = Board(cells)
    for(i in 0..10) {
        println(board.toString())
        board.tick()
    }
}