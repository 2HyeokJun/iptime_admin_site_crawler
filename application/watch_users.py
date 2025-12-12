from datetime import datetime
from domain.service.alarm_policy import AlarmPolicy
from domain.model.user import User
from domain.model.user_status import UserStatus
from domain.repository.user_repository import UserRepository


class WatchUsers:
    def __init__(self, user_repo: UserRepository, alarm_sender):
        self.user_repo = user_repo
        self.alarm_sender = alarm_sender

    def execute(self, fetched_users: list[dict]):
        now = datetime.utcnow()

        for data in fetched_users:
            user_id = data["id"]
            status = UserStatus(data["status"])

            user = self.user_repo.find_by_id(user_id)
            if not user:
                user = User(user_id, status)
                self.user_repo.save(user)
                continue

            previous_status = user.status
            changed = user.change_status(status, now)

            if not changed:
                continue

            if AlarmPolicy.should_notify(previous_status, user, now):
                self.alarm_sender.send(user)

            self.user_repo.save(user)
