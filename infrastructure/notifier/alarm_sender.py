# infrastructure/notifier/alarm_sender.py
class AlarmSender:
    def send(self, user):
        print(f"🚨 ALARM: {user.user_id} 상태 변경 → {user.status.value}")
