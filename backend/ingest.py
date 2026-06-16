import json
import os
import pickle
from rank_bm25 import BM25Okapi
import chromadb
from embedder import embed_batch

# ── Paths ──────────────────────────────────────────────
DATA_PATH = "data/drug-label-0001-of-0013.json"
CHROMA_PATH = "chroma_db"
BM25_PATH = "bm25_index.pkl"

# ── ChromaDB setup ─────────────────────────────────────
client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection(
    name="drug_interactions",
    metadata={"hnsw:space": "cosine"}
)

def load_records(path: str) -> list[dict]:
    """Load only records that have drug_interactions field."""
    print("Loading bulk data...")
    with open(path, "r") as f:
        data = json.load(f)

    records = [
        r for r in data["results"]
        if "drug_interactions" in r and r["drug_interactions"]
    ]
    print(f"Found {len(records)} records with interaction data")
    return records

def extract_drug_name(record: dict) -> str:
    openfda = record.get("openfda", {})
    generic = openfda.get("generic_name", [])
    brand = openfda.get("brand_name", [])
    spl = record.get("spl_product_data_elements", [])

    if generic:
        return generic[0].upper()
    elif brand:
        return brand[0].upper()
    elif spl:
        return spl[0].split()[0].upper()
    else:
        return "UNKNOWN"

def chunk_text(text: str, drug_name: str, chunk_size: int = 600, overlap: int = 100) -> list[str]:
    """Split interaction text into overlapping chunks."""
    words = text.split()
    chunks = []
    start = 0

    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        # Prepend drug name to every chunk for BM25 keyword matching
        chunks.append(f"{drug_name}: {chunk}")
        start += chunk_size - overlap

    return chunks

def ingest():
    # ── Check if already ingested ──────────────────────
    existing = collection.count()
    if existing > 0:
        print(f"ChromaDB already has {existing} chunks. Skipping ingestion.")
        print("Delete chroma_db/ folder to re-ingest.")
        return

    records = load_records(DATA_PATH)
    
    all_chunks = []
    all_ids = []
    all_metadata = []

    print("Chunking records...")
    for i, record in enumerate(records):
        drug_name = extract_drug_name(record)
        interaction_text = record["drug_interactions"][0]
        chunks = chunk_text(interaction_text, drug_name)

        for j, chunk in enumerate(chunks):
            all_chunks.append(chunk)
            all_ids.append(f"{i}_{j}")
            all_metadata.append({"drug_name": drug_name})

    print(f"Total chunks: {len(all_chunks)}")

    # ── Embed and store in ChromaDB in batches ─────────
    print("Embedding and storing in ChromaDB...")
    batch_size = 50

    for start in range(0, len(all_chunks), batch_size):
        end = start + batch_size
        batch_chunks = all_chunks[start:end]
        batch_ids = all_ids[start:end]
        batch_metadata = all_metadata[start:end]

        embeddings = embed_batch(batch_chunks)

        collection.add(
            documents=batch_chunks,
            embeddings=embeddings,
            ids=batch_ids,
            metadatas=batch_metadata
        )

        if start % 500 == 0:
            print(f"  Processed {start}/{len(all_chunks)} chunks...")

    # ── Build and save BM25 index ──────────────────────
    print("Building BM25 index...")
    tokenized = [chunk.lower().split() for chunk in all_chunks]
    bm25 = BM25Okapi(tokenized)

    with open(BM25_PATH, "wb") as f:
        pickle.dump((bm25, all_chunks), f)

    print(f"\nIngestion complete.")
    print(f"ChromaDB chunks: {collection.count()}")
    print(f"BM25 index saved to {BM25_PATH}")

if __name__ == "__main__":
    ingest()