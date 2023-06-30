from os import urandom


def generate_token() -> str:
    return urandom(32).hex()
