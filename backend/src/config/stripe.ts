import Stripe from "stripe";
import { config } from "dotenv";

config({ path: "./.env" });

// Initialize Stripe with secret key (only if key is provided and valid)
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const isMockPayments = process.env.PAYMENTS_MOCK === "true";

let stripe: Stripe | null = null;

if (stripeSecretKey && stripeSecretKey.startsWith("sk_")) {
  try {
    stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
    console.log("✅ Stripe initialized successfully");
  } catch (error) {
    console.error("❌ Failed to initialize Stripe:", error);
  }
} else if (!isMockPayments) {
  console.warn(
    "⚠️  Stripe not initialized: STRIPE_SECRET_KEY not configured or invalid. Stripe payment features will be disabled."
  );
} else {
  console.log("🧪 PAYMENTS_MOCK=true: Stripe SDK initialization skipped");
}

export { stripe };
