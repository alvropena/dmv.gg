import { useState, useEffect } from "react";

export function useTimer(startTime: Date) {
    const [elapsedTime, setElapsedTime] = useState<string>("00:00");

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            const diffMs = now.getTime() - startTime.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            const diffSecs = Math.floor((diffMs % 60000) / 1000);
            setElapsedTime(
                `${diffMins.toString().padStart(2, "0")}:${diffSecs
                    .toString()
                    .padStart(2, "0")}`
            );
        }, 1000);

        return () => clearInterval(timer);
    }, [startTime]);

    return elapsedTime;
} 