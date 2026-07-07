package com.tomtom.core

interface Board {
    val cells: Array<IntArray>

    fun countAliveNeighbours(x: Int, y: Int): Int
}