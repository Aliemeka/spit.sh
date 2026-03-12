import functools
import inspect
from fastapi import Request
from slowapi import Limiter as _Limiter
from slowapi.util import get_remote_address


class Limiter(_Limiter):
    def limit(self, limit_value: str, *args, **kwargs):
        slow_dec = super().limit(limit_value, *args, **kwargs)

        def decorator(func):
            sig = inspect.signature(func)
            if "request" in sig.parameters:
                return slow_dec(func)

            new_params = [
                inspect.Parameter("request", inspect.Parameter.POSITIONAL_OR_KEYWORD, annotation=Request),
                *sig.parameters.values(),
            ]

            @functools.wraps(func)
            async def wrapper(*args, **kwargs):
                kwargs.pop("request", None)
                return await func(*args, **kwargs)

            wrapper.__signature__ = sig.replace(parameters=new_params)
            return slow_dec(wrapper)

        return decorator


limiter = Limiter(key_func=get_remote_address, default_limits=["100/minute"])
