package com.tomtom.core

import com.tomtom.core.Board
import com.tomtom.core.GameOfLife
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import kotlin.random.Random

class DefaultBoardTest {

    private fun assertRule(initial: Board, expected: Board) {
        val result = GameOfLife.tick(initial)
        print(initial.cells)
        print(result.cells)
        assertTrue(result.cells == expected.cells)
    }

    @Test
    fun `single alive dies`() {
        val initial = GameOfLife.parseString("""
            000
            010
            000
        """.trimIndent())
        val expected = GameOfLife.parseString("""
            000
            000
            000
        """.trimIndent())
        assertRule(initial, expected)
    }

    @Test
    fun `pair alive dies`() {
        val initial = GameOfLife.parseString("""
            010
            010
            000
        """.trimIndent())
        val expected = GameOfLife.parseString("""
            000
            000
            000
        """.trimIndent())
        assertRule(initial, expected)
    }

    @Test
    fun `new cell born`() {
        val initial = GameOfLife.parseString("""
            011
            010
            000
        """.trimIndent())
        val expected = GameOfLife.parseString("""
            011
            011
            000
        """.trimIndent())
        assertRule(initial, expected)
        assertRule(initial, expected)
    }

    @Test
    fun `still form of life`() {
        val initial = GameOfLife.parseString("""
            011
            011
            000
        """.trimIndent())
        val expected = GameOfLife.parseString("""
            011
            011
            000
        """.trimIndent())
        assertRule(initial, expected)
        val next = GameOfLife.tick(initial)
        assertTrue(next.cells == expected.cells)
    }

    @Test
    fun `oscillating form of life`() {
        val state1 = GameOfLife.parseString("""
            010
            010
            010
        """.trimIndent())
        val state2 = GameOfLife.parseString("""
            000
            111
            000
        """.trimIndent())
        val res1 = GameOfLife.tick(state1)
        assertTrue(res1.cells == state2.cells)
        val res2 = GameOfLife.tick(res1)
        assertTrue(res2.cells == state1.cells)
    }

    @Test
    fun `seeded random board`() {
        val randomizedBoard = GameOfLife.randomBoard(3, 3, Random(2137))
        val expected = GameOfLife.parseString("""
            001
            101
            000
        """.trimIndent())
        assertTrue(randomizedBoard.cells == expected.cells)
    }
}