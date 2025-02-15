import React, { useState, useEffect, useCallback } from 'react';
import useWebSocket from 'react-use-websocket';

export const ComputePanel = () => {
    const [value, setValue] = useState(0);
    const [multiplier, setMultiplier] = useState(1);
    const [result, setResult] = useState(0);
    
    const { sendMessage, lastMessage } = useWebSocket('ws://localhost:8001/ws', {
        shouldReconnect: true,
    });

    useEffect(() => {
        if (lastMessage) {
            const data = JSON.parse(lastMessage.data);
            setResult(data.result);
        }
    }, [lastMessage]);

    const handleCompute = useCallback(() => {
        sendMessage(JSON.stringify({ value, multiplier }));
    }, [value, multiplier, sendMessage]);

    return (
        <div className="p-4">
            <div className="flex flex-col gap-4">
                <input 
                    type="number" 
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="border p-2"
                />
                <input 
                    type="number" 
                    value={multiplier}
                    onChange={(e) => setMultiplier(Number(e.target.value))}
                    className="border p-2"
                />
                <button 
                    onClick={handleCompute}
                    className="bg-blue-500 text-white p-2"
                >
                    Compute
                </button>
                <div>Result: {result}</div>
            </div>
        </div>
    );
};
