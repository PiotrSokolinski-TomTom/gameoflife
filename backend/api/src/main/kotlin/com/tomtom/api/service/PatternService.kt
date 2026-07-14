package com.tomtom.api.service

import com.tomtom.api.pattern.core.Pattern
import com.tomtom.api.pattern.core.PatternPage
import com.tomtom.api.pattern.core.PatternProvider
import org.springframework.stereotype.Service

@Service
class PatternService(private val provider: PatternProvider) {

    fun browse(rule: String, symmetry: String, prefix: String, limit: Int): List<Pattern> =
        provider.fetch(rule, symmetry, prefix, limit)

    fun browseCategory(category: String, offset: Int, limit: Int, prefix: String? = null): PatternPage {
        val definition = CATEGORIES[category.lowercase()]
            ?: throw IllegalArgumentException("Unknown category: $category")

        if (prefix != null) {
            if(!prefix.startsWith(definition.classChar)) {
                throw RuntimeException("Unknown prefix: $prefix")
            }
            val all = provider.fetchAll(DEFAULT_RULE, DEFAULT_SYMMETRY, prefix)
            return PatternPage(
                patterns = all.drop(offset).take(limit),
                offset = offset,
                limit = limit,
                hasMore = all.size > offset + limit,
            )
        }

        val need = offset + limit
        val collected = mutableListOf<Pattern>()
        val prefixes = definition.prefixes().iterator()
        while (collected.size <= need && prefixes.hasNext()) {
            val page = provider.fetchAll(DEFAULT_RULE, DEFAULT_SYMMETRY, prefixes.next())
            if (page.isEmpty()) {
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

    fun featured(): List<Pattern> =
        FEATURED_PREFIXES.flatMap { prefix ->
            provider.fetch(DEFAULT_RULE, DEFAULT_SYMMETRY, prefix, FEATURED_PER_PREFIX)
        }

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
            "still-lifes" to Category(classChar = "xs", sizes = null, minSize = 4, stopOnEmpty = true),
            "oscillators" to Category(classChar = "xp", sizes = listOf(2, 3, 4, 5, 6, 8, 14, 15, 16, 24, 30, 46, 120), stopOnEmpty = false),
            "spaceships" to Category(classChar = "xq", sizes = listOf(4, 7, 12, 16), stopOnEmpty = false),
        )
    }
}
