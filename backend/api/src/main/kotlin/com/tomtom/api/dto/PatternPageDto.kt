package com.tomtom.api.dto

import com.tomtom.api.pattern.core.PatternPage
import kotlinx.serialization.Serializable

@Serializable
class PatternPageDto(
    val patterns: List<PatternDto>,
    val offset: Int,
    val limit: Int,
    val hasMore: Boolean,
) {
    companion object {
        fun from(page: PatternPage): PatternPageDto = PatternPageDto(
            patterns = page.patterns.map(PatternDto::from),
            offset = page.offset,
            limit = page.limit,
            hasMore = page.hasMore,
        )
    }
}
