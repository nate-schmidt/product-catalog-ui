import { useState, useEffect } from "react";
import { useCart } from "../providers/CartProvider";

interface FlashProduct {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  flashPrice: number;
  discount: number;
  endsAt: Date;
}

function FlashSales() {
  const { addItem } = useCart();
  const [showModal, setShowModal] = useState(true);
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  const flashProducts: FlashProduct[] = [
    {
      id: "flash-iphone-17",
      name: "iPhone 17",
      description: "FLASH SALE - DON'T MISS OUT!!!",
      originalPrice: 999,
      flashPrice: 499,
      discount: 50,
      endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    },
    {
      id: "flash-iphone-17-pro",
      name: "iPhone 17 Pro",
      description: "INSANE DISCOUNT - LIMITED TIME ONLY!!!",
      originalPrice: 1199,
      flashPrice: 599,
      discount: 50,
      endsAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const end = flashProducts[0].endsAt.getTime();
      const diff = end - now;

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAddToCart = (product: FlashProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.flashPrice,
    });
  };

  return (
    <>
      {/* Floating Banner - Always visible */}
      <div className="fixed top-0 left-0 right-0 z-50 flash-banner">
        <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 text-white py-3 px-4 text-center font-bold text-xl animate-pulse-fast shadow-2xl border-y-4 border-yellow-300">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <span className="animate-bounce text-2xl">🔥</span>
            <span className="blink-text">⚡ FLASH SALE ⚡</span>
            <span className="text-3xl font-black bg-yellow-300 text-red-600 px-4 py-1 rounded rotate-text shadow-xl">
              50% OFF!!!
            </span>
            <span className="animate-bounce text-2xl">🔥</span>
            <div className="flex items-center gap-2 bg-black px-4 py-2 rounded-lg pulse-border">
              <span className="text-sm">ENDS IN:</span>
              <span className="text-2xl font-mono tabular-nums">
                {String(timeLeft.hours).padStart(2, "0")}:
                {String(timeLeft.minutes).padStart(2, "0")}:
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Intrusive Modal Popup */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-80 animate-fade-in">
          <div className="bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 p-2 rounded-3xl rotate-shake max-w-4xl mx-4 shadow-massive">
            <div className="bg-white rounded-2xl p-8 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-bold z-10"
              >
                ×
              </button>

              <div className="text-center mb-8">
                <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 mb-4 animate-pulse-fast">
                  🚨 FLASH SALE ALERT! 🚨
                </h2>
                <p className="text-3xl font-bold text-red-600 blink-text">
                  ⏰ LIMITED TIME OFFER ⏰
                </p>
                <div className="mt-4 inline-block">
                  <div className="bg-black text-yellow-400 px-8 py-4 rounded-xl text-5xl font-black pulse-scale">
                    {String(timeLeft.hours).padStart(2, "0")}:
                    {String(timeLeft.minutes).padStart(2, "0")}:
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {flashProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border-4 border-red-600 rounded-xl p-6 bg-gradient-to-br from-yellow-100 to-orange-100 hover:scale-105 transition-transform shadow-2xl wiggle"
                  >
                    <div className="absolute top-0 right-0 bg-red-600 text-white px-4 py-2 rounded-bl-xl text-2xl font-black rotate-text-slight">
                      -{product.discount}%
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-3 mt-4">
                      {product.name}
                    </h3>
                    <p className="text-red-600 font-bold text-lg mb-4 blink-text-slow">
                      {product.description}
                    </p>
                    <div className="mb-4">
                      <div className="flex items-center justify-center gap-4">
                        <span className="text-3xl text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                        <span className="text-5xl font-black text-red-600 animate-bounce">
                          ${product.flashPrice}
                        </span>
                      </div>
                      <div className="text-center mt-2">
                        <span className="bg-green-500 text-white px-4 py-1 rounded-full text-xl font-bold pulse-scale">
                          SAVE ${product.originalPrice - product.flashPrice}!
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg text-2xl font-black hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-xl pulse-button"
                    >
                      🛒 GRAB IT NOW! 🛒
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p className="text-2xl font-bold text-red-600 animate-bounce">
                  ⚠️ HURRY! STOCK RUNNING OUT FAST! ⚠️
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Flash Sale Section */}
      <div className="w-full mb-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400 pulse-border-slow">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
          
          <div className="text-center mb-6 relative z-10">
            <h2 className="text-5xl font-black text-white mb-4 text-shadow-lg">
              ⚡ FLASH SALE ⚡
            </h2>
            <div className="bg-black text-yellow-400 inline-block px-8 py-4 rounded-xl text-4xl font-black pulse-scale">
              {String(timeLeft.hours).padStart(2, "0")}:
              {String(timeLeft.minutes).padStart(2, "0")}:
              {String(timeLeft.seconds).padStart(2, "0")}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {flashProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl p-6 shadow-2xl transform hover:scale-105 transition-all wiggle-slow border-4 border-yellow-400"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black text-gray-900">
                    {product.name}
                  </h3>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xl font-black rotate-text-slight">
                    -{product.discount}%
                  </span>
                </div>
                <p className="text-red-600 font-bold mb-4 blink-text-slow">
                  {product.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-2xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </div>
                    <div className="text-4xl font-black text-red-600">
                      ${product.flashPrice}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg text-xl font-bold pulse-scale">
                      SAVE
                      <br />${product.originalPrice - product.flashPrice}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg text-xl font-black hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-105 shadow-xl pulse-button"
                >
                  🛒 ADD TO CART NOW! 🛒
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-fast {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 99% { opacity: 0; }
        }

        @keyframes blink-slow {
          0%, 70% { opacity: 1; }
          71%, 100% { opacity: 0.3; }
        }

        @keyframes rotate-slight {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(-1deg); }
          25% { transform: rotate(1deg); }
          50% { transform: rotate(-1deg); }
          75% { transform: rotate(1deg); }
        }

        @keyframes wiggle-slow {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(0.5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(-0.5deg); }
        }

        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          25% { transform: translateX(-5px) rotate(-2deg); }
          75% { transform: translateX(5px) rotate(2deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse-border {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(255, 255, 0, 0.8),
                        0 0 20px rgba(255, 255, 0, 0.6),
                        0 0 30px rgba(255, 255, 0, 0.4);
          }
          50% { 
            box-shadow: 0 0 20px rgba(255, 255, 0, 1),
                        0 0 40px rgba(255, 255, 0, 0.8),
                        0 0 60px rgba(255, 255, 0, 0.6);
          }
        }

        .animate-pulse-fast {
          animation: pulse-fast 1s ease-in-out infinite;
        }

        .blink-text {
          animation: blink 1s step-start infinite;
        }

        .blink-text-slow {
          animation: blink-slow 2s ease-in-out infinite;
        }

        .rotate-text {
          animation: rotate-slight 2s ease-in-out infinite;
        }

        .rotate-text-slight {
          animation: rotate-slight 3s ease-in-out infinite;
        }

        .wiggle {
          animation: wiggle 0.5s ease-in-out infinite;
        }

        .wiggle-slow {
          animation: wiggle-slow 3s ease-in-out infinite;
        }

        .pulse-scale {
          animation: pulse-scale 1.5s ease-in-out infinite;
        }

        .rotate-shake {
          animation: shake 0.5s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 2s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-in;
        }

        .pulse-border {
          animation: pulse-border 1.5s ease-in-out infinite;
        }

        .pulse-border-slow {
          animation: pulse-border 2.5s ease-in-out infinite;
        }

        .pulse-button {
          animation: pulse-scale 0.8s ease-in-out infinite;
        }

        .text-shadow-lg {
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.5),
                       0 0 20px rgba(255, 255, 255, 0.3);
        }

        .shadow-massive {
          box-shadow: 0 0 60px rgba(255, 0, 0, 0.8),
                      0 0 100px rgba(255, 165, 0, 0.6);
        }
      `}</style>
    </>
  );
}

export default FlashSales;

