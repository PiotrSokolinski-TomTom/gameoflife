package com.tomtom.html

import com.tomtom.core.Board
import kotlinx.html.body
import kotlinx.html.head
import kotlinx.html.html
import kotlinx.html.stream.createHTML
import kotlinx.html.style
import kotlinx.html.table
import kotlinx.html.td
import kotlinx.html.title
import kotlinx.html.tr
import kotlinx.html.div
import kotlinx.html.meta

class HtmlRenderer {
    companion object {
        fun buildHTML(board: Board): String {
            return createHTML().html {
                head {
                    title { +"Game of life" }
                    meta {
                        httpEquiv = "refresh"
                        content = "1"
                    }
                }
                body {
                    div {
                        style = "padding: 0px; margin: 0px; display: flex; justify-content: center; align-items: center; height: 100%"
                        table {
                            style = "border-collapse: collapse; table-layout: fixed; border-spacing: 0px"
                            for (i in board.cells[0].indices) {
                                tr {
                                    for (j in board.cells.indices) {
                                        td {
                                            style =
                                                "width:10px;height:10px;box-sizing:border-box;padding:0;margin:0;line-height:0;font-size:0;border:1px solid black;" +
                                                if (board.cells[j][i] == 0) "background-color:white;" else "background-color:#222222;"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }.trim()
        }
    }
}