package com.tomtom.api.pattern.adapter

import com.tomtom.api.pattern.core.Pattern
import com.tomtom.api.pattern.core.PatternProvider
import org.slf4j.LoggerFactory
import org.springframework.http.client.SimpleClientHttpRequestFactory
import org.springframework.stereotype.Component
import org.springframework.web.client.RestClient
import org.springframework.web.client.RestClientException
import org.springframework.web.client.body
import java.time.Duration

@Component
class CatagoluePatternProvider : PatternProvider {

    private val BASE_URL = "https://catagolue.hatsya.com"

    private val log = LoggerFactory.getLogger(javaClass)

    private val restClient: RestClient = RestClient.builder()
        .baseUrl(BASE_URL)
        .requestFactory(
            SimpleClientHttpRequestFactory().apply {
                setConnectTimeout(Duration.ofSeconds(5))
                setReadTimeout(Duration.ofSeconds(10))
            }
        )
        .build()

    override fun fetch(rule: String, symmetry: String, prefix: String, limit: Int): List<Pattern> {
        val csv = try {
            restClient.get()
                .uri("/textcensus/{rule}/{symmetry}/{prefix}", rule, symmetry, prefix)
                .retrieve()
                .body<String>()
        } catch (e: RestClientException) {
            log.warn("Catagolue request failed for {}/{}/{}: {}", rule, symmetry, prefix, e.message)
            return emptyList()
        } ?: return emptyList()

        return csv.lineSequence()
            .drop(1) // header "apgcode":"occurrences"
            .map { it.trim() }
            .filter { it.isNotEmpty() }
            .mapNotNull { parseLine(it) }
            .take(limit)
            .toList()
    }

    private fun parseLine(line: String): Pattern? {
        val parts = line.replace("\"", "").split(",")
        if (parts.size < 2) return null
        val apgcode = parts[0].trim()
        val occurrences = parts[1].trim().toLongOrNull() ?: 0L
        return try {
            val decoded = ApgcodeDecoder.decode(apgcode)
            Pattern(
                apgcode = apgcode,
                name = PatternNames.of(apgcode),
                occurrences = occurrences,
                kind = decoded.kind,
                cells = decoded.cells,
                width = decoded.width,
                height = decoded.height,
            )
        } catch (e: IllegalArgumentException) {
            log.warn("Skipping undecodable apgcode {}: {}", apgcode, e.message)
            null
        }
    }
}
