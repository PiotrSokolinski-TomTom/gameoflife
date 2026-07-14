package com.tomtom.api.pattern.core

data class PatternPage(val patterns: List<Pattern>, val offset: Int, val limit: Int, val hasMore: Boolean)