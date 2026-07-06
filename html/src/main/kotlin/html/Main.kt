package com.tomtom.html

import com.tomtom.core.DefaultBoard
import com.tomtom.html.HtmlRenderer.Companion.buildHTML
import io.ktor.http.ContentType
import io.ktor.server.engine.*
import io.ktor.server.netty.*
import io.ktor.server.response.*
import io.ktor.server.routing.*

fun main() {
    val board = DefaultBoard()
    board.randomizeBoard()

    embeddedServer(Netty, port = 8080) {
        routing {
            get("/") {
                board.tick()

                call.respondText(
                    buildHTML(board),
                    ContentType.Text.Html
                )
            }
        }
    }.start(wait = true)
}