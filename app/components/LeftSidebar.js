"use client";

import ApiKeyManager from "./ApiKeyManager";
import AIModeToggle from "./AIModeToggle";

export default function LeftSidebar({ apiKey, onApiKeyChange, useAIMode, onAIModeToggle }) {
    return (
        <div
            className={` ${!apiKey ? "block" : "md:block hidden"} md:w-4/12 mb-4`}
        >
            <ApiKeyManager onApiKeyChange={onApiKeyChange} />
            <AIModeToggle
                useAIMode={useAIMode}
                onToggle={onAIModeToggle}
                hasApiKey={!!apiKey}
            />
        </div>
    );
}
