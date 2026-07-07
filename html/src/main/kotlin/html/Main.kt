package com.tomtom.html

import com.tomtom.core.DefaultBoard
import com.tomtom.core.GameOfLife
import com.tomtom.html.HtmlRenderer.Companion.buildHTML
import io.ktor.http.ContentType
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    var board = GameOfLife.randomBoard(160, 90)

    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                board = GameOfLife.tick(board)

                call.respondText(
                    buildHTML(board),
                    ContentType.Text.Html
                )
            }
        }
    }.start(wait = true)
}