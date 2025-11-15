import asyncio
from datetime import datetime

from fastapi_users.password import PasswordHelper
from sqlmodel import select

from app.database import async_session, init_db
from app.models import User

TEST_EMAIL = "testuser@example.com"
TEST_USERNAME = "testuser"
TEST_PASSWORD = "testpass123"

password_helper = PasswordHelper()


async def ensure_test_user() -> None:
    await init_db()
    async with async_session() as session:
        result = await session.exec(select(User).where(User.email == TEST_EMAIL))
        existing_user = result.first()
        if existing_user:
            print("Test user already exists.")
            return
        user = User(
            email=TEST_EMAIL,
            username=TEST_USERNAME,
            hashed_password=password_helper.hash(TEST_PASSWORD),
            first_name="Test",
            last_name="User",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        session.add(user)
        await session.commit()
        print("Test user created.")


def main() -> None:
    asyncio.run(ensure_test_user())


if __name__ == "__main__":
    main()
