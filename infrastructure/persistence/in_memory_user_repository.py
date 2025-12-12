from domain.repository.user_repository import UserRepository


class InMemoryUserRepository(UserRepository):
    def __init__(self):
        self.storage = {}

    def find_by_id(self, user_id):
        return self.storage.get(user_id)

    def save(self, user):
        self.storage[user.user_id] = user
