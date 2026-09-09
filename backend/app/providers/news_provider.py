from app.providers.base import DataProvider


class NewsProvider(DataProvider):
    """Placeholder for a news API (e.g. NewsAPI.org). Not implemented in demo mode."""

    def get_competitors(self) -> list[dict]:
        raise NotImplementedError("Connect NEWS_API_KEY and implement this method.")

    def get_influencers(self) -> list[dict]:
        raise NotImplementedError("News sources don't map to influencers; omit or adapt.")

    def get_trends(self) -> list[dict]:
        raise NotImplementedError("Connect NEWS_API_KEY and implement this method.")

    def get_posts(self) -> list[dict]:
        raise NotImplementedError("Connect NEWS_API_KEY and implement this method.")
