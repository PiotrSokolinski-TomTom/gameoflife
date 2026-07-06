package com.tomtom.html

import com.sun.org.apache.xalan.internal.lib.ExsltStrings.padding
import com.tomtom.core.Board
import kotlinx.html.body
import kotlinx.html.h1
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
                        content = "0.5"
                    }
                }
                body {
                    div {
                        style = "padding: 0px; margin: 0px; display: flex; justify-content: center; align-items: center; height: 100vh"
                        table {
                            style = "border-collapse: collapse; table-layout: fixed; border-spacing: 0px"
                            for (i in board.cells.indices) {
                                tr {
                                    for (j in board.cells[i].indices) {
                                        td {
                                            style =
                                                "width:10px;height:10px;padding:0;margin:0;line-height:0;font-size:0;border:1px solid black;" +
                                                if (board.cells[i][j] == 0) "background-color:white;" else "background-color:#222222;"
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