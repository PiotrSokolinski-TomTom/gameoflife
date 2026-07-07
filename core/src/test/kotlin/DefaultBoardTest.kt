import com.tomtom.core.DefaultBoard
import com.tomtom.core.GameOfLife
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import kotlin.random.Random

class DefaultBoardTest {

    private fun assertRule(initial: Array<IntArray>, expected: Array<IntArray>) {
        val board = DefaultBoard(initial)
        val result = GameOfLife.tick(board)
        assertTrue(result.cells.contentDeepEquals(expected))
    }

    @Test
    fun `single alive dies`() {
        val initial = arrayOf(
                intArrayOf(0, 0, 0),
                intArrayOf(0, 1, 0),
                intArrayOf(0, 0, 0)
            )
        val expected = arrayOf(
            intArrayOf(0, 0, 0),
            intArrayOf(0, 0, 0),
            intArrayOf(0, 0, 0)
        )
        assertRule(initial, expected)
    }

    @Test
    fun `pair alive dies`() {
        val initial = arrayOf(
            intArrayOf(0, 1, 0),
            intArrayOf(0, 1, 0),
            intArrayOf(0, 0, 0)
        )
        val expected = arrayOf(
            intArrayOf(0, 0, 0),
            intArrayOf(0, 0, 0),
            intArrayOf(0, 0, 0)
        )
        assertRule(initial, expected)
    }

    @Test
    fun `new cell born`() {
        val initial = arrayOf(
            intArrayOf(0, 1, 1),
            intArrayOf(0, 1, 0),
            intArrayOf(0, 0, 0)
        )
        val expected = arrayOf(
            intArrayOf(0, 1, 1),
            intArrayOf(0, 1, 1),
            intArrayOf(0, 0, 0)
        )
        assertRule(initial, expected)
    }

    @Test
    fun `still form of life`() {
        val board = DefaultBoard(
            arrayOf(
                intArrayOf(0, 1, 1),
                intArrayOf(0, 1, 1),
                intArrayOf(0, 0, 0)
            )
        )
        val res1 = GameOfLife.tick(board)
        val expected = arrayOf(
            intArrayOf(0, 1, 1),
            intArrayOf(0, 1, 1),
            intArrayOf(0, 0, 0)
        )
        assertTrue(res1.cells.contentDeepEquals(expected))
        val res2 = GameOfLife.tick(res1)
        assertTrue(res2.cells.contentDeepEquals(expected))
    }

    @Test
    fun `oscillating form of life`() {
        val state1 = arrayOf(
            intArrayOf(0, 1, 0),
            intArrayOf(0, 1, 0),
            intArrayOf(0, 1, 0)
        )
        val state2 = arrayOf(
            intArrayOf(0, 0, 0),
            intArrayOf(1, 1, 1),
            intArrayOf(0, 0, 0)
        )
        val board = DefaultBoard(state1)
        val res1 = GameOfLife.tick(board)
        assertTrue(res1.cells.contentDeepEquals(state2))
        val res2 = GameOfLife.tick(res1)
        assertTrue(res2.cells.contentDeepEquals(state1))
    }

    @Test
    fun `seeded random board`() {
        val randomizedBoard = GameOfLife.randomBoard(3, 3, Random(2137))
        val expected = arrayOf(
            intArrayOf(0, 0, 1),
            intArrayOf(1, 0, 1),
            intArrayOf(0, 0, 0)
        )
        assertTrue(randomizedBoard.cells.contentDeepEquals(expected))
    }
}