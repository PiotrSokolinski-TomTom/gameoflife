package com.tomtom.api.api.util

import kotlinx.serialization.KSerializer
import kotlinx.serialization.descriptors.PrimitiveKind
import kotlinx.serialization.descriptors.PrimitiveSerialDescriptor
import kotlinx.serialization.encoding.Decoder
import kotlinx.serialization.encoding.Encoder

object IntPairSerializer : KSerializer<Pair<Int, Int>> {
    override val descriptor =
        PrimitiveSerialDescriptor("IntPair", PrimitiveKind.STRING)

    override fun serialize(encoder: Encoder, value: Pair<Int, Int>) {
        encoder.encodeString("(${value.first}, ${value.second})")
    }

    override fun deserialize(decoder: Decoder): Pair<Int, Int> {
        val value = decoder.decodeString()

        val (x, y) = value
            .removePrefix("(")
            .removeSuffix(")")
            .split(", ")
            .map { it.toInt() }

        return x to y
    }
}