# Cart management microservice
I am stil fine tuning it and updating the repo :alien:	

## Overview

This project is self-hosted micro-service designed for scalability and maintainability, utilizing InversifyJS for dependency management and a modular architecture for easy feature addition. The cart and rule management systems are central to the application's functionality, allowing for dynamic pricing and promotions in an e-commerce context.

The main idea is to seperate the cart functionality from the platform and manage promotions and marketing for the Business.
Basic product information (SKU, Price, Name, ID, website ) can be synced from your own PIM to this microservice. The cart will always have real time product information which is independent from the backend platform.


## Sample workflow :anchor:	
1. When new product is added to cart, the microservice will create a new cart in your e-commerce and keeps the reference.
2. Now when the customer performs cart actions, the microservice will perform the calculations and applys the rules and actions defined.
3. The updated cart will be available to display in the website
4. When the customer initiates the checkout on the website, the final cart information is sent to the e-commerce and the e-commerce updates the cart and the order process remains the same.

## Architecture Overview

- **InversifyJS**: Utilized for dependency injection, promoting loose coupling and easier testing.
- **Modular Structure**: Divided into distinct modules (e.g., cart management, rule processing).
- **Service Layer**: Each module contains services that encapsulate business logic.
- **Repository Pattern**: Abstracts data access, allowing integration with various data sources.
- **Action and Condition Handlers**: Used in the rule engine to apply business rules to cart operations.



## Cart and Rule Management

### Cart Management

The cart module manages the shopping cart's state and operations, including:

- **Creating a Cart**: New carts can be created with unique identifiers.
- **Adding/Updating Items**: Items can be added or updated, recalculating the subtotal.
- **Applying Rules**: Business rules can modify the cart's total price.

### Rule Management

The rule module defines and applies business rules, including:

- **Rule Definition**: Rules consist of conditions and actions.
- **Rule Evaluation**: The `RuleEngine` evaluates rules against the cart's state.

### Available Rules and Actions currently

Rules Conditions
1. Cart Subtal
2. Quantity in Cart
3. SKU in cart

Rule Actions
1. Buy X get Y Discount
2. Fixed Amount on Cart or SKU
3. Add Free Products
4. Enable Free Shipping
5. Percentage based discount for Cart or SKU


## Adding New Modules
This feature is available to connect to your own Product Management service like Pimcore, Shopify etc and Integrate the OMS solution for creating orders via a plugin.

For example you can implement Analytics, Abandon cart marketing anything that you need to add it.

To add new modules:

1. **Create a New Module Directory**: Under `src/modules/`.
2. **Define Interfaces and Entities**: Represent the module's data structures.
3. **Implement Services**: Encapsulate the business logic.
4. **Create Repositories**: Handle data access.
5. **Bind to IoC Container**: Update the IoC container for new services.

Example of adding a new product module:

```typescript
container.bind<IProductService>(TYPES.ProductService).to(ProductService);
container.bind<IProductRepository>(TYPES.ProductRepository).to(ProductRepository);

```

## API Endpoints

### Cart Endpoints

- **Create Cart**
  - **Method**: POST
  - **Endpoint**: `/api/cart`
  - **Request Body**:
    ```json
    {
      "websiteId": "string",
      "customerGroupId": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "cartId": "string",
      "message": "Cart created successfully.",
      "cart": { /* Cart object */ }
    }
    ```

- **Add or Update Cart Item**
  - **Method**: PUT
  - **Endpoint**: `/api/cart/:cartId/items`
  - **Request Body**:
    ```json
    {
      "sku": "string",
      "quantity": number,
      "price": number
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Item added/updated successfully.",
      "cart": { /* Updated Cart object */ }
    }
    ```

- **Apply Cart Rules**
  - **Method**: POST
  - **Endpoint**: `/api/cart/:cartId/apply-rules`
  - **Response**:
    ```json
    {
      "cart": { /* Updated Cart object */ }
    }
    ```

### Rule Endpoints

- **Get All Rules**
  - **Method**: POST
  - **Endpoint**: `/api/rules/search`
  - **Request Body**:
    ```json
    {
      "websiteId": "string",
      "customerGroupId": "string"
    }
    ```
  - **Response**:
    ```json
    {
      "rules": [ /* Array of Rule objects */ ]
    }
    ```

- **Create Rule**
  - **Method**: POST
  - **Endpoint**: `/api/rules/create`
  - **Request Body**:
    ```json
    {
      "description": "string",
      "priority": number,
      "allowStacking": boolean,
      "websiteId": "string",
      "customerGroupId": "string",
      "conditions": [ /* Array of Condition objects */ ],
      "actions": [ /* Array of Action objects */ ]
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Rule created successfully",
      "rule": { /* Created Rule object */ }
    }
    ```

- **Get Rule by ID**
  - **Method**: GET
  - **Endpoint**: `/api/rules/:ruleId`
  - **Response**:
    ```json
    {
      "rule": { /* Rule object */ }
    }
    ```


# Next stuff
1. Consider shipping methods and address for condtions
2. Add exceptions for applying the rule on specific condition
3. Provide an option to remove the free products
4. Might have to keep track of applied rule to reduce calculation, since we are keeping tracking of the affected sku for the rule, update rule when sku is changed
5. Implement maximum discount amount
6. Consider providing option for selecting the Free products with auto add or manual selection of skus in rule creation
7. Possible abandond cart feature built in.
