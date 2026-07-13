package com.tomtom.api.service

import com.tomtom.api.pattern.core.Pattern
import com.tomtom.api.pattern.core.PatternProvider
import org.springframework.stereotype.Service

@Service
class PatternService(private val provider: PatternProvider) {

    fun browse(rule: String, symmetry: String, prefix: String, limit: Int): List<Pattern> =
        provider.fetch(rule, symmetry, prefix, limit)

    fun browseCategory(category: String, limit: Int): List<Pattern> {
        val prefixes = CATEGORIES[category.lowercase()]
            ?: throw IllegalArgumentException("Unknown category: $category")
        return prefixes
            .flatMap { provider.fetch(DEFAULT_RULE, DEFAULT_SYMMETRY, it, limit) }
            .sortedByDescending { it.occurrences }
            .take(limit)
    }

    /**
     * A curated mix of the most common still lifes, oscillators and spaceships from
     * the standard Conway census (b3s23 / C1), a few of each.
     */
    fun featured(): List<Pattern> =
        FEATURED_PREFIXES.flatMap { prefix ->
            provider.fetch(DEFAULT_RULE, DEFAULT_SYMMETRY, prefix, FEATURED_PER_PREFIX)
        }

    companion object {
        const val DEFAULT_RULE = "b3s23"
        const val DEFAULT_SYMMETRY = "C1"
        private const val FEATURED_PER_PREFIX = 3
        private val FEATURED_PREFIXES = listOf("xs4", "xs5", "xs6", "xs7", "xp2", "xq4")

        val CATEGORIES: Map<String, List<String>> = mapOf(
            "still-lifes" to listOf("xs4", "xs5", "xs6", "xs7", "xs8"),
            "oscillators" to listOf("xp2", "xp3", "xp4", "xp5", "xp8"),
            "spaceships" to listOf("xq4", "xq5", "xq7"),
        )
    }
}