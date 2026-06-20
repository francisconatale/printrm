---
name: enterprise-architecture-orchestrator
description: |
  Architect scalable enterprise backend systems with SOLID principles, layered architecture, and clean design decisions. Make strategic architectural decisions that enable team velocity, code reuse, and maintainability.
  
  **ALWAYS TRIGGER** when discussing system design, project structure, architectural decisions, scalability challenges, or how to organize a codebase. Guide decisions on layering, decoupling, separation of concerns, and handling multiple entry points without logic duplication.
  
  Outputs: Architecture blueprints, layer design, SOLID principle application, structural patterns for your system, and strategic recommendations.
---

# Enterprise Backend Architecture: The Orchestrator

Your role: Make decisions that prevent chaos. Design systems where business logic lives in ONE place, entry points are interchangeable, and code scales without repetition.

---

## The Core Problem

**Unmaintained Code Looks Like This:**
```
Controllers calling Controllers
├── SaleRestController calls PaymentRestController  ❌
├── PaymentRestController calls InventoryController  ❌
└── Business logic scattered across 47 files
```

**Well-Architected Code Looks Like This:**
```
Multiple Entry Points → Same Business Logic
├── REST API → CreateSaleUseCase
├── Message Queue → CreateSaleUseCase  
├── CLI → CreateSaleUseCase
└── gRPC → CreateSaleUseCase
```

**Your job**: Prevent the first, design the second.

---

## SOLID Principles: Non-Negotiable Foundation

Every architectural decision must honor these five principles:

### 1. Single Responsibility Principle (SRP)
**One class, one reason to change.**

**What violates SRP**:
```java
// ❌ BAD: UserService does everything
public class UserService {
    public void createUser(UserRequest request) { ... }  // User creation
    public void sendEmail(String email, String message) { ... }  // Email sending
    public void logActivity(User user, String action) { ... }  // Logging
}
```

**SRP-Compliant Design**:
```java
// ✅ GOOD: Each class has ONE reason to change
public class CreateUserUseCase { ... }  // Changes when user creation logic changes
public class EmailService { ... }  // Changes when email requirements change
public class AuditLogger { ... }  // Changes when audit requirements change
```

**Architectural Implication**: Different layers (Controller ≠ Service ≠ Repository)

---

### 2. Open/Closed Principle (OCP)
**Open for extension, closed for modification.**

**What violates OCP**:
```java
// ❌ BAD: Adding PaymentMethod forces changes to OrderService
public class OrderService {
    public void processPayment(String method, Order order) {
        if (method.equals("CREDIT_CARD")) { ... }
        else if (method.equals("PAYPAL")) { ... }
        // Adding BANK_TRANSFER? Modify this class again
    }
}
```

**OCP-Compliant Design**:
```java
// ✅ GOOD: New payment methods = new implementations, no changes to OrderService
public interface PaymentStrategy {
    void process(Order order);
}

public class OrderService {
    private Map<PaymentMethod, PaymentStrategy> strategies;
    
    public void processPayment(PaymentMethod method, Order order) {
        strategies.get(method).process(order);  // Extensible
    }
}
```

**Architectural Implication**: Strategy pattern, Decorator pattern, plugin architecture

---

### 3. Liskov Substitution Principle (LSP)
**Subtypes must be substitutable for their base types.**

**What violates LSP**:
```java
// ❌ BAD: Subclass breaks the contract
public class Rectangle {
    public void setWidth(int width) { ... }
    public void setHeight(int height) { ... }
}

public class Square extends Rectangle {
    @Override
    public void setWidth(int width) {
        super.setWidth(width);
        super.setHeight(width);  // Violates Rectangle contract
    }
}
```

**LSP-Compliant Design**:
```java
// ✅ GOOD: Square is NOT a Rectangle, avoid inheritance
public interface Shape {
    int area();
}

public class Rectangle implements Shape { ... }
public class Square implements Shape { ... }
```

**Architectural Implication**: Prefer composition over inheritance, design interfaces carefully

---

### 4. Interface Segregation Principle (ISP)
**Clients shouldn't depend on interfaces they don't use.**

