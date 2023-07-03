import os
import resend
from dotenv import load_dotenv


load_dotenv()

resend.api_key = os.environ.get("RESEND_API_KEY")
