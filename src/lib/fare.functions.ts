import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  pickup: z.string().min(1).max(200),
  drop: z.string().min(1).max(200),
  carType: z.enum(["Hatchback", "Sedan", "SUV"]),
  when: z.enum(["now", "later"]),
});

export const predictFare = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("AI not configured");

    const { generateText, Output } = await import("ai");
    const { createLovableAiGatewayProvider } = await import("./ai-gateway.server");
    const gateway = createLovableAiGatewayProvider(key);

    try {
      const { output } = await generateText({
        model: gateway("google/gemini-3-flash-preview"),
        output: Output.object({
          schema: z.object({
            base: z.number().int().min(0).max(2000),
            distanceCost: z.number().int().min(0).max(5000),
            surge: z.number().int().min(0).max(2000),
            total: z.number().int().min(50).max(10000),
            distanceKm: z.number().min(0).max(200),
            confidence: z.number().min(0).max(100),
            reasoning: z.string().max(220),
          }),
        }),
        prompt: `You are an Indian on-demand car driver pricing engine in Delhi NCR. Estimate a fair INR fare for hiring a personal driver (not the car) for a one-way trip.

Pickup: ${data.pickup}
Drop: ${data.drop}
Car type: ${data.carType}
When: ${data.when === "now" ? "right now" : "scheduled later"}

Rules:
- Base driver fee: ₹80 hatchback, ₹100 sedan, ₹140 SUV
- Distance cost: ~₹30/km (estimate distance yourself from the place names)
- Time-of-day surge: 0 normally, ₹40-80 during 8-10am / 5-8pm rush
- total = base + distanceCost + surge, rounded to nearest 5
- confidence: how sure you are the distance/route is right (0-100)
- reasoning: one short sentence the user sees`,
      });

      return { ok: true as const, fare: output };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("429"))
        return { ok: false as const, error: "Too many requests, please retry." };
      if (msg.includes("402"))
        return { ok: false as const, error: "AI credits exhausted." };
      return { ok: false as const, error: "Could not predict fare right now." };
    }
  });
