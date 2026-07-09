@file:UseSerializers(IntPairSerializer::class)

package com.tomtom.api.api.dto

import com.tomtom.api.api.util.IntPairSerializer
import com.tomtom.core.CellState
import kotlinx.serialization.Serializable
import kotlinx.serialization.UseSerializers

@Serializable
data class BoardDto(
    val cells: Map<Pair<Int, Int>, CellState>)