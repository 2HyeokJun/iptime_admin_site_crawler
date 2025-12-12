from datetime import datetime
from domain.model.user_status import UserStatus


class User:
    def __init__(
        self,
        user_id: str,
        status: UserStatus,
        out_started_at: datetime | None = None,
    ):
        self.user_id = user_id
        self.status = status
        self.out_started_at = out_started_at

    def change_status(self, new_status: UserStatus, now: datetime):
        if self.status == new_status:
            return False

        self.status = new_status

        if new_status == UserStatus.OUT:
            self.out_started_at = now
        else:
            self.out_started_at = None

        return True
