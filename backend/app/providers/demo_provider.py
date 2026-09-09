from app.providers.base import DataProvider
from app.services import data_service


class DemoDataProvider(DataProvider):
    """Serves the bundled JSON fixtures in app/data/. Active by default — no API keys required."""

    def get_competitors(self) -> list[dict]:
        return data_service.get_competitors()

    def get_influencers(self) -> list[dict]:
        return data_service.get_influencers()

    def get_trends(self) -> list[dict]:
        return data_service.get_trends()

    def get_posts(self) -> list[dict]:
        return data_service.get_posts()
