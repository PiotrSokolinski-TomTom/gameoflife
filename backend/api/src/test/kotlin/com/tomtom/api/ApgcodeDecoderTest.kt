package com.tomtom.api

import com.tomtom.api.pattern.adapter.ApgcodeDecoder
import com.tomtom.api.pattern.core.PatternKind
import com.tomtom.core.Position
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class ApgcodeDecoderTest {

    @Test
    fun `xs4_33 decodes to a 2x2 block`() {
        val result = ApgcodeDecoder.decode("xs4_33")
        assertEquals(PatternKind.STILL_LIFE, result.kind)
        assertEquals(2, result.width)
        assertEquals(2, result.height)
        assertEquals(
            setOf(Position(0, 0), Position(1, 0), Position(0, 1), Position(1, 1)),
            result.cells,
        )
    }

    @Test
    fun `xp2_7 decodes to a vertical blinker`() {
        val result = ApgcodeDecoder.decode("xp2_7")
        assertEquals(PatternKind.OSCILLATOR, result.kind)
        assertEquals(1, result.width)
        assertEquals(3, result.height)
        assertEquals(
            setOf(Position(0, 0), Position(0, 1), Position(0, 2)),
            result.cells,
        )
    }

    @Test
    fun `xq4_153 decodes to a glider`() {
        val result = ApgcodeDecoder.decode("xq4_153")
        assertEquals(PatternKind.SPACESHIP, result.kind)
        assertEquals(3, result.width)
        assertEquals(3, result.height)
        assertEquals(
            setOf(
                Position(0, 0),
                Position(1, 0),
                Position(2, 0),
                Position(2, 1),
                Position(1, 2),
            ),
            result.cells,
        )
    }

    @Test
    fun `z separator advances to the next 5-row strip`() {
        val result = ApgcodeDecoder.decode("xp2_1z1")
        assertEquals(
            setOf(Position(0, 0), Position(0, 5)),
            result.cells,
        )
        assertEquals(1, result.width)
        assertEquals(6, result.height)
    }
}
