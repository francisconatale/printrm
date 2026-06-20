---
name: design-patterns-hf
description: |
  Apply Gang of Four + Head First Design Patterns to solve everyday coding problems. Identify code smells and implement patterns with clean, testable Java code and Spring annotations.
  
  **ALWAYS TRIGGER** when discussing code structure, refactoring, design issues, or "how to code" something. Identify if a problem needs a pattern and show concrete examples with Spring. If discussing system architecture or layer boundaries, reference `enterprise-architecture-orchestrator` skill.
  
  Outputs: Production-ready Java code with Spring, clear examples, and when to apply each pattern.
---

# Design Patterns: How to Code Solutions

Quick reference for the 23 Gang of Four patterns plus Head First patterns. Each with Java/Spring examples.

---

## Pattern Quick Reference

### Creational Patterns (How to Create Objects)

| Pattern | Problem | Solution | Spring Support |
|---------|---------|----------|---|
| **Factory Method** | Object creation scattered | Single responsibility for creation | @Bean methods |
| **Abstract Factory** | Multiple families of objects | Interface for families | @Configuration classes |
| **Singleton** | Only one instance ever | Private constructor + static instance | @Bean(scope="singleton") |
| **Builder** | Many constructor parameters | Fluent object assembly | Lombok @Builder |
| **Prototype** | Expensive object creation | Clone existing objects | Object.clone() |

### Structural Patterns (How to Compose Objects)

| Pattern | Problem | Solution | Spring Support |
|---------|---------|----------|---|
| **Adapter** | Incompatible interfaces | Wrapper with conversion | Custom @Component |
| **Decorator** | Add behavior without subclass | Wrap with same interface | Composition |
| **Facade** | Complex subsystem | Simple unified interface | @Service wrapper |
| **Proxy** | Control access to object | Surrogate that delegates | @Transactional, AOP |
| **Bridge** | Separate abstraction/implementation | Interface for both sides | Multiple @Bean implementations |
| **Composite** | Tree structures | Recursive composition | Recursive data structures |
| **Flyweight** | Many similar objects | Share immutable state | Cache immutable objects |

### Behavioral Patterns (How to Interact)

| Pattern | Problem | Solution | Spring Support |
|---------|---------|----------|---|
| **Strategy** | Varying algorithms | Encapsulate in objects | @Component + Map lookup |
| **State** | State machine mess | One class per state | Enum or State interface |
| **Command** | Encapsulate operations | Object represents action | @Service command objects |
| **Observer** | Notify multiple objects | Publish/Subscribe | Spring Events |
| **Template Method** | Common algorithm structure | Abstract class with hooks | Base service class |
| **Iterator** | Access collection elements | Uniform traversal | Java's Iterator/Stream |
| **Interpreter** | Build languages | Grammar as classes | Parser implementations |
| **Mediator** | Reduce object coupling | Central coordinator | @Service with dependencies |
| **Chain of Responsibility** | Pass request along chain | Linked handlers | Filter chains, handlers |
| **Memento** | Capture/restore state | Save state object | Serialization, snapshots |
| **Visitor** | Add operations to structures | Visitor applies operations | Double dispatch pattern |

---

## Code Smell → Pattern Matrix

When you see this problem → Use this pattern:

```
"I have an if/else with 5+ branches"
├─ Strategy Pattern (if branches = algorithms)
├─ State Pattern (if branches = state transitions)
└─ Visitor Pattern (if branches = operations on objects)

"Object creation is complex/scattered everywhere"
├─ Factory Method (subclasses decide what to create)
├─ Abstract Factory (families of related objects)
└─ Builder (many constructor parameters)

"We have one critical shared resource"
└─ Singleton (ensure only one instance)

"Need to notify multiple objects of changes"
└─ Observer Pattern (Spring Events)

"This interface doesn't match what I need"
└─ Adapter Pattern (wrapper with translation)

"I want to add behavior without subclassing"
└─ Decorator Pattern (wrap with same interface)

"This subsystem is too complex to use directly"
└─ Facade Pattern (simple unified interface)

"I need lazy initialization / caching / access control"
└─ Proxy Pattern (surrogate that delegates)

"Variations in algorithm implementations"
└─ Strategy Pattern (encapsulate in pluggable objects)

"State machine with complex conditionals"
└─ State Pattern (one class per state)

"I need undo/redo functionality"
├─ Command Pattern (operations as objects)
└─ Memento Pattern (save/restore state)

"Tree structures (menus, UI, folders)"
└─ Composite Pattern (recursive composition)

"Too many similar objects, memory issue"
└─ Flyweight Pattern (share immutable state)

"Expensive operation should happen later"
└─ Proxy Pattern (lazy initialization)

"Request should pass through multiple handlers"
└─ Chain of Responsibility (linked handlers)

"Multiple related objects need coordination"
└─ Mediator Pattern (central coordinator)
```

