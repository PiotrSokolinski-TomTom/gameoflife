package com.tomtom.api

import com.tomtom.api.api.dto.BoardDto
import com.tomtom.core.GameOfLife
import io.restassured.RestAssured
import io.restassured.RestAssured.get
import io.restassured.RestAssured.given
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class ApiApplicationTests {

	@LocalServerPort
	var port: Int = 0

	@BeforeEach
	fun beforeAll() {
		RestAssured.port = port
	}

	@Test
	fun `random board is created`() {
		val cells: List<Int> = get("/api/board/random?width=10&height=10&seed=2137")
			.then().statusCode(200)
			.extract().path("cells")

		assertTrue(containsCell(cells, 8, 8))
		assertTrue(containsCell(cells, 4, 7))
		assertTrue(containsCell(cells, 1, 9))
	}

	@Test
	fun `next generation test`() {
		val board = GameOfLife.parseString("""
			000000
			001100
			000100
		""".trimIndent())
		val cells: List<Int> = given().contentType("application/json")
			.body(BoardDto.from(board.cells)).post("/api/board/tick")
			.then().statusCode(200)
			.extract().path("cells")

		assertTrue(containsCell(cells, 2, 2))
	}

	private fun containsCell(cells: List<Int>, x: Int, y: Int): Boolean {
		var i = 0
		while (i + 1 < cells.size) {
			if (cells[i] == x && cells[i + 1] == y) return true
			i += 2
		}
		return false
	}
}