**What violates ISP**:
```java
// ❌ BAD: PaymentProcessor must implement unused methods
public interface PaymentService {
    void charge(Order order);
    void refund(Order order);
    void scheduleRecurring(Order order);
    void validateBankAccount(BankDetails details);  // Not all need this
}

public class ThirdPartyPaymentService implements PaymentService {
    @Override
    public void validateBankAccount(BankDetails details) {
        throw new UnsupportedOperationException();  // Don't support this
    }
}
```

**ISP-Compliant Design**:
```java
// ✅ GOOD: Segregated interfaces
public interface Chargeable {
    void charge(Order order);
}

public interface Refundable {
    void refund(Order order);
}

public interface RecurringPayment {
    void scheduleRecurring(Order order);
}

public class ThirdPartyPaymentService implements Chargeable, Refundable {
    // Only implement what you need
}
```

**Architectural Implication**: Design narrow, focused interfaces; avoid "god interfaces"

---

### 5. Dependency Inversion Principle (DIP)
**Depend on abstractions, not concrete classes.**

**What violates DIP**:
```java
// ❌ BAD: OrderService depends on concrete database class
public class OrderService {
    private JdbcUserRepository userRepository = new JdbcUserRepository();  // Concrete!
    
    public void createOrder(Order order) {
        userRepository.save(order);
    }
}
```

**DIP-Compliant Design**:
```java
// ✅ GOOD: OrderService depends on interface, injection provides concrete class
public class OrderService {
    private final OrderRepository repository;  // Interface, not concrete
    
    public OrderService(OrderRepository repository) {
        this.repository = repository;  // Dependency injected
    }
    
    public void createOrder(Order order) {
        repository.save(order);
    }
}
```

**Architectural Implication**: Dependency Injection (Spring @Bean), test-friendly design

---

## Clean Code as Architecture

Code is read more than it's written. Your architecture should make code readable.

### Naming Reflects Structure
```java
// ✅ Names reveal intent AND layer
CreateSaleUseCase           // What it does + layer (use case)
SaleRepository              // What it is + layer (repository)
SaleRestController          // What it controls + entry point (REST)
SaleService                 // Ambiguous - avoid this

CreateSaleCommandHandler    // Clear: command handler pattern
SaleQueryService            // Clear: read model vs write model
```

### Small, Focused Classes
```java
// ✅ Each class has ONE job
public class CreateSaleUseCase {
    public SaleResponse execute(CreateSaleRequest request) { ... }
}

// ❌ BAD: One class with multiple responsibilities
public class SaleService {
    public void createSale(SaleRequest request) { ... }
    public Sale findSale(String id) { ... }
    public void deleteSale(String id) { ... }
    public void generateSaleReport(DateRange range) { ... }
}
```

### Comments Explain WHY, Not WHAT
```java
// ❌ BAD: Obvious from code
public void process(Order order) {
    // increment counter
    counter++;
}

// ✅ GOOD: Explains business reason
public void processSaleWithExponentialBackoff(Order order) {
    // Retry with exponential backoff to handle temporary payment gateway failures
    // PaymentGateway SLA: 99.5%, so we expect ~1 failure per 200 requests
    retryWithBackoff(() -> paymentGateway.process(order));
}
```

---

## Layered Architecture: The Foundation

### Three Essential Layers

```
┌────────────────────────────────────────────────┐
│  PRESENTATION LAYER (Adapters)                 │
│  REST Controllers, gRPC Handlers, CLI, Events  │
│  Responsibility: Adapt requests to domain      │
└────────────────┬─────────────────────────────┘
                 │ (depends on)
┌────────────────▼─────────────────────────────┐
│  APPLICATION LAYER (Orchestration)           │
│  Use Cases, Services, Command Handlers       │
│  Responsibility: Business logic               │
└────────────────┬─────────────────────────────┘
                 │ (depends on)
┌────────────────▼─────────────────────────────┐
│  DATA LAYER (Persistence)                     │
│  Repositories, DAOs, ORM Models               │
│  Responsibility: Data access abstraction      │
└─────────────────────────────────────────────┘
```

**Key Rule**: Each layer depends ONLY on layers below it, through **interfaces**.

### Layer Responsibilities

