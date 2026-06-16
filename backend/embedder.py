from sentence_transformers import SentenceTransformer

# Load once at module level — not on every call
model = SentenceTransformer("pritamdeka/S-PubMedBert-MS-MARCO")

def embed(text: str) -> list[float]:
    """Convert text to embedding vector."""
    return model.encode(text, convert_to_numpy=True).tolist()

def embed_batch(texts: list[str]) -> list[list[float]]:
    """Convert a batch of texts to embedding vectors."""
    return model.encode(texts, convert_to_numpy=True, batch_size=32).tolist()