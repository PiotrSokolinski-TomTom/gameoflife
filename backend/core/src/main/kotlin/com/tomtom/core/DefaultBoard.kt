package com.tomtom.core

data class DefaultBoard(
    override val cells: Set<Position>
) : Board
