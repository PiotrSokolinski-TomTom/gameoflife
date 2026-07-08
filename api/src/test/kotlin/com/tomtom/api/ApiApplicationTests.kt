package com.tomtom.api

import com.tomtom.api.api.dto.BoardDto
import com.tomtom.core.CellState
import com.tomtom.core.GameOfLife
import io.restassured.RestAssured
import io.restassured.RestAssured.get
import io.restassured.RestAssured.given
import org.hamcrest.CoreMatchers.equalTo
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import tools.jackson.databind.ObjectMapper

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
		get("/api/board/random?width=10&height=10&seed=2137").then().statusCode(200)
			.body("cells.'(8, 8)'", equalTo("ALIVE"))
			.body("cells.'(4, 7)'", equalTo("ALIVE"))
			.body("cells.'(1, 9)'", equalTo("ALIVE"))
	}

	@Test
	fun `next generation test`() {
		val mapper = ObjectMapper()

		val board = GameOfLife.parseString("""
			000000
			001100
			000100
		""".trimIndent())
		val payload = HashMap<Pair<Int, Int>, CellState>()
		for (cell in board.cells) {
            payload[Pair(cell.key.first, cell.key.second)] = cell.value
        }
		given().contentType("application/json")
			.body(BoardDto(payload)).post("/api/board/tick")
			.then().statusCode(200)
		.body("cells.'(2, 2)'", equalTo("ALIVE"))
	}
}