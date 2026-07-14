package com.tomtom.api.pattern.core

import com.tomtom.core.Position

data class Pattern(
    val apgcode: String,
    val name: String?,
    val occurrences: Long,
    val kind: PatternKind,
    val cells: Set<Position>,
    val width: Int,
    val height: Int,
)