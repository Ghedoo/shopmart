'use client'
import React, { useEffect, useState } from 'react'

interface Product {
  title: string
  imageCover: string
  price: number
}

interface CartItem {
  count: number
  product: Product
  price: number
  _id: string
}

interface Order {
  _id: string
  shippingAddress?: {
    details?: string
    city?: string
    phone?: string
  }
  totalOrderPrice?: number
  paymentMethodType?: string
  isPaid?: boolean
  isDelivered?: boolean
  createdAt?: string
  user?: {
    _id: string
    name?: string
    email?: string
  }
  cartItems?: CartItem[]
}

interface OrdersProps {
  userToken: string
  userId: string
}

export default function Orders({ userToken, userId }: OrdersProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://ecommerce.routemisr.com/api/v1'
        const res = await fetch(`${API_BASE}/orders/user/${userId}`, {
          method: 'GET',
          headers: {
            token: userToken,
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json()
        console.log('User Orders API response:', data)

        if (Array.isArray(data.orders)) {
          const paidOrders = data.orders.filter((order: Order) => order.isPaid)
          setOrders(paidOrders)
        } else {
          setOrders([])
        }
      } catch (err) {
        console.error('API error, using local fallback', err)
        setOrders([
          {
            _id: 'local-1',
            isPaid: true,
            isDelivered: false,
            totalOrderPrice: 150,
            paymentMethodType: 'Cash',
            createdAt: new Date().toISOString(),
            shippingAddress: { details: 'Street 123', city: 'Dubai', phone: '0501234567' },
            cartItems: [
              { _id: 'p1', count: 2, price: 50, product: { title: 'Sample Product 1', imageCover: '/placeholder.png', price: 50 } },
              { _id: 'p2', count: 1, price: 50, product: { title: 'Sample Product 2', imageCover: '/placeholder.png', price: 50 } },
            ],
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userToken, userId])

  if (loading) return <div>Loading paid orders...</div>
  if (!orders || orders.length === 0) return <div>No paid orders found</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">My Paid Orders</h1>
      <ul className="space-y-6">
        {orders.map((order: Order) => (
          <li key={order._id} className="border p-4 rounded shadow">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethodType ?? 'N/A'}</p>
            <p><strong>Paid:</strong> {order.isPaid ? 'Yes' : 'No'}</p>
            <p><strong>Delivered:</strong> {order.isDelivered ? 'Yes' : 'Pending'}</p>
            <p><strong>Total Price:</strong> ${order.totalOrderPrice ?? 'N/A'}</p>
            <p>
              <strong>Shipping:</strong> {order.shippingAddress?.details ?? 'N/A'}, {order.shippingAddress?.city ?? 'N/A'}, {order.shippingAddress?.phone ?? 'N/A'}
            </p>
            <p><strong>Created At:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>

            <div className="mt-2">
              <strong>Products in this order:</strong>
              <ul className="ml-4 mt-1 space-y-2">
                {order.cartItems && order.cartItems.length > 0 ? (
                  order.cartItems.map((item: CartItem) => (
                    <li key={item._id} className="flex items-center space-x-4 border p-2 rounded">
                      <img
                        src={item.product?.imageCover ?? '/placeholder.png'}
                        alt={item.product?.title ?? 'Product'}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-semibold">{item.product?.title ?? 'Unknown Product'}</p>
                        <p>Price: ${item.price}</p>
                        <p>Quantity: {item.count}</p>
                        <p>Order Status: {order.isDelivered ? 'Delivered' : 'Pending'}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <li>No products in this order</li>
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
