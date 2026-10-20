from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    root_domain: str = "https://spit.sh/"
    database_url: str = "sqlite+aiosqlite:///./test_db.db"
    better_auth_secret: str = ""
    better_auth_url: str = "http://localhost:3000"
    geoip_db_path: str = ""
    bachs_api_key: str = ""
    bachs_api_base_url: str = "https://sandbox-api.bachs.io"
    bachs_webhook_secret: str = ""
    bachs_pro_product_id: str = ""
    bachs_pro_trial_product_id: str = ""
    frontend_url: str = "http://localhost:3001"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()

ROOT_DOMAIN = settings.root_domain
DATABASE_URL = settings.database_url
GEOIP_DB_PATH = settings.geoip_db_path
BACHS_API_KEY = settings.bachs_api_key
BACHS_API_BASE_URL = settings.bachs_api_base_url
BACHS_WEBHOOK_SECRET = settings.bachs_webhook_secret
FRONTEND_URL = settings.frontend_url
