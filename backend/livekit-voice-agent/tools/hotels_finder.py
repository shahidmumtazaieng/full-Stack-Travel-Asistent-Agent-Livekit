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


class HotelsInput(BaseModel):
    q: str = Field(description='Location of the hotel')
    check_in_date: str = Field(description='Check-in date. The format is YYYY-MM-DD. e.g. 2024-06-22')
    check_out_date: str = Field(description='Check-out date. The format is YYYY-MM-DD. e.g. 2024-06-28')
    sort_by: Optional[str] = Field(default=None, description='Parameter is used for sorting the results. Default is sort by highest rating')
    adults: int = Field(default=1, description='Number of adults. Default to 1.')
    children: int = Field(default=0, description='Number of children. Default to 0.')
    rooms: int = Field(default=1, description='Number of rooms. Default to 1.')
    hotel_class: Optional[str] = Field(
        default=None, description='Parameter defines to include only certain hotel class in the results. for example- 2,3,4')


@tool
def hotels_finder(params: HotelsInput) -> Dict[str, Any]:
    '''
    Find hotels using the Google Hotels engine.

    Args:
        params (HotelsInput): Hotel search parameters

    Returns:
        dict: Hotel search results.
    '''
    
    if not SERPAPI_AVAILABLE:
        return {"error": "SerpAPI is not available. Please install serpapi package."}
    
    if not os.environ.get('SERPAPI_API_KEY'):
        return {"error": "SERPAPI_API_KEY environment variable is not set."}

    search_params = {
        'api_key': os.environ.get('SERPAPI_API_KEY'),
        'engine': 'google_hotels',
        'hl': 'en',
        'gl': 'us',
        'q': params.q,
        'check_in_date': params.check_in_date,
        'check_out_date': params.check_out_date,
        'currency': 'USD',
        'adults': params.adults,
        'children': params.children,
        'rooms': params.rooms,
        'sort_by': params.sort_by,
        'hotel_class': params.hotel_class
    }

    try:
        if SERPAPI_AVAILABLE and serpapi is not None:
            search = serpapi.search(search_params)
            results = search.data
            return {"hotels": results.get('properties', [])[:5]}
        else:
            return {"error": "SerpAPI is not available."}
    except Exception as e:
        return {"error": str(e)}