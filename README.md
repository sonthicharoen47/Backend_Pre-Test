# Backend_Pre-Test

Order status = [
pending -> pending,
in-progress -> inProgress,
cancel-by-customer -> cancelByCustomer,
done -> done,
cancel-by-admin -> cancelByAdmin
]

# Api
localhost:3000/register
```json
    "account_fname": "tony",
    "account_lname": "stark",
    "email": "tony@mail.com",
    "hashPassword": "12345678"
```

localhost:3000/login
```json
    "email": "tony@mail.com",
    "hashPassword": "12345678"
```

localhost:3000/logout

localhost:3000/product/findAll

localhost:3000/product/create
```json
    "product_name": "PlayStation 5",
    "product_price": 55000
```

localhost:3000/product/search
```json
    //can null -> return all product
    "search_string": "phone"
```

localhost:3000/product/addNewPrice
```json
    "product_id": 1,
    "new_price": 15000
```

localhost:3000/order/findAll

localhost:3000/order/find/me
```json
    "order_id": 1
```

localhost:3000/order/create
```json
    "productList": [
        { "fk_product": 1, "amount": 1 },
        { "fk_product": 2, "amount": 1 }
    ] 
```

localhost:3000/order/updateOrderStatusByCustomer
```json
    "order_id": 2
```

localhost:3000/order/updateOrderStatusByAdmin
```json
    //if status = cancelByCustomer, admin can't update status
    "order_id": 1,
    "status_id": 3
```