---

## Patterns in Action: Complete Examples

### 1. Strategy Pattern (Algorithms)
**When**: Multiple ways to do something, vary at runtime

```java
// Interface: What varies
public interface PaymentStrategy {
    void process(Order order);
}

// Concrete strategies
@Component
public class CreditCardStrategy implements PaymentStrategy {
    @Override
    public void process(Order order) {
        // Credit card specific logic
    }
}

@Component
public class PayPalStrategy implements PaymentStrategy {
    @Override
    public void process(Order order) {
        // PayPal specific logic
    }
}

// Usage: Use strategy
@Service
public class PaymentProcessor {
    private final Map<PaymentMethod, PaymentStrategy> strategies;
    
    @Autowired
    public PaymentProcessor(List<PaymentStrategy> allStrategies) {
        strategies = allStrategies.stream()
            .collect(Collectors.toMap(
                this::getMethod,
                strategy -> strategy
            ));
    }
    
    public void process(Order order, PaymentMethod method) {
        PaymentStrategy strategy = strategies.get(method);
        strategy.process(order);
    }
}
```

**Test**:
```java
@Test
public void shouldUseCreditCardStrategy() {
    PaymentStrategy mockStrategy = mock(PaymentStrategy.class);
    Map<PaymentMethod, PaymentStrategy> strategies = 
        Map.of(CREDIT_CARD, mockStrategy);
    
    processor.process(order, CREDIT_CARD);
    
    verify(mockStrategy).process(order);
}
```

---

### 2. Factory Method Pattern (Object Creation)
**When**: Subclasses decide what objects to create

```java
// Abstract factory
public abstract class OrderFactory {
    
    public Order createOrder(OrderRequest request) {
        Order order = instantiateOrder(request);  // Subclass decides
        order.validate();
        return order;
    }
    
    protected abstract Order instantiateOrder(OrderRequest request);
}

// Concrete factories
@Component
public class StandardOrderFactory extends OrderFactory {
    @Override
    protected Order instantiateOrder(OrderRequest request) {
        return new StandardOrder(request);
    }
}

@Component
public class PremiumOrderFactory extends OrderFactory {
    @Override
    protected Order instantiateOrder(OrderRequest request) {
        return new PremiumOrder(request);
    }
}

// Usage
@Service
public class CreateOrderUseCase {
    private final OrderFactory orderFactory;
    
    public OrderResponse execute(CreateOrderRequest request) {
        Order order = orderFactory.createOrder(adapt(request));
        return response(order);
    }
}
```

---

### 3. Decorator Pattern (Add Behavior)
**When**: Add features without subclassing

```java
// Component interface
public interface UserRepository {
    Optional<User> findById(Long id);
}

// Concrete implementation
@Repository
public class JdbcUserRepository implements UserRepository {
    @Override
    public Optional<User> findById(Long id) {
        return findInDatabase(id);
    }
}

// Decorator: Add caching
@Component
public class CachingUserRepository implements UserRepository {
    private final UserRepository delegate;
    private final Cache cache;
    
    public CachingUserRepository(UserRepository delegate, Cache cache) {
        this.delegate = delegate;
        this.cache = cache;
    }
    
    @Override
    public Optional<User> findById(Long id) {
        return cache.getOrFetch(
            "user:" + id,
            () -> delegate.findById(id)
        );
    }
}

// Decorator: Add logging
@Component
public class LoggingUserRepository implements UserRepository {
    private final UserRepository delegate;
    private final Logger logger;
    
    @Override
    public Optional<User> findById(Long id) {
        logger.debug("Finding user: {}", id);
        Optional<User> user = delegate.findById(id);
        logger.debug("User found: {}", user.isPresent());
        return user;
    }
}

// Compose decorators
@Configuration
public class RepositoryConfig {
    @Bean
    public UserRepository userRepository(JdbcUserRepository jdbc, Cache cache) {
        UserRepository logging = new LoggingUserRepository(jdbc, logger);
        return new CachingUserRepository(logging, cache);
    }
}
```

---

### 4. Observer Pattern (Notifications)
**When**: Multiple objects need to react to changes

