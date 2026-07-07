package com.tomtom.core

interface Board {
    val cells: Map<Pair<Int, Int>, CellState>

    fun countAliveNeighbours(x: Int, y: Int): Int

    fun deadNeighbours(x: Int, y: Int): Set<Pair<Int, Int>>
}