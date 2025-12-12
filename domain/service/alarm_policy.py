from datetime import datetime, timedelta
from domain.model.user_status import UserStatus
from domain.model.user import User


class AlarmPolicy:
    OUT_THRESHOLD = timedelta(minutes=5)

    @staticmethod
    def should_notify(
        previous_status: UserStatus,
        user: User,
        now: datetime,
    ) -> bool:
        # OUT → IN : 즉시 알람
        if previous_status == UserStatus.OUT and user.status == UserStatus.IN:
            return True

        # IN → OUT : 5분 이상 지속
        if user.status == UserStatus.OUT and user.out_started_at:
            return now - user.out_started_at >= AlarmPolicy.OUT_THRESHOLD

        return False
