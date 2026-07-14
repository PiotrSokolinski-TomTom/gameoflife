package com.tomtom.api.dto

import com.tomtom.api.pattern.core.Pattern
import kotlinx.serialization.Serializable

@Serializable
class PatternDto(
    val apgcode: String,
    val name: String?,
    val occurrences: String,
    val kind: String,
    val cells: IntArray,
    val width: Int,
    val height: Int,
) {
    companion object {
        fun from(pattern: Pattern): PatternDto {
            val flat = IntArray(pattern.cells.size * 2)
            var i = 0
            for (cell in pattern.cells) {
                flat[i++] = cell.x
                flat[i++] = cell.y
            }
            return PatternDto(
                apgcode = pattern.apgcode,
                name = pattern.name,
                occurrences = pattern.occurrences.toString(),
                kind = pattern.kind.name,
                cells = flat,
                width = pattern.width,
                height = pattern.height,
            )
        }
    }
}