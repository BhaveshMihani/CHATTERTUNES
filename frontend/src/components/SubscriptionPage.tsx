import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { useUser, useAuth } from "@clerk/clerk-react";
import { FaCalendarWeek, FaCalendarAlt, FaCalendarCheck } from "react-icons/fa";
import { cn } from "@/lib/utils";
import Topbar from "@/components/Topbar";

const CONFIG = {
  prices: {
    weekly: "pri_01jpmjme49mny8xca4s1ffpcea",
    monthly: "pri_01jpmjvxvvef48dyheyk9yhqy6",
    yearly: "pri_01jpmjywbr1cy71jx0af7jdxps",
  },
};

const SubscriptionPlans: React.FC = () => {
  const plans = [
    {
      title: "Weekly Plan",
      price: "Rs.14",
      priceId: CONFIG.prices.weekly,
      icon: <FaCalendarWeek size={40} className="text-blue-400" />,
    },
    {
      title: "Monthly Plan",
      price: "Rs.75",
      priceId: CONFIG.prices.monthly,
      icon: <FaCalendarAlt size={40} className="text-blue-400" />,
    },
    {
      title: "Yearly Plan",
      price: "Rs.900",
      priceId: CONFIG.prices.yearly,
      icon: <FaCalendarCheck size={40} className="text-blue-400" />,
    },
  ];

  const { user } = useUser();
  const { userId } = useAuth();

  const handlePayment = async (priceId: string) => {
    if (window.Paddle) {
      window.Paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        customer: { email: user?.primaryEmailAddress?.emailAddress },
        customData: { userId: userId },
      });
    }
  };

  return (
    <div className="bg-zinc-900 text-zinc-100 min-h-screen">
      <Topbar />
      <div className="p-8 flex flex-col items-center space-y-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white">Subscription</h1>
          <p className="text-lg text-gray-400 mt-10">
            Explore our plans and choose the one that suits you best.
          </p>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className="p-8 border border-zinc-700 shadow-lg rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-900 hover:scale-105 hover:shadow-xl transition-transform space-y-4"
            >
              <h3 className="text-xl font-semibold text-white text-center">
                {plan.title}
              </h3>
              <CardContent className="text-center flex flex-col items-center space-y-3">
                {plan.icon}
                <p className="text-lg text-gray-400">{plan.price}</p>
                <Button
                  onClick={() => handlePayment(plan.priceId)}
                  className={`${cn(
                    buttonVariants({ variant: "outline" })
                  )} text-white`}
                >
                  Subscribe Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
