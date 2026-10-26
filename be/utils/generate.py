import random
from string import ascii_letters, digits
from uuid import uuid4


def generate_slug() -> str:
    return "".join(random.choices(ascii_letters + digits, k=7))


def generate_reference() -> str:
    return uuid4().hex[:4] + "".join(random.choices(ascii_letters + digits, k=4))


def generate_otp(is_generic: bool = False) -> str:
    if is_generic:
        return "456321"
    return "".join(random.choices(digits, k=6))
