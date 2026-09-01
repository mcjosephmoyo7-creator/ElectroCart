import { NextRequest, NextResponse } from 'next/server';
import { OrderData } from '@/types';

// In-memory order store (demo). Persists for the lifetime of the dev server.
const orders: OrderData[] = [];

export async function GET() {
  return NextResponse.json({ success: true, count: orders.length, data: orders });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<OrderData>;

    const required = [
      'customer.fullName',
      'customer.email',
      'customer.phone',
      'shippingAddress.address',
      'shippingAddress.city',
      'shippingAddress.postalCode',
      'shippingAddress.country',
      'paymentMethod',
      'items',
    ];

    for (const field of required) {
      const parts = field.split('.');
      const value = parts.length === 2 && body?.customer
        ? (body as Record<string, Record<string, unknown>>)[parts[0]]?.[parts[1]]
        : (body as Record<string, unknown>)[parts[0]];
      if (value == null || value === '') {
        return NextResponse.json(
          { success: false, message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!body.customer?.email?.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'A valid email is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Your cart is empty' },
        { status: 400 }
      );
    }

    const order: OrderData = {
      orderId: body.orderId ?? 'SC-0000-0000-0000',
      customer: body.customer as OrderData['customer'],
      shippingAddress: body.shippingAddress as OrderData['shippingAddress'],
      paymentMethod: body.paymentMethod as string,
      items: body.items as OrderData['items'],
      subtotal: body.subtotal ?? 0,
      shippingCost: body.shippingCost ?? 0,
      total: body.total ?? 0,
      createdAt: new Date().toISOString(),
    };

    orders.push(order);

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid request body' }, { status: 400 });
  }
}