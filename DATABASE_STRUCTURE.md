# Ecommerce Database Structure

## Users Table
Stores authentication and user profile information.

| Column | Type | Attributes | Null | Default | Extra |
|--------|------|------------|------|---------|-------|
| id | int(11) | No | auto_increment |
| email | varchar(255) | No | unique |
| password | varchar(255) | No | 
| firstName | varchar(100) | No | '' |
| lastName | varchar(100) | No | '' |
| dateOfBirth | date | Yes | NULL |
| gender | varchar(20) | No | '' |
| profilePic | varchar(255) | No | 'https://wallpapers.com/images/hd/nike-logo-diuxayp2mn6ubbxd.jpg' |
| role | enum('user','admin') | No | 'user' |
| createdAt | timestamp | No | CURRENT_TIMESTAMP |
| updatedAt | timestamp | No | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

## Customers Table
Stores customer information for order tracking and analytics.

| Column | Type | Attributes | Null | Default | Extra |
|--------|------|------------|------|---------|-------|
| id | int(11) | No | auto_increment |
| userId | int(11) | No | 
| name | varchar(255) | No | 
| email | varchar(255) | No | unique |
| phone | varchar(20) | No | '' |
| ordersCount | int(11) | No | 0 |
| totalSpent | decimal(10,2) | No | 0.00 |
| status | enum('Active','Inactive','Banned') | No | 'Active' |
| createdAt | timestamp | No | CURRENT_TIMESTAMP |
| updatedAt | timestamp | No | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

## Categories Table
Product categorization system.

| Column | Type | Attributes | Null | Default | Extra |
|--------|------|------------|------|---------|-------|
| id | int(11) | No | auto_increment |
| name | varchar(100) | No | unique |
| description | text | Yes | NULL |
| imageUrl | varchar(255) | Yes | NULL |
| isActive | tinyint(1) | No | 1 |
| createdAt | timestamp | No | CURRENT_TIMESTAMP |
| updatedAt | timestamp | No | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

## Products Table
Main product inventory table.

| Column | Type | Attributes | Null | Default | Extra |
|--------|------|------------|------|---------|-------|
| id | int(11) | No | auto_increment |
| name | varchar(255) | No | 
| categoryId | int(11) | No | 
| gender | varchar(20) | No | 'Unisex' |
| price | decimal(10,2) | No | 
| status | varchar(50) | No | 'active' |
| currency | varchar(10) | No | '$' |
| rating | decimal(3,2) | No | 0.00 |
| reviewsCount | int(11) | No | 0 |
| description | text | No | '' |
| mainImageUrl | varchar(255) | No | '' |
| inStock | tinyint(1) | No | 1 |
| createdAt | timestamp | No | CURRENT_TIMESTAMP |
| updatedAt | timestamp | No | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

## ProductImages Table
Additional product images and color variants.

| Column | Type | Attributes | Null | Default | Extra |
|--------|------|------------|------|---------|-------|
| id | int(11) | No | auto_increment |
| productId | int(11) | No | 
| colorName | varchar(50) | Yes | NULL |
| imageUrl | varchar(255) | No | 
| isPrimary | tinyint(1) | No | 0 |
| createdAt | timestamp | No | CURRENT_TIMESTAMP |

## ProductSizes Table
Available sizes for products (supports various size formats).

| Column | Type | Attributes | Null | Default | Extra |
|--------|------|------------|------|---------|-------|
| id | int(11) | No | auto_increment |
| productId | int(11) | No | 
| sizeValue | varchar(50) | No | 
| stockQuantity | int(11) | No | 0 |
| createdAt | timestamp | No | CURRENT_TIMESTAMP |
| updatedAt | timestamp | No | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

## Orders Table
Customer order records.

| Column | Type | Attributes | Null | Default | Extra |
|--------|------|------------|------|---------|-------|
| id | int(11) | No | auto_increment |
| orderId | varchar(50) | No | unique |
| userId | int(11) | No | 
| customerId | int(11) | No | 
| totalAmount | decimal(10,2) | No | 
| paymentStatus | enum('Paid','Pending','Failed') | No | 'Paid' |
| deliveryStatus | enum('Processing','Shipped','Delivered','Cancelled') | No | 'Processing' |
| paymentMethod | varchar(50) | No | 'card' |
| orderDate | date | No | CURRENT_DATE |
| createdAt | timestamp | No | CURRENT_TIMESTAMP |
| updatedAt | timestamp | No | CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

