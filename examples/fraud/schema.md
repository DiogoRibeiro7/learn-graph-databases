# Fraud graph schema

## Graph model

### Node labels

- `Customer`
- `Account`
- `Order`
- `Transaction`
- `CreditCard`
- `Address`
- `IP`
- `Device`

### Relationship types

- `OWNS_ACCOUNT` (`Customer -> Account`)
- `PLACED` (`Customer -> Order`)
- `PAID_WITH` (`Order -> CreditCard`)
- `SHIPPED_TO` (`Order -> Address`)
- `FROM_IP` (`Order -> IP`)
- `FROM_DEVICE` (`Order -> Device`)
- `TRANSFERRED_TO` (`Account -> Account`) with transfer properties:
  - `txId`
  - `amount`
  - `occurredAt`
- `INITIATED` (`Account -> Transaction`)
- `RECEIVED_BY` (`Transaction -> Account`)

## Detection strategies in this example

### Shared identifier analysis

- Customers sharing the same `IP`
- Orders sharing the same `CreditCard`
- Devices used by multiple customers

### Ring detection

- Detect transfer cycles over `Account` nodes (3 to 5 hops)
- Useful for spotting laundering-like circulation paths

### Fan-out detection

- Detect accounts sending funds to many unique recipient accounts in a short window
- Useful for burst dispersion patterns

### Velocity detection

- Detect cards used across many orders inside a tight time span
- Useful for rapid card-testing or account-takeover behavior

## Example questions

- Which customers share high-risk infrastructure (IP, device, card)?
- Which accounts participate in circular transfer paths?
- Which accounts fan out to many recipients quickly?
- Which cards show anomalous purchase velocity?
