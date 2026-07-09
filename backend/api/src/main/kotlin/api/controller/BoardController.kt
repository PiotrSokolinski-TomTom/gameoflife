package com.tomtom.api.api.controller

import com.tomtom.api.api.dto.BoardDto
import com.tomtom.api.api.service.BoardService
import jakarta.websocket.server.PathParam
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@CrossOrigin(origins = ["http://localhost:5173"])
@RestController
@RequestMapping("/api/board")
class BoardController(private val service: BoardService) {

    @GetMapping("/random")
    fun generateBoard(@RequestParam(required = false) width: String?, @RequestParam(required = false) height: String?, @RequestParam(required = false) seed: String?): ResponseEntity<BoardDto> {
        return ResponseEntity.ok(service.createRandomBoard(width, height, seed))
    }

    @PostMapping("/tick")
    fun tick(@RequestBody boardDto: BoardDto): ResponseEntity<BoardDto> {
        return ResponseEntity.ok(service.tick(boardDto))
    }
}