import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

declare global {
    interface Window {
        Paddle: any;
    }
}

// Paddle Configuration
const CONFIG = {
    clientToken: "test_d923dc1fccb7a92542b9409bdbf", // Replace with your Paddle client token
    prices: {
        weekly: "pri_01jpmjme49mny8xca4s1ffpcea", // Replace with your weekly price ID
        monthly: "pri_01jpmjvxvvef48dyheyk9yhqy6", // Replace with your monthly price ID
        yearly: "pri_01jpmjywbr1cy71jx0af7jdxps", // Replace with your yearly price ID
    },
};

const SubscriptionPlans: React.FC = () => {
    const plans = [
        { title: "Weekly Plan", price: "$10", priceId: CONFIG.prices.weekly },
        { title: "Monthly Plan", price: "$40", priceId: CONFIG.prices.monthly },
        { title: "Yearly Plan", price: "$400", priceId: CONFIG.prices.yearly },
    ];

    // Handle Payment
    const handlePayment = (priceId: string) => {
        if (window.Paddle) {
            window.Paddle.Checkout.open({
                items: [{ priceId, quantity: 1 }],
                customer: { email: "user@example.com" },
            });
        }
    };

    useEffect(() => {
        if (window.Paddle) {
            window.Paddle.Environment.set("sandbox");
            window.Paddle.Initialize({
                token: CONFIG.clientToken,
                eventCallback: (event: any) => {
                    console.log("Paddle event:", event);
                    if (event.name === "checkout.completed") {
                        toast.success("Payment successful!");
                    }
                },
            });
        }
    }, []);

    return (
        <div className="flex flex-col items-center space-y-6 p-6">
            <img src="/paddle-logo.png" alt="Paddle Logo" className="w-40" />
            <div className="grid gap-6 md:grid-cols-3">
                {plans.map((plan, index) => (
                    <Card key={index} className="p-4 text-center">
                        <CardContent>
                            <h3 className="text-xl font-bold">{plan.title}</h3>
                            <p className="text-lg text-gray-500">{plan.price}</p>
                            <Button
                                onClick={() => handlePayment(plan.priceId)}
                                className="mt-4 w-full"
                            >
                                Subscribe
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default SubscriptionPlans;
