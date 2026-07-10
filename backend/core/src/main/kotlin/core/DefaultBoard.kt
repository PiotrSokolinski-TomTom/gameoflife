package com.tomtom.core

class DefaultBoard(
    override val cells: Map<Pair<Int, Int>, CellState> = HashMap(),
    override val gameRules: Set<GameRule>
            = HashSet(setOf(GameRule(setOf(2,3), hashMapOf(Pair(3, CellState.ALIVE))))),
): Board {

    override fun countAliveNeighbours(x: Int, y: Int): Int {
        var count = 0
        for (dx in -1..1) {
            for (dy in -1..1) {
                if (dx == 0 && dy == 0) continue
                val nx = x + dx
                val ny = y + dy
                if(cells.containsKey(Pair(nx, ny))) {
                    when(cells.getValue(Pair(nx, ny))) {
                        CellState.ALIVE -> count++
                        else -> {}
                    }
                }
            }
        }
        return count
    }

    override fun deadNeighbours(x: Int, y: Int): Set<Pair<Int, Int>> {
        val neighbours = HashSet<Pair<Int, Int>>()
        for (dx in -1..1) {
            for (dy in -1..1) {
                val nx = x + dx
                val ny = y + dy
                if(!cells.containsKey(Pair(nx, ny))) {
                    neighbours.add(Pair(nx, ny))
                }
            }
        }
        return neighbours
    }
}