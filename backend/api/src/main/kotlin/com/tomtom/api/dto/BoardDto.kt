package com.tomtom.api.dto

import com.tomtom.core.Position
import kotlinx.serialization.Serializable

@Serializable
class BoardDto(val cells: IntArray) {

    fun toPositions(): Set<Position> {
        val result = HashSet<Position>(cells.size / 2 + 1)
        var i = 0
        while (i + 1 < cells.size) {
            result.add(Position(cells[i], cells[i + 1]))
            i += 2
        }
        return result
    }

    companion object {
        fun from(cells: Set<Position>): BoardDto {
            val flat = IntArray(cells.size * 2)
            var i = 0
            for (cell in cells) {
                flat[i++] = cell.x
                flat[i++] = cell.y
            }
            return BoardDto(flat)
        }
    }
}
