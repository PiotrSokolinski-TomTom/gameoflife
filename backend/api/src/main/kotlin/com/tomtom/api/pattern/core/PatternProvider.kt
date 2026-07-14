package com.tomtom.api.pattern.core

interface PatternProvider {

    fun fetch(rule: String, symmetry: String, prefix: String, limit: Int): List<Pattern>

    fun fetchAll(rule: String, symmetry: String, prefix: String): List<Pattern>
}
