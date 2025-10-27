import os
from typing import Optional, Dict, Any

# Initialize serpapi as None to avoid unbound variable errors
serpapi = None
SERPAPI_AVAILABLE = False

# Try to import serpapi
try:
    import serpapi
    SERPAPI_AVAILABLE = True
except ImportError:
    pass

from pydantic import BaseModel, Field
from langchain_core.tools import tool


class FlightsInput(BaseModel):
    departure_airport: Optional[str] = Field(default=None, description='Departure airport code (IATA)')
    arrival_airport: Optional[str] = Field(default=None, description='Arrival airport code (IATA)')
    outbound_date: Optional[str] = Field(default=None, description='Parameter defines the outbound date. The format is YYYY-MM-DD. e.g. 2024-06-22')
    return_date: Optional[str] = Field(default=None, description='Parameter defines the return date. The format is YYYY-MM-DD. e.g. 2024-06-28')
    adults: int = Field(default=1, description='Parameter defines the number of adults. Default to 1.')
    children: int = Field(default=0, description='Parameter defines the number of children. Default to 0.')
    infants_in_seat: int = Field(default=0, description='Parameter defines the number of infants in seat. Default to 0.')
    infants_on_lap: int = Field(default=0, description='Parameter defines the number of infants on lap. Default to 0.')


@tool
def flights_finder(params: FlightsInput) -> Dict[str, Any]:
    '''
    Find flights using the Google Flights engine.

    Args:
        params (FlightsInput): Flight search parameters

    Returns:
        dict: Flight search results.
    '''
    
    if not SERPAPI_AVAILABLE:
        return {"error": "SerpAPI is not available. Please install serpapi package."}
    
    if not os.environ.get('SERPAPI_API_KEY'):
        return {"error": "SERPAPI_API_KEY environment variable is not set."}
    
    search_params = {
        'api_key': os.environ.get('SERPAPI_API_KEY'),
        'engine': 'google_flights',
        'hl': 'en',
        'gl': 'us',
        'departure_id': params.departure_airport,
        'arrival_id': params.arrival_airport,
        'outbound_date': params.outbound_date,
        'return_date': params.return_date,
        'currency': 'USD',
        'adults': params.adults,
        'infants_in_seat': params.infants_in_seat,
        'stops': '1',
        'infants_on_lap': params.infants_on_lap,
        'children': params.children
    }

    try:
        if SERPAPI_AVAILABLE and serpapi is not None:
            search = serpapi.search(search_params)
            results = search.data.get('best_flights', [])
            return {"flights": results}
        else:
            return {"error": "SerpAPI is not available."}
    except Exception as e:
        return {"error": str(e)}