package com.tomtom.api.controller

import com.tomtom.api.dto.PatternDto
import com.tomtom.api.service.PatternService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import kotlin.collections.map

@CrossOrigin(origins = ["http://localhost:5173"])
@RestController
@RequestMapping("/api/patterns")
class PatternController(private val service: PatternService) {

    @GetMapping("/featured")
    fun featured(): ResponseEntity<List<PatternDto>> =
        ResponseEntity.ok(service.featured().map(PatternDto::from))

    @GetMapping
    fun browse(
        @RequestParam(defaultValue = PatternService.DEFAULT_RULE) rule: String,
        @RequestParam(defaultValue = PatternService.DEFAULT_SYMMETRY) symmetry: String,
        @RequestParam prefix: String,
        @RequestParam(defaultValue = "10") limit: Int,
    ): ResponseEntity<List<PatternDto>> =
        ResponseEntity.ok(service.browse(rule, symmetry, prefix, limit).map(PatternDto::from))

    @GetMapping("/category/{category}")
    fun browseCategory(
        @PathVariable category: String,
        @RequestParam(defaultValue = "12") limit: Int,
    ): ResponseEntity<List<PatternDto>> =
        ResponseEntity.ok(service.browseCategory(category, limit).map(PatternDto::from))
}