## OrderItems Table
Individual items within orders.

| Column | Type | Attributes | Null | Default | Extra |
|--------|------|------------|------|---------|-------|
| id | int(11) | No | auto_increment |
| orderId | int(11) | No | 
| productId | int(11) | No | 
| productName | varchar(255) | No | 
| price | decimal(10,2) | No | 
| quantity | int(11) | No | 
| colorVariant | varchar(50) | Yes | NULL |
| sizeVariant | varchar(50) | Yes | NULL |
| productImageUrl | varchar(255) | Yes | NULL |
| createdAt | timestamp | No | CURRENT_TIMESTAMP |

## ShippingInfo Table
Shipping addresses for orders.

| Column | Type | Attributes | Null | Default | Extra |
|--------|------|------------|------|---------|-------|
| id | int(11) | No | auto_increment |
| orderId | int(11) | No | unique |
| fullName | varchar(255) | No | 
| email | varchar(255) | No | 
| phone | varchar(20) | No | 
| addressLine1 | varchar(255) | No | 
| addressLine2 | varchar(255) | Yes | NULL |
| city | varchar(100) | No | 
| state | varchar(100) | No | 
| zipCode | varchar(20) | No | 
| country | varchar(100) | No | 
| createdAt | timestamp | No | CURRENT_TIMESTAMP |

## Indexes
```sql
-- Users table indexes
ALTER TABLE users ADD INDEX idx_email (email);
ALTER TABLE users ADD INDEX idx_role (role);

-- Customers table indexes
ALTER TABLE customers ADD INDEX idx_userId (userId);
ALTER TABLE customers ADD INDEX idx_email (email);
ALTER TABLE customers ADD INDEX idx_status (status);

-- Products table indexes
ALTER TABLE products ADD INDEX idx_categoryId (categoryId);
ALTER TABLE products ADD INDEX idx_status (status);
ALTER TABLE products ADD INDEX idx_inStock (inStock);
ALTER TABLE products ADD INDEX idx_name (name);

-- ProductImages table indexes
ALTER TABLE product_images ADD INDEX idx_productId (productId);

-- ProductSizes table indexes
ALTER TABLE product_sizes ADD INDEX idx_productId (productId);

-- Orders table indexes
ALTER TABLE orders ADD INDEX idx_orderId (orderId);
ALTER TABLE orders ADD INDEX idx_userId (userId);
ALTER TABLE orders ADD INDEX idx_customerId (customerId);
ALTER TABLE orders ADD INDEX idx_paymentStatus (paymentStatus);
ALTER TABLE orders ADD INDEX idx_deliveryStatus (deliveryStatus);
ALTER TABLE orders ADD INDEX idx_orderDate (orderDate);

-- OrderItems table indexes
ALTER TABLE order_items ADD INDEX idx_orderId (orderId);
ALTER TABLE order_items ADD INDEX idx_productId (productId);

-- ShippingInfo table indexes
ALTER TABLE shipping_info ADD INDEX idx_orderId (orderId);
```

## Foreign Key Relationships
```sql
-- Customers
ALTER TABLE customers ADD CONSTRAINT fk_customers_user 
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;

-- Products
ALTER TABLE products ADD CONSTRAINT fk_products_category 
FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE RESTRICT;

-- ProductImages
ALTER TABLE product_images ADD CONSTRAINT fk_product_images_product 
FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE;

-- ProductSizes
ALTER TABLE product_sizes ADD CONSTRAINT fk_product_sizes_product 
FOREIGN KEY (productId) REFERENCES products(id) ON DELETE CASCADE;

-- Orders
ALTER TABLE orders ADD CONSTRAINT fk_orders_user 
FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE orders ADD CONSTRAINT fk_orders_customer 
FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE;

-- OrderItems
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order 
FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE;
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_product 
FOREIGN KEY (productId) REFERENCES products(id) ON DELETE RESTRICT;

-- ShippingInfo
ALTER TABLE shipping_info ADD CONSTRAINT fk_shipping_info_order 
FOREIGN KEY (orderId) REFERENCES orders(id) ON DELETE CASCADE;
```