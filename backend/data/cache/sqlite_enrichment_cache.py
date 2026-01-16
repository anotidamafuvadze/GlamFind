import json
import sqlite3
import hashlib
from pathlib import Path
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional


class SQLiteEnrichmentCache:
    def __init__(
        self,
        db_dir: str = "data/cache",
        db_name: str = "enrichment_cache.sqlite3",
    ):
        db_dir_path = Path(db_dir)
        db_dir_path.mkdir(parents=True, exist_ok=True)

        self.db_path = db_dir_path / db_name
        self._init_db()

    def _conn(self):
        return sqlite3.connect(self.db_path)

    def _init_db(self):
        with self._conn() as conn:
            conn.execute(
                """
                CREATE TABLE IF NOT EXISTS enrichment_cache (
                    key TEXT PRIMARY KEY,
                    value_json TEXT NOT NULL,
                    retrieved_at TEXT NOT NULL
                )
                """
            )
            conn.execute(
                "CREATE INDEX IF NOT EXISTS idx_retrieved_at ON enrichment_cache(retrieved_at)"
            )

    def get(self, key: str, max_age_days: int = 365) -> Optional[Dict[str, Any]]:
        """Return cached value if present and not older than max_age_days."""
        cutoff = datetime.now(timezone.utc) - timedelta(days=max_age_days)

        with self._conn() as conn:
            row = conn.execute(
                "SELECT value_json, retrieved_at FROM enrichment_cache WHERE key = ?",
                (key,),
            ).fetchone()

        if not row:
            return None

        value_json, retrieved_at_str = row
        retrieved_at = datetime.fromisoformat(retrieved_at_str)

        if retrieved_at < cutoff:
            return None

        return json.loads(value_json)

    def set(self, key: str, value: Dict[str, Any], retrieved_at: Optional[datetime] = None) -> None:
        if retrieved_at is None:
            retrieved_at = datetime.now(timezone.utc)

        with self._conn() as conn:
            conn.execute(
                """
                INSERT INTO enrichment_cache(key, value_json, retrieved_at)
                VALUES (?, ?, ?)
                ON CONFLICT(key) DO UPDATE SET
                    value_json=excluded.value_json,
                    retrieved_at=excluded.retrieved_at
                """,
                (key, json.dumps(value), retrieved_at.isoformat()),
            )

    def delete(self, key: str) -> None:
        with self._conn() as conn:
            conn.execute("DELETE FROM enrichment_cache WHERE key = ?", (key,))

    def prune(self, max_age_days: int = 365) -> int:
        cutoff = datetime.now(timezone.utc) - timedelta(days=max_age_days)
        with self._conn() as conn:
            cur = conn.execute(
                "DELETE FROM enrichment_cache WHERE retrieved_at < ?",
                (cutoff.isoformat(),),
            )
            return cur.rowcount

    def generate_key(self, metadata: Dict[str, Any]) -> str:
        """Fallback product id if metadata doesn't include an explicit id."""
        relevant_parts = [
            str(metadata.get("brand", "")).lower().strip(),
            str(metadata.get("name", "")).lower().strip(),
            str(metadata.get("product_type", "")).lower().strip(),
        ]
        canonical = "||".join(relevant_parts)
        return hashlib.sha256(canonical.encode("utf-8")).hexdigest()
