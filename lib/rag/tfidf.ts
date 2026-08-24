// Minimal TF-IDF + cosine similarity retriever.
//
// No vector DB, no embedding API call — this is the same pattern used in
// MediAgent AI: term-frequency / inverse-document-frequency vectors scored
// with cosine similarity. It's the right tool here because each temple's
// corpus is small (a few dozen chunks), rebuilt per-request, and doesn't
// need semantic/embedding-level recall — keyword overlap on curated,
// well-written temple copy is already strong.

export type Chunk = {
  id: string;
  section: string;
  text: string;
};

export type RankedChunk = {
  chunk: Chunk;
  score: number;
};

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has",
  "have", "he", "in", "is", "it", "its", "of", "on", "or", "that", "the",
  "to", "was", "were", "will", "with", "this", "these", "those", "you",
  "your", "what", "when", "where", "how", "do", "does", "did", "can",
  "i", "we", "my", "our",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOPWORDS.has(t));
}

function buildIdf(docsTokens: string[][]): Map<string, number> {
  const df = new Map<string, number>();
  for (const tokens of docsTokens) {
    for (const t of new Set(tokens)) {
      df.set(t, (df.get(t) ?? 0) + 1);
    }
  }
  const N = docsTokens.length;
  const idf = new Map<string, number>();
  for (const [term, count] of df) {
    // Smoothed IDF — never zero, never blows up on rare terms.
    idf.set(term, Math.log((N + 1) / (count + 1)) + 1);
  }
  return idf;
}

function vectorize(tokens: string[], idf: Map<string, number>): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);

  const vec = new Map<string, number>();
  for (const [term, count] of tf) {
    const weight = idf.get(term);
    if (weight) vec.set(term, (count / tokens.length) * weight);
  }
  return vec;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const v of a.values()) normA += v * v;
  for (const v of b.values()) normB += v * v;
  for (const [term, va] of a) {
    const vb = b.get(term);
    if (vb) dot += va * vb;
  }

  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Ranks `chunks` against `query` and returns the top `topK`, highest score
 * first. IDF is computed fresh from this corpus each call — cheap at
 * per-temple scale (tens of chunks) and means the query never leaks
 * relevance from other temples.
 */
export function rankChunks(chunks: Chunk[], query: string, topK = 5): RankedChunk[] {
  if (chunks.length === 0) return [];

  const docsTokens = chunks.map((c) => tokenize(c.text));
  const idf = buildIdf(docsTokens);
  const queryVec = vectorize(tokenize(query), idf);

  const scored = chunks.map((chunk, i) => ({
    chunk,
    score: cosineSimilarity(queryVec, vectorize(docsTokens[i], idf)),
  }));

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}
