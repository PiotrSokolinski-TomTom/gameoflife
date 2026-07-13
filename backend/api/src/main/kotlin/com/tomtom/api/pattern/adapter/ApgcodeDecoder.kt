package com.tomtom.api.pattern.adapter

import com.tomtom.api.pattern.core.PatternKind
import com.tomtom.core.Position

/**
 * Decodes a Catagolue apgcode into our domain cell set.
 *
 * apgcode = "<prefix>_<code>", e.g. "xq4_153". The prefix encodes the object class
 * (xs = still life, xp = oscillator, xq = spaceship). The part after '_' is the
 * "extended Wechsler format":
 *
 *  - The plane is split into horizontal strips 5 cells tall, read left to right.
 *  - A base-32 digit (0-9, a-v) is one column of the current strip: bit r (0 = top)
 *    set means a live cell at (x, stripBase + r). After it, x advances by one.
 *  - 'w' = 2 blank columns, 'x' = 3 blank columns.
 *  - 'y' followed by one base-36 digit c = (c + 4) blank columns.
 *  - 'z' = end of the current strip: reset x to 0 and move down 5 rows.
 *
 * The decoded cells are normalised so the bounding-box top-left is (0, 0).
 *
 * See https://conwaylife.com/wiki/Apgcode
 */
object ApgcodeDecoder {

    data class DecodedPattern(
        val cells: Set<Position>,
        val width: Int,
        val height: Int,
        val kind: PatternKind,
    )

    fun decode(apgcode: String): DecodedPattern {
        val underscoreIndex = apgcode.indexOf('_')
        if(underscoreIndex == -1) {
            throw RuntimeException("apgcode decoded to no cells: $apgcode")
        }

        val prefix = apgcode.substring(0, underscoreIndex)
        val kind = when {
            prefix.startsWith("xs") -> PatternKind.STILL_LIFE
            prefix.startsWith("xp") -> PatternKind.OSCILLATOR
            prefix.startsWith("xq") -> PatternKind.SPACESHIP
            prefix.startsWith("yl") -> PatternKind.LINEAR_GROWTH
            prefix.startsWith("zz") -> PatternKind.UNUSUAL_GROWTH
            prefix.startsWith("me") -> PatternKind.LONG_LIVED_PATTERNS
            else -> PatternKind.UNKNOWN
        }

        val raw = decodeCells(apgcode.substring(underscoreIndex + 1), apgcode)
        if(raw.isEmpty()) {
            throw RuntimeException("apgcode decoded to no cells: $apgcode")
        }

        val minX = raw.minOf{it.x}
        val minY = raw.minOf{it.y}
        val cells = raw.mapTo(HashSet(raw.size)){Position(it.x - minX, it.y - minY)}
        val width = raw.maxOf{it.x} - minX + 1
        val height = raw.maxOf{it.y} - minY + 1

        return DecodedPattern(cells, width, height, kind)
    }

    private fun decodeCells(code: String, apgcode: String): Set<Position> {
        val cells = HashSet<Position>()
        var x = 0
        var stripBase = 0
        var i = 0
        while (i < code.length) {
            when (val c = code[i]) {
                'z' -> {
                    stripBase += 5
                    x = 0
                }
                'w' -> x += 2
                'x' -> x += 3
                'y' -> {
                    require(i + 1 < code.length) { "dangling 'y' run in apgcode: $apgcode" }
                    x += base36(code[++i], apgcode) + 4
                }
                else -> {
                    val value = base36(c, apgcode)
                    require(value in 0..31) { "invalid column digit '$c' in apgcode: $apgcode" }
                    for (r in 0 until 5) {
                        if ((value shr r) and 1 == 1) {
                            cells.add(Position(x, stripBase + r))
                        }
                    }
                    x += 1
                }
            }
            i++
        }
        return cells
    }

    private fun base36(c: Char, apgcode: String): Int = when (c) {
        in '0'..'9' -> c - '0'
        in 'a'..'z' -> c - 'a' + 10
        else -> throw IllegalArgumentException("invalid apgcode digit '$c' in $apgcode")
    }
}
