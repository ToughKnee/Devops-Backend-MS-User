```mermaid
sequenceDiagram
    participant Mobile
    participant Web
    participant US as User Service
    participant MW as Middleware
    participant DB as Database
    participant NS as Notification Service
    participant ES as Email Service

    %% Mobile User Registration Flow
    rect rgb(0, 0, 0)
    Note over Mobile,ES: Mobile User Registration Flow
    Mobile->>US: POST /auth/register (with Auth Token)
    activate US
    
    US->>MW: Validate Auth Token
    MW-->>US: Token Valid
    
    US->>DB: Check if user exists
    DB-->>US: User not found
    US->>DB: Create user (is_active=false)
    DB-->>US: User created
    
    US->>NS: Request email verification
    NS->>ES: Send verification email
    ES-->>Mobile: Email sent
    US-->>Mobile: 201 - Check email
    deactivate US

    Mobile->>NS: Verify Email
    NS->>US: Email Verified Webhook
    US->>DB: Update user (is_active=true)
    end

    %% Web Admin Registration Flow
    rect rgb(0, 0, 0)
    Note over Web,ES: Web Admin Registration Flow
    Web->>US: POST /admin/register (with Auth & Validation Tokens)
    activate US
    
    US->>MW: Validate Auth Token
    MW-->>US: Token Valid
    US->>MW: Validate Admin Role from Validation Token
    MW-->>US: Role Valid
    
    alt Not Admin Role
        US-->>Web: 401 - Unauthorized
    else Is Admin
        US->>DB: Check if admin exists
        DB-->>US: Admin not found
        US->>DB: Create admin (is_active=false)
        DB-->>US: Admin created
        
        US->>NS: Request email verification
        NS->>ES: Send verification email
        ES-->>Web: Email sent
        US-->>Web: 201 - Check email
    end
    deactivate US

    Web->>NS: Verify Email
    NS->>US: Email Verified Webhook
    US->>DB: Update admin (is_active=true)
    end