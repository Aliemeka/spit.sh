from os import urandom, environ
from dotenv import load_dotenv
import bcrypt

load_dotenv()


def generate_token() -> str:
    return urandom(32).hex()


def hash_otp(otp: str) -> str:
    b_otp = otp.encode()
    return bcrypt.hashpw(b_otp, bcrypt.gensalt(12)).decode()


def check_otp(otp: str, hashed_otp: str) -> bool:
    return bcrypt.checkpw(otp.encode(), hashed_otp.encode())