```java
// Event
public class UserCreatedEvent extends ApplicationEvent {
    private final User user;
    
    public UserCreatedEvent(Object source, User user) {
        super(source);
        this.user = user;
    }
    
    public User getUser() { return user; }
}

// Publisher (in service)
@Service
public class CreateUserUseCase {
    @Autowired private ApplicationEventPublisher eventPublisher;
    
    public UserResponse execute(CreateUserRequest request) {
        User user = new User(request.getEmail(), request.getName());
        userRepository.save(user);
        
        // Publish event (not coupled to listeners)
        eventPublisher.publishEvent(new UserCreatedEvent(this, user));
        
        return new UserResponse(user.getId());
    }
}

// Listeners (independent)
@Service
public class SendWelcomeEmailListener {
    @EventListener
    public void onUserCreated(UserCreatedEvent event) {
        emailService.sendWelcomeEmail(event.getUser().getEmail());
    }
}

@Service
public class InitializeUserPreferencesListener {
    @EventListener
    public void onUserCreated(UserCreatedEvent event) {
        preferencesService.initialize(event.getUser().getId());
    }
}
```

---

### 5. State Pattern (State Machine)
**When**: Complex state transitions

```java
// State interface
public interface OrderState {
    void confirm(Order order);
    void ship(Order order);
    void cancel(Order order);
}

// Concrete states
public class PendingState implements OrderState {
    @Override
    public void confirm(Order order) {
        // Validate payment
        order.setState(new ConfirmedState());
        order.emit(new OrderConfirmedEvent(order));
    }
}

public class ConfirmedState implements OrderState {
    @Override
    public void ship(Order order) {
        order.setState(new ShippedState());
        order.emit(new OrderShippedEvent(order));
    }
    
    @Override
    public void cancel(Order order) {
        throw new InvalidStateException("Cannot cancel confirmed order");
    }
}

public class ShippedState implements OrderState {
    // Shipped orders cannot be confirmed or canceled
    @Override
    public void confirm(Order order) {
        throw new InvalidStateException("Already shipped");
    }
}

// Context (Order)
public class Order {
    private OrderState state = new PendingState();
    
    public void confirm() {
        state.confirm(this);  // Delegate to state
    }
    
    public void ship() {
        state.ship(this);
    }
    
    void setState(OrderState newState) {
        this.state = newState;
    }
}
```

---

### 6. Command Pattern (Operations as Objects)
**When**: Treat operations as first-class objects

```java
// Command interface
public interface Command {
    void execute();
    void undo();
}

// Concrete commands
public class CreateSaleCommand implements Command {
    private final CreateSaleUseCase useCase;
    private final CreateSaleRequest request;
    private String saleId;
    
    public CreateSaleCommand(CreateSaleUseCase useCase, CreateSaleRequest request) {
        this.useCase = useCase;
        this.request = request;
    }
    
    @Override
    public void execute() {
        SaleResponse response = useCase.execute(request);
        this.saleId = response.getId();  // Store for undo
    }
    
    @Override
    public void undo() {
        saleRepository.deleteById(saleId);
    }
}

// Invoker
@Service
public class CommandExecutor {
    private final Stack<Command> history = new Stack<>();
    
    public void execute(Command command) {
        command.execute();
        history.push(command);
    }
    
    public void undo() {
        if (!history.isEmpty()) {
            history.pop().undo();
        }
    }
}
```

---

### 7. Facade Pattern (Simplify)
**When**: Complex subsystem needs simple interface

```java
// Complex subsystem parts
@Service
public class PaymentService { ... }

@Service
public class InventoryService { ... }

@Service
public class ShippingService { ... }

@Service
public class NotificationService { ... }

// Facade: One simple interface
@Service
public class CheckoutFacade {
    private final PaymentService paymentService;
    private final InventoryService inventoryService;
    private final ShippingService shippingService;
    private final NotificationService notificationService;
    
    public CheckoutResponse checkout(CheckoutRequest request) {
        // Client doesn't need to know about all these services
        Payment payment = paymentService.process(request.getPaymentInfo());
        Reservation reservation = inventoryService.reserve(request.getItems());
        ShipmentLabel label = shippingService.createLabel(request.getAddress());
        notificationService.notifyCustomer(request.getEmail());
        
        return new CheckoutResponse(payment, reservation, label);
    }
}
```

---

### 8. Adapter Pattern (Integrate Incompatible)
**When**: Need to use incompatible interface

```java
// External library interface
public interface ExternalPaymentGateway {
    PaymentResult payment(
        String cardToken,
        BigDecimal amount,
        String currency
    );
}

// Your domain interface
public interface PaymentStrategy {
    void process(Order order);
}

// Adapter: Bridge the gap
public class PaymentGatewayAdapter implements PaymentStrategy {
    private final ExternalPaymentGateway gateway;
    
    @Override
    public void process(Order order) {
        // Adapt Order to gateway parameters
        String cardToken = order.getPayment().getToken();
        BigDecimal amount = order.getTotalAmount();
        String currency = order.getCurrency();
        
        PaymentResult result = gateway.payment(cardToken, amount, currency);
        
        // Adapt result back to domain
        if (result.isSuccessful()) {
            order.markAsPaid(result.getTransactionId());
        } else {
            throw new PaymentFailedException(result.getErrorMessage());
        }
    }
}
```

