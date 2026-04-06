/* TypingIndicator — three bouncing dots shown while Gemini is generating a response.
   Uses the typingBounce @keyframes already defined in index.css.
   Each dot is delayed so they bounce in sequence (wave effect). */

export default function TypingIndicator() {
    return (
        <div className="flex items-start gap-3 mb-4">
            {/* GuruAI avatar dot */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white text-xs font-bold font-display">G</span>
            </div>

            {/* Bouncing dots bubble */}
            <div className="bg-white border border-surface-300 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                <span
                    className="w-2 h-2 rounded-full bg-primary-400 inline-block"
                    style={{ animation: 'typingBounce 1.2s ease-in-out infinite', animationDelay: '0ms' }}
                />
                <span
                    className="w-2 h-2 rounded-full bg-primary-400 inline-block"
                    style={{ animation: 'typingBounce 1.2s ease-in-out infinite', animationDelay: '200ms' }}
                />
                <span
                    className="w-2 h-2 rounded-full bg-primary-400 inline-block"
                    style={{ animation: 'typingBounce 1.2s ease-in-out infinite', animationDelay: '400ms' }}
                />
            </div>
        </div>
    );
}
