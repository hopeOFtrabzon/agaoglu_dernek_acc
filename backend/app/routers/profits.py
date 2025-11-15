from __future__ import annotations

from datetime import date

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from ..auth import current_active_user
from ..database import get_session
from ..models import Profit, ProfitCreate, ProfitRead, ProfitUpdate, User

router = APIRouter(prefix="/profits", tags=["profits"])


@router.get("/", response_model=list[ProfitRead])
async def list_profits(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(current_active_user),
    search: str | None = Query(default=None, description="Filter by description"),
    source: str | None = Query(default=None, description="Filter by source"),
    start_date: date | None = Query(default=None),
    end_date: date | None = Query(default=None),
) -> list[ProfitRead]:
    statement = (
        select(Profit)
        .where(Profit.user_id == current_user.id)
        .order_by(Profit.date.desc())
    )
    if search:
        statement = statement.where(Profit.description.ilike(f"%{search}%"))
    if source:
        statement = statement.where(Profit.source.ilike(f"%{source}%"))
    if start_date:
        statement = statement.where(Profit.date >= start_date)
    if end_date:
        statement = statement.where(Profit.date <= end_date)
    results = await session.exec(statement)
    return [ProfitRead.model_validate(profit) for profit in results.all()]


@router.post("/", response_model=ProfitRead, status_code=status.HTTP_201_CREATED)
async def create_profit(
    *,
    profit_in: ProfitCreate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(current_active_user),
) -> ProfitRead:
    profit = Profit.model_validate(profit_in, update={"user_id": current_user.id})
    session.add(profit)
    await session.commit()
    await session.refresh(profit)
    return ProfitRead.model_validate(profit)


@router.put("/{profit_id}", response_model=ProfitRead)
async def update_profit(
    *,
    profit_id: int,
    profit_in: ProfitUpdate,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(current_active_user),
) -> ProfitRead:
    profit = await session.get(Profit, profit_id)
    if profit is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profit not found")
    if profit.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    update_data = profit_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profit, field, value)
    await session.commit()
    await session.refresh(profit)
    return ProfitRead.model_validate(profit)


@router.delete("/{profit_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profit(
    *,
    profit_id: int,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(current_active_user),
) -> None:
    profit = await session.get(Profit, profit_id)
    if profit is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profit not found")
    if profit.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed")
    await session.delete(profit)
    await session.commit()
