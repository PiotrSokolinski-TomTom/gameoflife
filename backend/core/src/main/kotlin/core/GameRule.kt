package com.tomtom.core

data class GameRule(val keep: Set<Int>, val change: Map<Int, CellState>)