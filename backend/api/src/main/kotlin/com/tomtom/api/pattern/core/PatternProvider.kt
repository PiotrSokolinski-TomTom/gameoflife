package com.tomtom.api.pattern.core

interface PatternProvider {

    fun fetch(rule: String, symmetry: String, prefix: String, limit: Int): List<Pattern>

    /**
     * Fetch the full census for a single prefix (no limit), sorted by occurrence
     * descending as returned by the source. Missing tabulations yield an empty list.
     */
    fun fetchAll(rule: String, symmetry: String, prefix: String): List<Pattern>
}
