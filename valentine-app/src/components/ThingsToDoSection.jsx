import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ThingsToDoSection({ items, themeColors }) {
  const [completedMap, setCompletedMap] = useState({});

  if (!items || items.length === 0) return null;

  const toggleItem = (id) => {
    setCompletedMap(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const primaryColor = themeColors?.primary || '#e11d48';

  return (
    <section className="py-20 px-4 md:px-8 text-center max-w-5xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif" style={{ color: primaryColor }}>
          Things I wanna do with you ✨
        </h2>
        <p className="text-slate-500 max-w-md mx-auto text-sm">
          A special bucket list of adventures, experiences, and little moments I can't wait to share with you.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, idx) => {
          const isDone = completedMap[item.id] || item.completed;
          return (
            <motion.div
              key={item.id || idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -8 }}
              onClick={() => toggleItem(item.id)}
              className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 cursor-pointer relative group flex flex-col h-full text-left transition-all duration-300"
            >
              {/* Image Header */}
              {item.imageUrl ? (
                <div className="h-44 w-full overflow-hidden relative">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                </div>
              ) : (
                <div className="h-28 w-full bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center">
                  <span className="text-4xl text-rose-300 transition-transform duration-300 group-hover:scale-110">🌸</span>
                </div>
              )}

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className={`text-base font-bold mb-1.5 transition-all font-sans leading-snug ${isDone ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.title || 'Adventure Item'}
                  </h3>
                  {item.description && (
                    <p className={`text-xs transition-all leading-relaxed ${isDone ? 'text-slate-300 line-through' : 'text-slate-500'}`}>
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Interactive Indicator */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                  <span className={`text-[10px] uppercase tracking-wider font-bold transition-colors ${isDone ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {isDone ? 'Completed' : 'Click to check'}
                  </span>
                  <motion.div
                    animate={isDone ? { scale: [1, 1.3, 1] } : {}}
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      isDone 
                        ? 'bg-emerald-500 border-emerald-500 text-white' 
                        : 'border-slate-300 group-hover:border-rose-300'
                    }`}
                  >
                    {isDone ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span className="text-[10px] opacity-0 group-hover:opacity-100 text-rose-400">❤️</span>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
