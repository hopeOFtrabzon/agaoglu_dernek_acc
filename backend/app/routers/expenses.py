from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from ..auth import current_active_user
from ..database import get_session
from ..models import Expense, ExpenseCreate, ExpenseRead, ExpenseUpdate, User

router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("/", response_model=list[ExpenseRead])
async def list_expenses(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(current_active_user),
    search: str | None = Query(default=None, description="Filter by description"),
    category: str | None = Query(default=None, description="Filter by category"),
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
) -> list[ExpenseRead]:
    statement = (
        select(Expense)
        .where(Expense.user_id == current_user.id)
        .order_by(Expense.date.desc())
    )
    if search:
        statement = statement.where(Expense.description.ilike(f"%{search}%"))
    if category:
        statement = statement.where(Expense.category.ilike(f"%{category}%"))
    if start_date:
        statement = statement.where(Expense.date >= start_date)
    if end_date:
        statement = statement.where(Expense.date <= end_date)
    results = await session.exec(statement)
    return [ExpenseRead.model_validate(expense) for expense in results.all()]


@router.post("/", response_model=ExpenseRead, status_code=status.HTTP_201_CREATED)
async def create_expense(
    *,
    expense_in: ExpenseCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(current_active_user),
) -> ExpenseRead:
    expense = Expense.model_validate(expense_in, update={"user_id": current_user.id})
    session.add(expense)
    await session.commit()
    await session.refresh(expense)
    return ExpenseRead.model_validate(expense)


@router.put("/{expense_id}", response_model=ExpenseRead)
async def update_expense(
    *,
    expense_id: int,
    expense_in: ExpenseUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(current_active_user),
) -> ExpenseRead:
    expense = await session.get(Expense, expense_id)
    if expense is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    if expense.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    update_data = expense_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)
    await session.commit()
    await session.refresh(expense)
    return ExpenseRead.model_validate(expense)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_expense(
    *,
    expense_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(current_active_user),
) -> None:
    expense = await session.get(Expense, expense_id)
    if expense is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    if expense.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    await session.delete(expense)
    await session.commit()
