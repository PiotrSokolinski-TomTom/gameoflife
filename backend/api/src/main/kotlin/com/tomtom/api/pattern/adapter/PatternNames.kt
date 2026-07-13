package com.tomtom.api.pattern.adapter

object PatternNames {
    private val NAMES: Map<String, String> = mapOf(
        // still lifes
        "xs4_33" to "Block",
        "xs4_252" to "Tub",
        "xs5_253" to "Boat",
        "xs6_696" to "Beehive",
        "xs6_356" to "Ship",
        "xs7_2596" to "Loaf",
        "xs28_g88m952g8gz1218kid221" to "Bakery",
        // oscillators
        "xp2_7" to "Blinker",
        "xp2_7e" to "Toad",
        "xp2_318c" to "Beacon",
        "xp3_co9nas0san9oczgoldlo0oldlogz1047210127401" to "Pulsar",
        // spaceships
        "xq4_153" to "Glider",
    )

    fun of(apgcode: String): String? = NAMES[apgcode]
}
