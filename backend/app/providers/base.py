"""
Provider interface. Every data source — demo or live — implements this contract so
routes and services never need to know which one is active.
"""

from abc import ABC, abstractmethod


class DataProvider(ABC):
    @abstractmethod
    def get_competitors(self) -> list[dict]:
        ...

    @abstractmethod
    def get_influencers(self) -> list[dict]:
        ...

    @abstractmethod
    def get_trends(self) -> list[dict]:
        ...

    @abstractmethod
    def get_posts(self) -> list[dict]:
        ...
