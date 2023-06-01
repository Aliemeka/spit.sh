import random
from string import ascii_letters, digits


def generate_slug():
    return "".join(random.choices(ascii_letters + digits, k=7))
