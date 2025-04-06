import { createContext, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useChatStore } from "@/stores/useChatStore";

const SubscriptionContext = createContext({ isSubscribed: false });

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useUser();
    const { fetchSubscriptionStatus } = useChatStore();
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        if (user) {
            (async () => {
                const status = await fetchSubscriptionStatus(user.id);
                setIsSubscribed(status);
            })();
        }
    }, [user, fetchSubscriptionStatus]);

    return (
        <SubscriptionContext.Provider value={{ isSubscribed }}>
            {children}
        </SubscriptionContext.Provider>
    );
};

export const useSubscription = () => useContext(SubscriptionContext);
