package com.tomtom.api.api.service

import com.tomtom.api.api.dto.BoardDto
import com.tomtom.core.DefaultBoard
import com.tomtom.core.GameOfLife
import org.springframework.stereotype.Service
import kotlin.random.Random

@Service
class BoardService {

    fun createRandomBoard(width: String?, height: String?, seed: String?): BoardDto {
        val intWidth = if(width != null && width != "") width.toInt() else 8
        val intHeight = if(height != null && height != "") height.toInt() else 8
        val random = if(seed != null && seed != "") Random(seed.toInt()) else Random.Default
        val board = GameOfLife.randomBoard(intWidth, intHeight, random)
        return BoardDto.from(board.cells)
    }

    fun tick(boardDto: BoardDto): BoardDto {
        val board = DefaultBoard(boardDto.toPositions())
        return BoardDto.from(GameOfLife.tick(board).cells)
    }
}