package com.tomtom.core

import kotlinx.serialization.Serializable

@Serializable
enum class CellState {
    ALIVE,
    DEAD
}