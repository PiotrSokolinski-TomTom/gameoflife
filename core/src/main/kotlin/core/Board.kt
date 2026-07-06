package com.tomtom.core

interface Board {
    var cells: Array<Array<Int>>

    fun tick()
}