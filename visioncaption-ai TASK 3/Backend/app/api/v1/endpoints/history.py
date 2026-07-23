from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies import get_db, require_current_user
from app.models.caption_model import CaptionRecord, UserRecord
from app.models.schemas import CaptionHistoryItem, CaptionHistoryResponse

router = APIRouter()


@router.get("", response_model=CaptionHistoryResponse, summary="Get caption history")
async def get_history(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: UserRecord = Depends(require_current_user),
) -> CaptionHistoryResponse:
    count_result = await db.execute(
        select(func.count(CaptionRecord.id)).where(CaptionRecord.user_id == current_user.id)
    )
    total = count_result.scalar_one()

    offset = (page - 1) * page_size
    result = await db.execute(
        select(CaptionRecord)
        .where(CaptionRecord.user_id == current_user.id)
        .order_by(CaptionRecord.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    records = result.scalars().all()

    items = [
        CaptionHistoryItem(
            id=record.id,
            caption=record.caption,
            thumbnail_url=record.thumbnail_url or "",
            confidence=record.confidence,
            language=record.language,
            created_at=record.created_at,
        )
        for record in records
    ]

    return CaptionHistoryResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        has_more=offset + len(items) < total,
    )


@router.delete("/{caption_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a caption")
async def delete_history_item(
    caption_id: str,
    db: AsyncSession = Depends(get_db),
    current_user: UserRecord = Depends(require_current_user),
) -> None:
    result = await db.execute(
        select(CaptionRecord).where(
            CaptionRecord.id == caption_id, CaptionRecord.user_id == current_user.id
        )
    )
    record = result.scalar_one_or_none()

    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Caption not found")

    await db.delete(record)
    await db.commit()