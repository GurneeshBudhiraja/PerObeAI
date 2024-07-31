# CORS middleware
from .cors import configure_cors_middleware 
# Logger middleware
from .logger import configure_logger_middleware
# Trusted host middleware
from .trusted_host import configure_trusted_host_middleware
# GZip middleware
from .gzip import configure_gzip_middleware