#### Presentation Layer (Your Entry Points)
```java
@RestController
@RequestMapping("/api/sales")
public class CreateSaleRestController {
    private final CreateSaleUseCase useCase;
    
    @PostMapping
    public ResponseEntity<SaleResponse> create(@RequestBody SaleRequest request) {
        // 1. Validate request
        // 2. Adapt to use case format
        // 3. Call use case
        // 4. Return response
    }
}

@KafkaListener(topics = "sale-orders")
public class SaleKafkaAdapter {
    private final CreateSaleUseCase useCase;
    
    public void handleOrder(SaleOrderEvent event) {
        // 1. Parse event
        // 2. Adapt to use case format
        // 3. Call use case (SAME usecase as REST)
        // 4. Publish result
    }
}
```

**Rule**: Controllers/Adapters should NOT:
- Call other controllers ❌
- Call repositories directly ❌
- Contain business logic ❌

#### Application Layer (Your Business Logic)
```java
@Service
public class CreateSaleUseCase {
    private final SaleRepository saleRepository;
    private final InventoryService inventoryService;
    private final PaymentService paymentService;
    
    public SaleResponse execute(CreateSaleRequest request) {
        // PURE BUSINESS LOGIC
        // No HTTP, no database details
        // No Spring annotations except @Service
        
        Sale sale = new Sale(request.getProductId(), request.getQuantity());
        inventoryService.reserve(request.getProductId(), request.getQuantity());
        paymentService.charge(sale);
        Sale saved = saleRepository.save(sale);
        
        return new SaleResponse(saved.getId());
    }
}
```

**Rule**: Services/Use Cases should NOT:
- Know about HTTP ❌
- Know about which controller called them ❌
- Access Spring context directly ❌

#### Data Layer (Your Persistence)
```java
public interface SaleRepository {
    Sale save(Sale sale);
    Optional<Sale> findById(String id);
    List<Sale> findByCustomerId(String customerId);
}

@Repository
public class JdbcSaleRepository implements SaleRepository {
    // Implementation details: JDBC, JPA, MongoDB, etc.
    // Doesn't care who uses it
}
```

**Rule**: Repositories should NOT:
- Contain business logic ❌
- Know about controllers or services ❌
- Handle transactions at this level (let service handle it) ❌

---

## The Power: Reuse Without Repetition

### Same Use Case, Multiple Entry Points

```java
// Use Case: ONCE
@Service
public class CreateSaleUseCase {
    public SaleResponse execute(CreateSaleRequest request) { ... }
}

// Entry Point 1: REST API
@RestController
public class SaleRestController {
    @PostMapping("/sales")
    public ResponseEntity<SaleResponse> create(@RequestBody SaleRequest req) {
        return ResponseEntity.ok(useCase.execute(adapt(req)));
    }
}

// Entry Point 2: Message Queue
@Service
public class SaleKafkaConsumer {
    @KafkaListener(topics = "sales")
    public void onSaleEvent(SaleOrderEvent event) {
        useCase.execute(adapt(event));
    }
}

// Entry Point 3: Scheduled Job
@Scheduled(cron = "0 0 * * * *")
public void processScheduledSales() {
    useCase.execute(new CreateSaleRequest(...));
}

// Entry Point 4: CLI
@Component
public class SaleCliCommand {
    public void create(String productId, int quantity) {
        useCase.execute(new CreateSaleRequest(productId, quantity));
    }
}
```

**Result**: 
- ✅ Business logic in ONE place
- ✅ ZERO duplication
- ✅ Change logic once → affects all entry points
- ✅ Test once → all entry points inherit correctness

---

## Anti-Patterns: What NOT to Do

### 1. Controllers Calling Controllers
```java
// ❌ NEVER DO THIS
@RestController
public class OrderController {
    @Autowired private PaymentController paymentController;
    
    @PostMapping("/orders")
    public void createOrder(OrderRequest req) {
        paymentController.processPayment(req.getPayment());  // ❌ WRONG
    }
}
```

**Fix**: Both should call the same use case
```java
// ✅ CORRECT
@RestController
public class OrderController {
    @Autowired private CreateOrderUseCase useCase;
    
    @PostMapping("/orders")
    public void createOrder(OrderRequest req) {
        useCase.execute(adapt(req));
    }
}
```

### 2. Services Calling Controllers
```java
// ❌ WRONG
@Service
public class PaymentService {
    @Autowired private NotificationController notificationController;
    
    public void processPayment(Payment payment) {
        notificationController.sendNotification(...);  // ❌ Wrong direction
    }
}
```

