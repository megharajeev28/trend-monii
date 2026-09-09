from app.providers.base import DataProvider


class YouTubeProvider(DataProvider):
    """Placeholder for the YouTube Data API v3. Not implemented in demo mode."""

    def get_competitors(self) -> list[dict]:
        raise NotImplementedError("Connect YOUTUBE_API_KEY and implement this method.")

    def get_influencers(self) -> list[dict]:
        raise NotImplementedError("Connect YOUTUBE_API_KEY and implement this method.")

    def get_trends(self) -> list[dict]:
        raise NotImplementedError("Connect YOUTUBE_API_KEY and implement this method.")

    def get_posts(self) -> list[dict]:
        raise NotImplementedError("Connect YOUTUBE_API_KEY and implement this method.")
