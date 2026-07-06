import com.tomtom.core.Board
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import kotlin.random.Random

class BoardTest {

    @Test
    fun `single alive dies`() {
        val board = Board(
            arrayOf(
                arrayOf(0, 0, 0),
                arrayOf(0, 1, 0),
                arrayOf(0, 0, 0)
            )
        )
        board.tick()
        val expected = arrayOf(
            arrayOf(0, 0, 0),
            arrayOf(0, 0, 0),
            arrayOf(0, 0, 0)
        )
        assertTrue(board.cells.contentDeepEquals(expected))
    }

    @Test
    fun `pair alive dies`() {
        val board = Board(
            arrayOf(
                arrayOf(0, 1, 0),
                arrayOf(0, 1, 0),
                arrayOf(0, 0, 0)
            )
        )
        board.tick()
        val expected = arrayOf(
            arrayOf(0, 0, 0),
            arrayOf(0, 0, 0),
            arrayOf(0, 0, 0)
        )
        assertTrue(board.cells.contentDeepEquals(expected))
    }

    @Test
    fun `new cell born`() {
        val board = Board(
            arrayOf(
                arrayOf(0, 1, 1),
                arrayOf(0, 1, 0),
                arrayOf(0, 0, 0)
            )
        )
        board.tick()
        val expected = arrayOf(
            arrayOf(0, 1, 1),
            arrayOf(0, 1, 1),
            arrayOf(0, 0, 0)
        )
        assertTrue(board.cells.contentDeepEquals(expected))
    }

    @Test
    fun `still form of life`() {
        val board = Board(
            arrayOf(
                arrayOf(0, 1, 1),
                arrayOf(0, 1, 1),
                arrayOf(0, 0, 0)
            )
        )
        board.tick()
        val expected = arrayOf(
            arrayOf(0, 1, 1),
            arrayOf(0, 1, 1),
            arrayOf(0, 0, 0)
        )
        assertTrue(board.cells.contentDeepEquals(expected))
        board.tick()
        assertTrue(board.cells.contentDeepEquals(expected))
    }

    @Test
    fun `oscillating form of life`() {
        val state1 = arrayOf(
            arrayOf(0, 1, 0),
            arrayOf(0, 1, 0),
            arrayOf(0, 1, 0)
        )
        val state2 = arrayOf(
            arrayOf(0, 0, 0),
            arrayOf(1, 1, 1),
            arrayOf(0, 0, 0)
        )
        val board = Board(state1)
        board.tick()
        assertTrue(board.cells.contentDeepEquals(state2))
        board.tick()
        assertTrue(board.cells.contentDeepEquals(state1))
    }

    @Test
    fun `randomize board`() {
        val board = Board()
        board.randomizeBoard()
        val state1 = board.cells.map { it.clone() }.toTypedArray()
        board.randomizeBoard()
        val state2 = board.cells.map { it.clone() }.toTypedArray()
        assertFalse(state1.contentDeepEquals(state2))
    }

    @Test
    fun `seeded random board`() {
        val random = Random(2137)
        val initial = arrayOf(
            arrayOf(0, 0, 0),
            arrayOf(0, 0, 0),
            arrayOf(0, 0, 0)
        )
        val board = Board(random, initial)
        val expected = arrayOf(
            arrayOf(0, 0, 1),
            arrayOf(1, 0, 1),
            arrayOf(0, 0, 0)
        )
        board.randomizeBoard()
        assertTrue(board.cells.contentDeepEquals(expected))
    }
}