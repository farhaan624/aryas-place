import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY ?? "placeholder";
export const stripe = new Stripe(key, {
  apiVersion: "2026-03-25.dahlia",
  typescript: true,
});
