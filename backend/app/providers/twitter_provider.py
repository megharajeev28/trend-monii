from app.providers.base import DataProvider


class TwitterProvider(DataProvider):
    """
    Placeholder for the X/Twitter API v2. Wire this up with a bearer token
    (TWITTER_BEARER_TOKEN in .env) and implement each method with real API calls,
    then swap DemoDataProvider for TwitterProvider in app/services/data_service.py
    or a small provider-registry function. Not implemented in demo mode.
    """

    def get_competitors(self) -> list[dict]:
        raise NotImplementedError("Connect TWITTER_BEARER_TOKEN and implement this method.")

    def get_influencers(self) -> list[dict]:
        raise NotImplementedError("Connect TWITTER_BEARER_TOKEN and implement this method.")

    def get_trends(self) -> list[dict]:
        raise NotImplementedError("Connect TWITTER_BEARER_TOKEN and implement this method.")

    def get_posts(self) -> list[dict]:
        raise NotImplementedError("Connect TWITTER_BEARER_TOKEN and implement this method.")