**Fix**: Services should NOT know controllers exist
```java
// ✅ CORRECT: Use events for notifications
@Service
public class PaymentService {
    @Autowired private ApplicationEventPublisher eventPublisher;
    
    public void processPayment(Payment payment) {
        eventPublisher.publishEvent(new PaymentProcessedEvent(payment));
        // Controllers/Listeners will handle notifications
    }
}
```

### 3. Repositories with Business Logic
```java
// ❌ WRONG
@Repository
public class SaleRepository {
    public void createSaleWithInventoryCheck(Sale sale, String productId) {
        // Business logic in repository ❌
        if (inventory.hasStock(productId)) {
            save(sale);
        }
    }
}
```

**Fix**: Business logic belongs in Service/Use Case
```java
// ✅ CORRECT: Repository only knows persistence
@Repository
public class SaleRepository {
    public Sale save(Sale sale) { ... }  // Pure persistence
}

@Service
public class CreateSaleUseCase {
    public void execute(CreateSaleRequest request) {
        inventoryService.reserve(request.getProductId());  // Orchestrate in service
        saleRepository.save(sale);
    }
}
```

### 4. Scattered Business Logic
```java
// ❌ WRONG: Logic in multiple places
PaymentProcessor.charge(order);  // In OrderController
inventoryService.reserve(order);  // In InventoryService
notificationService.send(order);  // In NotificationController
auditService.log(order);  // In AuditService
```

**Fix**: Consolidate in one use case
```java
// ✅ CORRECT: Single responsibility point
@Service
public class CreateOrderUseCase {
    public void execute(CreateOrderRequest request) {
        Order order = order.create(request);
        paymentProcessor.charge(order);  // Orchestrate here
        inventoryService.reserve(order);
        notificationService.send(order);
        auditService.log(order);
    }
}
```

---

## Architectural Decisions Framework

When designing a new feature:

### 1. Identify Entry Points
- REST API? ✓
- Message Queue? ✓
- Scheduled Job? ✓
- gRPC? ✓
- All of above?

### 2. Extract Business Logic
- One use case handles ALL entry points
- Use Case ≠ HTTP, ≠ Database, ≠ Messaging

### 3. Design Adapters (Controllers)
- REST Controller: HTTP → Use Case
- Kafka Consumer: Message → Use Case
- Scheduler: Timer → Use Case
- Each adapter is simple, focused, testable

### 4. Design Repositories
- Interface defines contract (DIP)
- Multiple implementations (SQL, NoSQL, Cache)
- Single responsibility: data access

### 5. Test at the Right Level
```java
// Unit test: Pure business logic, no Spring
CreateSaleUseCaseTest { ... }

// Integration test: Use Case + Repositories + DB
CreateSaleUseCaseIntegrationTest { ... }

// Controller test: HTTP layer only
SaleRestControllerTest { ... }
```

---

## Scaling Patterns

### When CQRS Makes Sense
```
Simple Read/Write → Separate Read Model

OrderCreateCommand (Write) → OrderRepository → Database
                          ↓
                    OrderReadModel (Eventually Consistent)
                          ↑
OrderQuery (Read) ──────────────────→ OrderViewRepository
```

### When Event Sourcing Helps
```
Store events instead of state
Event Stream: UserCreated → EmailSent → PasswordChanged
Replay events → Audit trail, Event-driven architecture
```

### Microservices vs Monolith
- Start with clean monolith (layered architecture)
- When boundaries emerge, extract to microservice
- Use events/API for cross-service communication

---

## Testing Strategy Flows from Architecture

```
Controllers (Thin)          → Mock services → Fast, focused tests
├── 
Use Cases (Thick)           → Mock repositories → Core logic tested
├──
Repositories (Thin)         → Use real DB → Integration tests only
```

Better test coverage with fewer tests because logic is centralized.

---

## Summary: Your Architectural Checklist

Before coding:
- [ ] Are there 3+ entry points? → Design one use case
- [ ] Does logic repeat? → Extract to service layer
- [ ] Do controllers call controllers? → RED FLAG, consolidate logic
- [ ] Can I test a feature without Spring? → GOOD, logic is isolated
- [ ] Do I have a data layer interface? → DIP-compliant
- [ ] Could this code be reused elsewhere? → If yes, it's in right layer
- [ ] Can I explain layer boundaries in 30 seconds? → Clear architecture
