def fetch_users():
    return [
        {"id": "[아빠]user1", "status": "IN"},
        {"id": "LGWebOSTV_01", "status": "OUT"},
    ]

def is_tracked_user(user_id: str) -> bool:
    return any(keyword in user_id for keyword in ["[아빠]", "[누나]", "LGWebOSTV"])
