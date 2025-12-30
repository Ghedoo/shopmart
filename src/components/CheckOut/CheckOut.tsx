'use client'
import React, { useRef, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from '../ui/label'
import { Input } from '../ui/input'

export default function CheckOut({ cartId }: { cartId: string }) {
  const detalistInput = useRef<HTMLInputElement | null>(null)
  const cityInput = useRef<HTMLInputElement | null>(null)
  const phoneInput = useRef<HTMLInputElement | null>(null)

  async function CheckoutSession() {
    const shippingAddress = {
      detalist: detalistInput.current?.value,
      city: cityInput.current?.value,
      phone: phoneInput.current?.value
    }

    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:3000`, {
      method: 'POST',
      body: JSON.stringify({ shippingAddress }),
      headers: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzQ1YTU4OTFkMWE3Yzk1ZmQ5NDkwNSIsIm5hbWUiOiJSYWdoZWRvbyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY1MDM5NjM2LCJleHAiOjE3NzI4MTU2MzZ9.VW3nL4LCiEStlViJ9BwoUNkeP3NxSiU2OsCDn63CWI4',
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json();
    console.log(data);

    if (data.status === 'success') {
      window.location.href = data.session.url
    }
  }


  async function cashOrder() {
    if (!cartId) {
      alert("No cart found for this user.")
      return
    }

    const shippingAddress = {
      detalist: detalistInput.current?.value,
      city: cityInput.current?.value,
      phone: phoneInput.current?.value,
    }

    try {
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
        {
          method: "POST",
          body: JSON.stringify({ shippingAddress }),
          headers: {
            token:
              "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MzQ1YTU4OTFkMWE3Yzk1ZmQ5NDkwNSIsIm5hbWUiOiJSYWdoZWRvbyIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzY1MDM5NjM2LCJleHAiOjE3NzI4MTU2MzZ9.VW3nL4LCiEStlViJ9BwoUNkeP3NxSiU2OsCDn63CWI4",
            "Content-Type": "application/json",
          },
        }
      )

      const data = await response.json()
      console.log(data)

      if (data.status === "success") {
      
        window.location.href = "/orders"
      } else {
        alert(data.message || "Failed to place cash order.")
      }
    } catch (error) {
      console.error(error)
      alert("Error placing cash order.")
    }
  }

  return <>
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full mt-4 text-lg" variant="outline">Proceed to Checkout</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Shipping Address</DialogTitle>
            <DialogDescription>
              Make sure the address is correct.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>City</Label>
              <Input ref={cityInput} id="city" />
            </div>
            <div className="grid gap-3">
              <Label>Detalist</Label>
              <Input ref={detalistInput} id="detalist" />
            </div>
            <div className="grid gap-3">
              <Label>Phone</Label>
              <Input ref={phoneInput} id="Phone" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="button" onClick={CheckoutSession}>Visa</Button>
            <Button type="button" onClick={cashOrder}>Cach</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  </>
}
