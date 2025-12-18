from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from routers import system, generator, forms

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(system.router, tags=["System"])
app.include_router(generator.router, tags=["Generator"], prefix=settings.API_V1_STR)
app.include_router(forms.router, tags=["Forms"], prefix=f"{settings.API_V1_STR}/forms")
