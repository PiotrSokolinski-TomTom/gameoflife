package com.tomtom.html

import com.tomtom.core.GameOfLife
import com.tomtom.html.HtmlRenderer.Companion.buildHTML
import io.ktor.http.ContentType
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    val width = 160
    val height = 90
    var board = GameOfLife.parseString(
        """
            0100000000
            0010000000
            1110000000
            0000000000
            0000000000
            0000000000
            0000000000
            0000000000
            0000000000
            0000000000
        """.trimIndent()
    )

    embeddedServer(Netty, port = 8081) {
        routing {
            get("/") {
                board = GameOfLife.tick(board)

                call.respondText(
                    buildHTML(width, height, board),
                    ContentType.Text.Html
                )
            }
        }
    }.start(wait = true)
}