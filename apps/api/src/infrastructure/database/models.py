from sqlalchemy import Column, String, Float, DateTime, Boolean, JSON, ForeignKey, Text, BigInteger
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.sql import func
import uuid


class Base(DeclarativeBase):
    pass


def gen_uuid():
    return str(uuid.uuid4())


class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, nullable=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    code = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class SectorModel(Base):
    __tablename__ = "sectors"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    geometry = Column(JSON, nullable=False)
    population_density = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class TruckModel(Base):
    __tablename__ = "trucks"

    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    plate = Column(String, nullable=True)
    sector_id = Column(String, ForeignKey("sectors.id"), nullable=True)
    driver_id = Column(String, ForeignKey("users.id"), nullable=True)
    status = Column(String, default="available")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class RouteModel(Base):
    __tablename__ = "routes"

    id = Column(String, primary_key=True, default=gen_uuid)
    truck_id = Column(String, ForeignKey("trucks.id"), nullable=False)
    driver_id = Column(String, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="pending")


class GPSLogModel(Base):
    __tablename__ = "gps_logs"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    route_id = Column(String, ForeignKey("routes.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())


class IncidentModel(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)
    location = Column(JSON, nullable=True)
    status = Column(String, default="reported")
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PredictionModel(Base):
    __tablename__ = "predictions"

    id = Column(String, primary_key=True, default=gen_uuid)
    sector_id = Column(String, ForeignKey("sectors.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    predicted_volume = Column(Float, nullable=False)
    confidence = Column(Float, nullable=True)
    recommendation = Column(String, nullable=True)
    factors = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class NotificationModel(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    data = Column(JSON, nullable=True)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
