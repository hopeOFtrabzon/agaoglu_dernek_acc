from __future__ import annotations

from datetime import date, datetime
from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4

from fastapi_users import schemas
from pydantic import ConfigDict, EmailStr
from sqlalchemy import Column, Date, DateTime, Numeric, String
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    __tablename__ = "users"

    id: UUID = Field(default_factory=uuid4, primary_key=True, index=True)
    email: EmailStr = Field(
        sa_column=Column(String, unique=True, index=True, nullable=False)
    )
    username: str = Field(
        sa_column=Column(String, unique=True, index=True, nullable=False)
    )
    hashed_password: str = Field(sa_column=Column(String, nullable=False))
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=False), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=False), nullable=False),
    )


class ExpenseBase(SQLModel):
    description: str
    amount: Decimal = Field(sa_column=Column(Numeric(10, 2), nullable=False))
    category: str = Field(sa_column=Column(String, index=True, nullable=False))
    date: date = Field(sa_column=Column(Date, index=True, nullable=False))


class Expense(ExpenseBase, table=True):
    __tablename__ = "expenses"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: UUID = Field(
        foreign_key="users.id", index=True, nullable=False
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=False), nullable=False, index=True),
    )


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseRead(ExpenseBase):
    id: int
    user_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ExpenseUpdate(SQLModel):
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    category: Optional[str] = None
    date: Optional[date] = None


class ProfitBase(SQLModel):
    description: str
    amount: Decimal = Field(sa_column=Column(Numeric(10, 2), nullable=False))
    source: str = Field(sa_column=Column(String, index=True, nullable=False))
    date: date = Field(sa_column=Column(Date, index=True, nullable=False))


class Profit(ProfitBase, table=True):
    __tablename__ = "profits"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: UUID = Field(
        foreign_key="users.id", index=True, nullable=False
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        sa_column=Column(DateTime(timezone=False), nullable=False, index=True),
    )


class ProfitCreate(ProfitBase):
    pass


class ProfitRead(ProfitBase):
    id: int
    user_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProfitUpdate(SQLModel):
    description: Optional[str] = None
    amount: Optional[Decimal] = None
    source: Optional[str] = None
    date: Optional[date] = None


class UserRead(schemas.BaseUser[UUID]):
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserCreate(schemas.BaseUserCreate):
    username: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None


class UserUpdate(schemas.BaseUserUpdate):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
