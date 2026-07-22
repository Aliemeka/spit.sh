from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    root_domain: str = "https://spit.sh/"
    database_url: str = "sqlite+aiosqlite:///./test_db.db"
    better_auth_secret: str = ""
    better_auth_url: str = "http://localhost:3000"
    geoip_db_path: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

ROOT_DOMAIN = settings.root_domain
DATABASE_URL = settings.database_url
GEOIP_DB_PATH = settings.geoip_db_path
