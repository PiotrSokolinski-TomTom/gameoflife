package com.tomtom.api.service

import com.tomtom.api.pattern.core.Pattern
import com.tomtom.api.pattern.core.PatternProvider
import org.springframework.stereotype.Service

/** A single page of a category, plus whether a further page exists. */
data class PatternPage(val patterns: List<Pattern>, val offset: Int, val limit: Int, val hasMore: Boolean)

@Service
class PatternService(private val provider: PatternProvider) {

    fun browse(rule: String, symmetry: String, prefix: String, limit: Int): List<Pattern> =
        provider.fetch(rule, symmetry, prefix, limit)

    /**
     * Browse a category with offset/limit pagination. Patterns are ordered by ascending object
     * size (still lifes: cell count; oscillators/spaceships: period) and, within a size, by
     * descending occurrence as returned by the source. Prefixes are walked lazily, so only enough
     * upstream censuses are fetched (and cached) to satisfy the requested page.
     */
    fun browseCategory(category: String, offset: Int, limit: Int): PatternPage {
        val definition = CATEGORIES[category.lowercase()]
            ?: throw IllegalArgumentException("Unknown category: $category")

        val need = offset + limit
        val collected = mutableListOf<Pattern>()
        val prefixes = definition.prefixes().iterator()
        while (collected.size <= need && prefixes.hasNext()) {
            val page = provider.fetchAll(DEFAULT_RULE, DEFAULT_SYMMETRY, prefixes.next())
            if (page.isEmpty()) {
                // For contiguous classes an empty census marks the end; for sparse ones it is a gap.
                if (definition.stopOnEmpty) break else continue
            }
            collected += page
        }

        return PatternPage(
            patterns = collected.drop(offset).take(limit),
            offset = offset,
            limit = limit,
            hasMore = collected.size > offset + limit,
        )
    }

    /**
     * A curated mix of the most common still lifes, oscillators and spaceships from
     * the standard Conway census (b3s23 / C1), a few of each.
     */
    fun featured(): List<Pattern> =
        FEATURED_PREFIXES.flatMap { prefix ->
            provider.fetch(DEFAULT_RULE, DEFAULT_SYMMETRY, prefix, FEATURED_PER_PREFIX)
        }

    /**
     * How a category maps onto Catagolue's per-size censuses.
     *
     * @param classChar the apgcode object-class char (xs = still life, xp = oscillator, xq = spaceship).
     * @param sizes the ordered sizes to walk, or null to walk contiguously from [minSize] upward.
     * @param stopOnEmpty true when a missing census means the end of the class (contiguous still lifes),
     *   false when sizes are sparse (oscillator/spaceship periods have gaps) and gaps must be skipped.
     */
    private class Category(
        val classChar: String,
        val sizes: List<Int>?,
        val minSize: Int = 0,
        val stopOnEmpty: Boolean,
    ) {
        fun prefixes(): Sequence<String> {
            val seq = sizes?.asSequence() ?: generateSequence(minSize) { it + 1 }
            return seq.map { "$classChar$it" }
        }
    }

    companion object {
        const val DEFAULT_RULE = "b3s23"
        const val DEFAULT_SYMMETRY = "C1"
        private const val FEATURED_PER_PREFIX = 3
        private val FEATURED_PREFIXES = listOf("xs4", "xs5", "xs6", "xs7", "xp2", "xq4")

        private val CATEGORIES: Map<String, Category> = mapOf(
            // Still-life cell counts are contiguous from 4 upward: walk dynamically, stop at the first gap.
            "still-lifes" to Category(classChar = "xs", sizes = null, minSize = 4, stopOnEmpty = true),
            // Oscillator/spaceship periods are sparse with no upstream index, so list the known buckets.
            // Missing periods are simply skipped, so the lists can be generous.
            "oscillators" to Category(classChar = "xp", sizes = listOf(2, 3, 4, 5, 6, 8, 14, 15, 16, 18, 24, 30, 46), stopOnEmpty = false),
            "spaceships" to Category(classChar = "xq", sizes = listOf(4, 5, 6, 7, 8, 12, 16, 20, 24), stopOnEmpty = false),
        )
    }
}
