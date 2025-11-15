from __future__ import annotations

from decimal import Decimal

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from ..auth import current_active_user
from ..database import get_session
from ..models import Expense, Profit, User

router = APIRouter(prefix="/summary", tags=["summary"])


@router.get("/")
async def get_summary(
    *,
    session: AsyncSession = Depends(get_session),
    current_user: User = Depends(current_active_user),
) -> dict[str, float]:
    expenses_stmt = select(func.coalesce(func.sum(Expense.amount), 0)).where(
        Expense.user_id == current_user.id
    )
    profits_stmt = select(func.coalesce(func.sum(Profit.amount), 0)).where(
        Profit.user_id == current_user.id
    )

    expenses_result = await session.exec(expenses_stmt)
    profits_result = await session.exec(profits_stmt)

    total_expenses = _decimal_to_float(expenses_result.one())
    total_profits = _decimal_to_float(profits_result.one())
    net = total_profits - total_expenses

    return {
        "total_expenses": total_expenses,
        "total_profits": total_profits,
        "net": net,
    }


def _decimal_to_float(value: Decimal | tuple[Decimal] | None) -> float:
    if isinstance(value, tuple):
        value = value[0]
    if value is None:
        return 0.0
    if isinstance(value, Decimal):
        return float(value)
    return float(value)
