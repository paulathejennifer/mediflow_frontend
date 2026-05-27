from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from datetime import datetime, timedelta
from app.models.referral import Referral
from app.models.patient import Patient
from app.models.referral_document import ReferralDocument
from app.models.audit_log import AuditLog

class AnalyticsService:
    def __init__(self, db: Session):
        self.db = db

    def get_real_api_request_count(self, days: int = 1):
        """
        Returns a structured count of audit log entries as a proxy for API activity.
        """
        start_date = datetime.utcnow() - timedelta(days=days)
        previous_start_date = start_date - timedelta(days=days)
        
        # Current Period (e.g., last 24h)
        current_count = self.db.query(func.count(AuditLog.id)).filter(
            AuditLog.created_at >= start_date
        ).scalar() or 0

        # Previous Period (to calculate trend)
        previous_count = self.db.query(func.count(AuditLog.id)).filter(
            and_(AuditLog.created_at >= previous_start_date, AuditLog.created_at < start_date)
        ).scalar() or 0
        
        trend = self.calculate_percentage_trend(current_count, previous_count)
        
        return {
            "totalRequests": current_count,
            "requestsLast24h": current_count,
            "trend": trend,
            "breakdown": {"referrals": 0, "patients": 0, "documents": 0} # Placeholder for future logic
        }

    def calculate_percentage_trend(self, current: int, previous: int) -> float:
        if previous <= 0:
            return 100.0 if current > 0 else 0.0
        return round(((current - previous) / previous) * 100, 1)

    def get_system_health_metrics(self):
        # Logic moved from analytics.py
        # ... (implementation here)
        pass

    def get_dashboard_metrics(self, is_super_admin: bool, facility_id: int = None):
        # Logic moved from analytics.py
        # ... (implementation here)
        pass

def get_analytics_service(db: Session):
    return AnalyticsService(db)