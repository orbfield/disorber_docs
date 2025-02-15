# Hybrid Django-FastAPI Architecture

## Overview

A high-performance data analytics platform combining Django's robust ecosystem with FastAPI's async capabilities.

```
[React Frontend] 
       ↓
    [Nginx]
    ↙     ↘
[Django]  [FastAPI]
    ↘     ↙
 [PostgreSQL/Redis]
```

## Service Responsibilities

### Django (8000)
- Authentication & Authorization
- User Management
- Admin Interface
- Data Model Management
- Monitoring & Metrics
- File Storage
- Background Tasks (Celery)
- API Documentation

### FastAPI (8001)
- Real-time Computations
- WebSocket Connections
- Data Streaming
- Interactive Visualizations
- Parameter Validation (Param)
- High-Performance Data Processing
- GPU Acceleration Support
- DataShader Integration

### React Frontend (3000)
- Single Page Application
- Real-time Data Display
- WebSocket Management
- State Management (Zustand)
- Component Library
- Route Management

## Data Flow

### Authentication Flow
```
1. User → Django: Login request
2. Django: Validates credentials
3. Django → User: JWT token
4. User → FastAPI: Includes JWT in requests
5. FastAPI → Django: Token validation
6. FastAPI: Processes request if valid
```

### Computation Flow
```
1. User input → React: Parameter changes
2. React → FastAPI: WebSocket message
3. FastAPI: Validates parameters (Param)
4. FastAPI: Processes data (DataShader)
5. FastAPI → React: Streams results
6. React: Updates visualization
```

## Implementation Details

### Django Configuration
```python
# Core settings
INSTALLED_APPS = [
    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    # Custom apps
    'users',
    'analytics',
    'monitoring',
    # Third party
    'rest_framework',
    'corsheaders',
    'drf_spectacular',
]

# JWT settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

# Cache configuration
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://redis:6379/0',
    }
}
```

### FastAPI Service
```python
# Core FastAPI app
app = FastAPI(
    title="Compute Service",
    docs_url="/compute/docs",
    openapi_url="/compute/openapi.json"
)

# JWT Verification
async def verify_token(token: str) -> bool:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.DJANGO_URL}/api/token/verify/",
            json={"token": token}
        )
        return response.status_code == 200

# Websocket endpoint
@app.websocket("/ws/compute")
async def compute_websocket(
    websocket: WebSocket,
    token: str = Query(...)
):
    if not await verify_token(token):
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return
        
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_json()
            result = await process_data(data)
            await websocket.send_json(result)
    except Exception:
        await websocket.close()
```

### React Integration
```typescript
// WebSocket hook
const useComputeSocket = (token: string) => {
    const { sendMessage, lastMessage } = useWebSocket(
        `ws://localhost:8001/ws/compute?token=${token}`,
        {
            shouldReconnect: true,
            reconnectAttempts: 5,
            reconnectInterval: 3000,
        }
    );
    
    return { sendMessage, lastMessage };
};

// Computation component
const ComputeView = () => {
    const token = useAuthStore(state => state.token);
    const { sendMessage, lastMessage } = useComputeSocket(token);
    
    // Component logic
};
```

## Performance Considerations

### Django Optimizations
- Database connection pooling
- Redis caching layer
- Celery for background tasks
- Asset compression & CDN

### FastAPI Optimizations
- Async database queries
- DataShader for large datasets
- Numpy/Pandas vectorization
- GPU acceleration (CuPy)
- WebSocket message batching

### Frontend Optimizations
- React.memo for expensive renders
- Virtual scrolling for large lists
- WebSocket message debouncing
- Progressive loading
- Service Worker caching

## Deployment Architecture

```yaml
# Docker Compose configuration
services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    
  django:
    build: ./backend
    command: gunicorn core.wsgi:application
    environment:
      - DB_HOST=db
      - REDIS_HOST=redis
    
  fastapi:
    build: ./compute
    command: uvicorn main:app --workers 4
    deploy:
      replicas: 3
    
  celery:
    build: ./backend
    command: celery -A core worker
    
  db:
    image: postgres:13
    volumes:
      - postgres_data:/var/lib/postgresql/data
    
  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data
```

## Monitoring & Metrics

### Django Metrics
- Request/response times
- Database query performance
- Cache hit/miss rates
- User session analytics
- API endpoint usage

### FastAPI Metrics
- Computation times
- WebSocket connection stats
- Memory usage
- GPU utilization
- Error rates

### Frontend Metrics
- Component render times
- Network request latency
- WebSocket reliability
- User interactions
- Error tracking

## Development Workflow

1. API Development
   - Django: REST endpoints, models, admin
   - FastAPI: Computation endpoints, WebSockets
   - Shared: OpenAPI documentation

2. Frontend Development
   - Component development
   - State management
   - WebSocket integration
   - Error handling

3. Testing
   - Django: Unit tests, API tests
   - FastAPI: Performance tests
   - Frontend: Component tests
   - E2E: Integration tests

## Scaling Strategy

### Horizontal Scaling
- FastAPI workers behind load balancer
- Django instances for API traffic
- Redis cluster for caching
- PostgreSQL read replicas

### Vertical Scaling
- GPU acceleration for computations
- Memory optimization
- Database indexing
- Query optimization

## Security Considerations

1. Authentication
   - JWT token validation
   - Token refresh strategy
   - Session management

2. API Security
   - Rate limiting
   - CORS configuration
   - Input validation
   - SQL injection prevention

3. WebSocket Security
   - Token verification
   - Message validation
   - Connection limits
   - Timeout handling

## Error Handling

1. Backend Errors
   - Structured error responses
   - Error logging
   - Retry mechanisms
   - Circuit breakers

2. Frontend Errors
   - Error boundaries
   - Retry logic
   - User feedback
   - Offline support

## Documentation

1. API Documentation
   - OpenAPI/Swagger
   - Authentication guide
   - Endpoint examples
   - Error codes

2. Frontend Documentation
   - Component storybook
   - State management
   - WebSocket protocol
   - Error handling

## Future Considerations

1. Scalability
   - Kubernetes deployment
   - Service mesh
   - Global distribution
   - Edge computing

2. Features
   - Real-time collaboration
   - Data versioning
   - Export capabilities
   - Advanced visualizations

3. Performance
   - GraphQL integration
   - WebAssembly modules
   - Worker threads
   - Static optimization
