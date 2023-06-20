import random
from string import ascii_letters, digits


def generate_slug() -> str:
    return "".join(random.choices(ascii_letters + digits, k=7))


def generate_otp(is_generic: bool = False) -> str:
    if is_generic:
        return "456321"
    return "".join(random.choices(digits, k=6))
