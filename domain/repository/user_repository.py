from abc import ABC, abstractmethod
from domain.model.user import User


class UserRepository(ABC):
    @abstractmethod
    def find_by_id(self, user_id: str) -> User | None:
        pass

    @abstractmethod
    def save(self, user: User):
        pass
