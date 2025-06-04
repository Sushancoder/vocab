'use client';

export default function WordHistory({ 
    showWords, 
    setShowWords, 
    usedWords, 
    onWordSelect, 
    onWordDelete,
    isSending 
}) {
    return (
        <div className="text-xl font-bold text-center text-gray-600 mb-8 relative rounded-2xl p-2 cursor-pointer shadow-md shadow-blue-300 group"
            onMouseEnter={() => setShowWords(true)}
            onClick={() => setShowWords(!showWords)}
            onMouseLeave={() => setShowWords(false)}>
            <div> ••• </div>

            <div className={`absolute top-10 right-0 rounded-lg text-black bg-gray-200 min-w-64 z-30 border-2 border-blue-400 shadow-md shadow-blue-300 transform transition-all duration-300 ease-in-out origin-top-right ${showWords ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'} ${isSending ? 'opacity-0 cursor-not-allowed' : ''}`}>
                {(usedWords.length > 0) ? (
                    <>
                        <div className="p-3 bg-white shadow-gray-400 rounded-t-lg text-xs font-thin text-black cursor-default">
                            Click the word to know it's details or the delete button to delete it.
                        </div>
                        <div className="p-3 text-sm font-thin text-black cursor-default bg-white shadow-lg shadow-gray-400 ">
                            Total words: {usedWords.length}
                        </div>
                    </>
                ) : (
                    <div className="p-3 bg-white shadow-gray-400 rounded-t-lg text-xs font-thin text-black cursor-default">
                        Your learnt words will be shown here
                    </div>
                )}

                <div className={`overflow-x-hidden max-h-[48vh] rounded-b-lg ${isSending ? 'overflow-hidden' : 'overflow-auto'} custom-scrollbar`}>
                    {usedWords.map((word, index) => (
                        <div key={index} className={`p-3 cursor-default bg-white overflow-y-hidden overscroll-x-auto hover:bg-gray-100 border-t-2 border-blue-400 flex justify-between`}>
                            <p className="font-semibold cursor-pointer" onClick={() => onWordSelect(word)} title='Know details'>{word}</p>
                            <div className="flex items-center cursor-pointer" title='Delete'>
                                <img src="delete-2-svgrepo-com.svg" width={30} height={30} alt="delete" onClick={() => onWordDelete(word)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
} 