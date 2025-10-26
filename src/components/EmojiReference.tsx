import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';

export function EmojiReference() {
  const [isOpen, setIsOpen] = useState(false);

  const emojiCategories = {
    'Earth & Landscapes': ['🌍', '🌎', '🌏', '🌐', '🗺️', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️'],
    'Plants & Trees': ['🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🪴', '🌱'],
    'Flowers': ['🌺', '🌻', '🌼', '🌷', '🌹', '🥀', '🌸', '💐'],
    'Celestial': ['🌞', '🌝', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '⭐', '🌟', '✨', '⚡', '💫', '☄️'],
    'Weather': ['☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '🌈', '☔', '💧', '💦', '🌊'],
    'Mammals': ['🐶', '🐕', '🦮', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦫', '🦔', '🦇', '🐻', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾'],
    'Birds': ['🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜'],
    'Reptiles & Dinosaurs': ['🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖'],
    'Sea Creatures': ['🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🪸', '🦀', '🦞', '🦐', '🦑', '🪼'],
    'Insects & Bugs': ['🐌', '🦋', '🐛', '🐜', '🐝', '🪲', '🐞', '🦗', '🪳', '🕷️', '🕸️', '🦂', '🦟', '🪰', '🪱'],
    'Fruits': ['🍎', '🍏', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝'],
    'Vegetables': ['🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠'],
    'Baked Goods': ['🥐', '🥯', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🧈', '🥞', '🧇'],
    'Meals & Dishes': ['🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🫓', '🥪', '🥙', '🧆', '🌮', '🌯', '🫔', '🥗', '🥘', '🫕', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🦪', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🥮', '🍢', '🍡'],
    'Desserts & Sweets': ['🍧', '🍨', '🍦', '🥧', '🧁', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🍩', '🍪', '🌰', '🥜'],
    'Beverages': ['☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍺', '🍻', '🥂', '🍷', '🥃', '🍸', '🍹', '🧉', '🍾', '🧊'],
    'Sports': ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🎽', '🛹', '🛼', '🛷', '⛸️', '🥌', '🎿', '🏂', '🪂', '🏋️', '🤸', '🤺', '🤾', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚴', '🚵'],
    'Games & Entertainment': ['🎯', '🎮', '🕹️', '🎰', '🎲', '🧩', '♟️', '🎭', '🎨', '🧵', '🪢', '🧶'],
    'Musical Instruments': ['🎼', '🎤', '🎧', '🎷', '🪗', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🪘'],
    'Vehicles - Ground': ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🛺'],
    'Vehicles - Rail': ['🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉'],
    'Vehicles - Air & Sea': ['✈️', '🛫', '🛬', '🛩️', '💺', '🚁', '🛰️', '🚀', '🛸', '🚢', '⛴️', '🛥️', '🚤', '⛵', '🛶', '⚓', '🪝', '⛽', '🚧'],
    'Buildings': ['🏰', '🏯', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪'],
    'Mystical & Magic': ['💎', '🔮', '🪄', '🧿', '🪬', '🔭', '🔬', '⚗️'],
    'Tools & Instruments': ['⚒️', '🛠️', '🔨', '🪛', '⛏️', '🪚', '🔧', '🪝', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🧰', '🧲', '🪜'],
    'Medical': ['🕳️', '🩹', '🩺', '💊', '💉', '🩸', '🧬', '🦠', '🧫', '🧪', '🌡️'],
    'Household': ['🧹', '🪠', '🧺', '🧻', '🪣', '🧼', '🫧', '🪥', '🧽', '🧴', '🛎️', '🔑', '🗝️', '🪤', '🛋️', '🪑', '🚪', '🪟', '🪞', '🖼️', '🪆', '🪅', '🧧', '🎎', '🎏', '🎐', '🎁', '🎀', '🪩', '📯', '🔔', '🔕'],
    'Weapons & Combat': ['🔪', '🗡️', '⚔️', '🔫', '🪃', '🏹', '🛡️'],
    'Stars & Energy': ['💫', '✨', '🌟', '⭐', '🌠', '🌌', '☄️', '💥', '🔥', '🌪️', '🌈', '☀️', '🌙'],
    'Hearts & Love': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝'],
    'Zodiac & Spiritual': ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔯', '✡️', '☸️', '☯️', '✝️', '☦️', '☪️', '☮️', '🕎', '♾️', '⚛️', '🕉️', '⚕️', '♻️', '⚜️', '🔱'],
    'Symbols': ['📛', '🔰', '⭕', '✅', '☑️', '✔️', '❌', '❎', '➕', '➖', '➗', '➰', '➿', '〽️', '✳️', '✴️', '❇️', '‼️', '⁉️', '〰️', '©', '®', '™', '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'],
  };

  return (
    <>
      {/* Help button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 left-8 z-50 bg-white/80 hover:bg-white/90 backdrop-blur-xl border border-white/50 rounded-full p-3 shadow-xl transition-all"
      >
        <HelpCircle size={20} className="text-slate-700" />
      </motion.button>

      {/* Reference modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[900px] md:max-h-[85vh] z-50 bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-slate-900">Emoji Reference</h3>
                  <p className="text-sm text-slate-500 mt-1">Type any emoji or keyword to create worlds</p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-700" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid gap-4">
                  {Object.entries(emojiCategories).map(([category, emojis]) => (
                    <div key={category} className="bg-slate-50/50 rounded-2xl p-4">
                      <div className="text-sm text-slate-600 mb-3">{category}</div>
                      <div className="flex flex-wrap gap-2">
                        {emojis.map((emoji, i) => (
                          <div
                            key={i}
                            className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-xl cursor-default"
                          >
                            {emoji}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-slate-200 bg-slate-50/50">
                <p className="text-xs text-slate-500 text-center">
                  Mix and match emojis to create unique world combinations! 
                  Type words like "tree", "fire", "ocean" or paste emojis directly.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
