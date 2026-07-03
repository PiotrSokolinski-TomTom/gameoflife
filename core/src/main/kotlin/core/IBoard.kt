package com.tomtom.core

interface IBoard {
    var cells: Array<Array<Int>>

    fun tick()
}