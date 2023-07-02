from pydantic import BaseModel


class EmailLoginSchema(BaseModel):
    email: str


class LoginResponseSchema(BaseModel):
    temp_token: str


class OTPSchema(BaseModel):
    otp: str
    temp_token: str
