# cron.py
from infrastructure.api.external_user_api import fetch_users
from infrastructure.persistence.in_memory_user_repository import InMemoryUserRepository
from infrastructure.notifier.alarm_sender import AlarmSender
from application.watch_users import WatchUsers
from infrastructure.api.external_user_api import fetch_users, is_tracked_user


def main():
    users = fetch_users()
    tracked_users = [u for u in users if is_tracked_user(u["id"])]

    use_case = WatchUsers(
        user_repo=InMemoryUserRepository(),
        alarm_sender=AlarmSender(),
    )
    use_case.execute(tracked_users)


if __name__ == "__main__":
    main()
