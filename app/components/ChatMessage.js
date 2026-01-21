import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ChatMessage({ message }) {
    return (
        <div
            className={`m-2 p-3 rounded-lg max-w-[80%] w-fit prose prose-sm ${message.role === 'user'
                ? 'bg-blue-500 text-white ml-auto prose-invert'
                : 'bg-gray-200 text-black mr-auto'
                }`}
        >
            {message.parts.map((part, index) => {
                if (part.type !== 'text') return null;

                const segments = part.text.split(/(<grammar>[\s\S]*?<\/grammar>)/g);

                return segments.map((segment, segIndex) => {
                    if (segment.startsWith('<grammar>') && segment.endsWith('</grammar>')) {
                        const content = segment.replace(/<\/?grammar>/g, '').trim();
                        if (!content) return null;
                        return (
                            <div key={`${index}-${segIndex}`} className="mt-3 p-3 bg-yellow-50 text-gray-800 rounded-md border-l-4 border-green-500 shadow-sm text-sm">
                                <div className="font-bold text-xs text-green-600 uppercase mb-1 tracking-wider">Grammar Feedback</div>
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                            </div>
                        );
                    }
                    return <ReactMarkdown key={`${index}-${segIndex}`} remarkPlugins={[remarkGfm]}>{segment}</ReactMarkdown>;
                });
            })}
        </div>
    );
}
