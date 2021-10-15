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
{
    "email": "tony@mail.com",
    "hashPassword": "12345678"
}```


localhost:3000/login

localhost:3000/logout

localhost:3000/product/findAll

localhost:3000/product/find/me

localhost:3000/product/create

localhost:3000/product/search

localhost:3000/product/addNewPrice

localhost:3000/order/findAll

localhost:3000/order/find/me

localhost:3000/order/create

localhost:3000/order/updateOrderStatusByCustomer

localhost:3000/order/updateOrderStatusByAdmin
