from app.providers.base import DataProvider


class RedditProvider(DataProvider):
    """Placeholder for the Reddit API (PRAW or direct OAuth2). Not implemented in demo mode."""

    def get_competitors(self) -> list[dict]:
        raise NotImplementedError("Connect Reddit API credentials and implement this method.")

    def get_influencers(self) -> list[dict]:
        raise NotImplementedError("Connect Reddit API credentials and implement this method.")

    def get_trends(self) -> list[dict]:
        raise NotImplementedError("Connect Reddit API credentials and implement this method.")

    def get_posts(self) -> list[dict]:
        raise NotImplementedError("Connect Reddit API credentials and implement this method.")
