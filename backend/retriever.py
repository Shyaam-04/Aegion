import pickle
import chromadb
from embedder import embed
from itertools import combinations

# ── Paths ──────────────────────────────────────────────
CHROMA_PATH = "chroma_db"
BM25_PATH = "bm25_index.pkl"

# ── Load ChromaDB ──────────────────────────────────────
client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection(
    name="drug_interactions",
    metadata={"hnsw:space": "cosine"}
)

# ── Load BM25 index ────────────────────────────────────
with open(BM25_PATH, "rb") as f:
    bm25, all_chunks = pickle.load(f)


def semantic_search(query: str, top_k: int = 10) -> list[tuple[str, int]]:
    """Search ChromaDB using semantic similarity."""
    query_vector = embed(query)

    results = collection.query(
        query_embeddings=[query_vector],
        n_results=top_k
    )

    chunks = results["documents"][0]
    return [(chunk, rank) for rank, chunk in enumerate(chunks)]


def bm25_search(query: str, top_k: int = 10) -> list[tuple[str, int]]:
    """Search using BM25 keyword matching."""
    tokenized_query = query.lower().split()
    scores = bm25.get_scores(tokenized_query)

    # Get indices of top_k highest scores
    top_indices = sorted(
        range(len(scores)),
        key=lambda i: scores[i],
        reverse=True
    )[:top_k]

    return [(all_chunks[i], rank) for rank, i in enumerate(top_indices)]


def reciprocal_rank_fusion(
    semantic_results: list[tuple[str, int]],
    bm25_results: list[tuple[str, int]],
    k: int = 60,
    bm25_weight: float = 0.90,
    semantic_weight: float = 0.10
) -> list[str]:
    """
    Merge semantic and BM25 results into unified ranking.
    RRF formula: score = 1 / (k + rank)
    """
    scores = {}

    # Score semantic results
    for chunk, rank in semantic_results:
        if chunk not in scores:
            scores[chunk] = 0
        scores[chunk] += semantic_weight * (1 / (k + rank + 1))

    # Score BM25 results
    for chunk, rank in bm25_results:
        if chunk not in scores:
            scores[chunk] = 0
        scores[chunk] += bm25_weight * (1 / (k + rank + 1))

    # Sort by combined score
    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [chunk for chunk, score in ranked]


def retrieve(drug_names: list[str], top_k: int = 5) -> str:
    """
    Run separate retrieval for each drug and drug pair.
    Combines results for comprehensive coverage.
    """
    all_semantic = []
    all_bm25 = []
    seen = set()
    
    # Query for each individual drug
    for drug in drug_names:
        query = f"{drug} drug interactions contraindications"
        semantic = semantic_search(query, top_k=3)
        bm25 = bm25_search(query, top_k=10)
        all_semantic.extend(semantic)
        all_bm25.extend(bm25)
    
    # Query for each drug pair combination
    pairs = list(combinations(drug_names, 2))
    for pair in pairs:
        query = (
            f"Drug interaction between "
            f"{pair[0]} and {pair[1]}"
        )
        semantic = semantic_search(query, top_k=3)
        bm25 = bm25_search(query, top_k=10)
        all_semantic.extend(semantic)
        all_bm25.extend(bm25)
    
    #Weighted RRF
    ranked_chunks = reciprocal_rank_fusion(
        all_semantic,
        all_bm25
    )

    #Entity filtering
    pairs_lower = [
        tuple(drug.lower() for drug in pair)
        for pair in pairs
    ]

    final_chunks = []

    for chunk in ranked_chunks:
        chunk_lower = chunk.lower()
        if any(
            all(drug in chunk_lower for drug in pair)
            for pair in pairs_lower
        ):
            if chunk not in seen:
                seen.add(chunk)
                final_chunks.append(chunk)
        if len(final_chunks) >= top_k:
            break
    
    if not final_chunks:
        return ""

    return "\n\n---\n\n".join(final_chunks)