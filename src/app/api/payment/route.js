import { NextResponse } from "next/server";
import { Stripe } from 'stripe';
import { v4 as uuidv4 } from 'uuid';

const stripe = new Stripe(process.env.SECRET_KEY);

export async function POST(req) { 
    const { token, product } = await req.json();
    console.log({ token, product });

    const idempotencyKey = uuidv4();

    return stripe.customers.create({
        email: token.email,
        source: token.id
    })
        .then(customer => {
            stripe.charges.create({
                customer: customer.id,
                amount: product.price * 100,
                currency: "usd",
                description: product.name,
                receipt_email: token.email
            }, { idempotencyKey }) 
        })
        .then(result => {
            return NextResponse.json({
                message: "Done!",
                result
            })
        })
        .catch(err => console.log(err)) 
} 