---

### 9. Proxy Pattern (Control Access)
**When**: Need lazy init / caching / access control

```java
// Subject interface
public interface UserRepository {
    Optional<User> findById(Long id);
    List<User> findAll();
}

// Real subject
@Repository
public class DatabaseUserRepository implements UserRepository {
    // Actual database access
}

// Proxy: Adds caching layer
@Component
public class CachingUserRepository implements UserRepository {
    private final UserRepository delegate;
    private final Map<Long, User> cache = new ConcurrentHashMap<>();
    
    @Override
    public Optional<User> findById(Long id) {
        return Optional.ofNullable(
            cache.computeIfAbsent(id, key -> 
                delegate.findById(key).orElse(null)
            )
        );
    }
}

// Proxy: Adds security
@Component
public class SecureUserRepository implements UserRepository {
    private final UserRepository delegate;
    private final SecurityService securityService;
    
    @Override
    public Optional<User> findById(Long id) {
        securityService.checkAccess(id);  // Control access
        return delegate.findById(id);
    }
}
```

---

### 10. Builder Pattern (Complex Objects)
**When**: Many optional parameters

```java
// Domain object
public class User {
    private final String email;
    private final String name;
    private final Role role;
    private final String phone;
    private final Address address;
    private final LocalDate birthDate;
    
    private User(Builder builder) {
        this.email = builder.email;
        this.name = builder.name;
        this.role = builder.role;
        this.phone = builder.phone;
        this.address = builder.address;
        this.birthDate = builder.birthDate;
    }
    
    public static Builder builder() {
        return new Builder();
    }
    
    public static class Builder {
        private String email;
        private String name;
        private Role role = Role.USER;
        private String phone;
        private Address address;
        private LocalDate birthDate;
        
        public Builder email(String email) {
            this.email = email;
            return this;
        }
        
        public Builder name(String name) {
            this.name = name;
            return this;
        }
        
        public Builder role(Role role) {
            this.role = role;
            return this;
        }
        
        public User build() {
            if (email == null || name == null) {
                throw new IllegalStateException("email and name are required");
            }
            return new User(this);
        }
    }
}

// Usage
User user = User.builder()
    .email("user@example.com")
    .name("John Doe")
    .role(Role.ADMIN)
    .phone("555-1234")
    .build();
```

---

## Testing Each Pattern

```java
// Strategy: Test strategy selection
@Test
public void shouldSelectCorrectPaymentStrategy() {
    PaymentStrategy strategy = strategies.get(PaymentMethod.CREDIT_CARD);
    strategy.process(order);
    // Verify correct strategy was used
}

// Factory: Test factory decides correctly
@Test
public void shouldCreatePremiumOrderWhenCustomerIsPremium() {
    Order order = premiumFactory.createOrder(request);
    assertThat(order).isInstanceOf(PremiumOrder.class);
}

// Decorator: Test decoration doesn't break original behavior
@Test
public void cachingRepositoryShouldReturnSameResultAsOriginal() {
    Optional<User> direct = originalRepo.findById(1L);
    Optional<User> cached = cachedRepo.findById(1L);
    assertEquals(direct, cached);
}

// Observer: Test listeners were called
@Test
public void shouldPublishUserCreatedEvent() {
    captor.getAllValues().stream()
        .filter(UserCreatedEvent.class::isInstance)
        .findFirst()
        .ifPresent(event -> verify(listener).onUserCreated(event));
}
```

---

## When To Use Which Pattern

| Situation | Pattern |
|-----------|---------|
| "Subclasses decide what to create" | Factory Method |
| "Multiple families of related objects" | Abstract Factory |
| "Only one instance ever" | Singleton |
| "Many constructor parameters" | Builder |
| "Varying algorithms" | Strategy |
| "State machine" | State |
| "Encapsulate operation" | Command |
| "Notify multiple listeners" | Observer |
| "Incompatible interface" | Adapter |
| "Add behavior without subclass" | Decorator |
| "Simplify complex subsystem" | Facade |
| "Lazy init / caching / access control" | Proxy |
| "Tree structures" | Composite |
| "Many similar objects" | Flyweight |

---

## References

- Head First Design Patterns (Freeman & Robson)
- Gang of Four Design Patterns (Gamma, Helm, Johnson, Vlissides)
- For architecture decisions → see `enterprise-architecture-orchestrator` skill
