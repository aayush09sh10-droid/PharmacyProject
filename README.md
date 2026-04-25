# PharmacyProject

Pharmacy marketplace project with three roles:

- `Customer`
- `Vendor`
- `Admin`

## Apps

- `Frontend`
  Customer-facing React app
- `Backend-Admin`
  User/admin backend
- `PP@/backend`
  Vendor/orders/products backend

## Main Features

- Customer registration and login
- Admin registration and login
- Vendor registration and login
- Product listing and vendor inventory management
- Cart and cash-on-delivery checkout
- Customer order history
- Vendor dashboard, products, inventory, and order management
- Admin dashboard for users, vendors, orders, payments, and reports
- AI assistant fallback handling when Gemini quota is unavailable

## Recent Improvements

### Orders

- Customer can cancel eligible orders
- Vendor and admin can see cancellation details
- Cancelled orders can be filtered separately
- Search added for customer orders and vendor orders

### Admin Tables

- Search works across the full loaded dataset
- Pagination added with `10` entries per page
- Orders page supports `All`, `Active`, and `Cancelled` views

### Notifications

Role-based notifications were added:

- Customer gets notified when vendor updates order status
- Vendor gets notified when:
  - a new order is placed
  - a customer cancels an order
  - admin approves the vendor account
- Admin gets notified when:
  - a new user registers
  - a new vendor registers
  - a new order is placed
  - a customer cancels an order
  - a vendor updates an order status

Notification bells are connected in:

- Customer header
- Admin dashboard top bar
- Vendor portal top bar

## UI Improvements

- Vendor portal theme refreshed
- Vendor mobile menu moved to the left side
- Search result count now appears only after typing
- Improved mobile responsiveness for admin and vendor screens

## Important Notes

- Restart both backends after backend changes
- Restart frontend after frontend changes
- Current admin pagination/search is frontend-side on loaded data
- For extremely large datasets, server-side pagination/search would be the next upgrade

## Suggested Run Order

Run these apps in separate terminals:

1. `PharmacyProject/Backend-Admin`
2. `PharmacyProject/PP@/backend`
3. `PharmacyProject/Frontend`

## Security Note

Environment files currently contain real-looking secrets. Rotate exposed credentials before production use.
