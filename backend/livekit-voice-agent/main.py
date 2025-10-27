from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import os
from dotenv import load_dotenv

# Import our travel tools
from tools.flights_finder import flights_finder, FlightsInput
from tools.hotels_finder import hotels_finder, HotelsInput

# Load environment variables
load_dotenv(".env.local")

# Initialize FastAPI app
app = FastAPI(
    title="Travel Agent API",
    description="API for finding flights and hotels using AI-powered travel assistant",
    version="1.0.0"
)

# Pydantic models for API requests
class TravelQuery(BaseModel):
    query: str

class FlightSearchRequest(BaseModel):
    departure_airport: Optional[str] = None
    arrival_airport: Optional[str] = None
    outbound_date: Optional[str] = None
    return_date: Optional[str] = None
    adults: int = 1
    children: int = 0
    infants_in_seat: int = 0
    infants_on_lap: int = 0

class HotelSearchRequest(BaseModel):
    q: str
    check_in_date: str
    check_out_date: str
    sort_by: Optional[str] = None
    adults: int = 1
    children: int = 0
    rooms: int = 1
    hotel_class: Optional[str] = None

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to the Travel Agent API", "docs": "/docs"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Flight search endpoint
@app.post("/flights/search")
async def search_flights(request: FlightSearchRequest):
    try:
        # Create FlightsInput from request
        params = FlightsInput(
            departure_airport=request.departure_airport,
            arrival_airport=request.arrival_airport,
            outbound_date=request.outbound_date,
            return_date=request.return_date,
            adults=request.adults,
            children=request.children,
            infants_in_seat=request.infants_in_seat,
            infants_on_lap=request.infants_on_lap
        )
        
        # Invoke the flights finder tool
        result = flights_finder.invoke(params.model_dump())
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching flights: {str(e)}")

# Hotel search endpoint
@app.post("/hotels/search")
async def search_hotels(request: HotelSearchRequest):
    try:
        # Create HotelsInput from request
        params = HotelsInput(
            q=request.q,
            check_in_date=request.check_in_date,
            check_out_date=request.check_out_date,
            sort_by=request.sort_by,
            adults=request.adults,
            children=request.children,
            rooms=request.rooms,
            hotel_class=request.hotel_class
        )
        
        # Invoke the hotels finder tool
        result = hotels_finder.invoke(params.model_dump())
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching hotels: {str(e)}")

# Run the server
if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
        log_level="info"
    )