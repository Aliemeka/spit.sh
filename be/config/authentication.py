from fastapi_login import LoginManager
from dotenv import load_dotenv
import os
from datetime import timedelta

load_dotenv()


SECRET = os.environ.get("SECRET") or "my-secret"

manager = LoginManager(SECRET, "/login", default_expiry=timedelta(hours=12))
