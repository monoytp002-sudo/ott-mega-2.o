import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tv, ShieldCheck } from 'lucide-react';
import { OTTPlan } from '../types.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: OTTPlan[];
  removeFromCart: (index: number) => void;
  onCheckout: (plan: OTTPlan) => void;
  clearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  removeFromCart,
  onCheckout,
  clearCart,
}) => {
  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.discountedPrice, 0);
  const totalOriginal = cart.reduce((sum, item) => sum + item.originalPrice, 0);
  const totalSavings = totalOriginal - totalAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111116] border-l border-zinc-800 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-pink-500" />
              <h3 className="text-lg font-bold text-white font-['Outfit']">Your Cart</h3>
              <span className="text-xs bg-pink-500/20 text-pink-400 font-bold px-2 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-600 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white">Your cart is empty</h4>
                <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                  Browse our high-discount OTT packages and add subscriptions to your cart.
                </p>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-pink-500/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 shrink-0">
                      <Tv className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-white line-clamp-1">{item.title}</h5>
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <span className="text-pink-400 font-semibold">{item.duration}</span>
                        <span>•</span>
                        <span>{item.screens} Screen</span>
                      </div>
                      <div className="text-xs font-bold text-white mt-1">
                        ₹{item.discountedPrice}
                        <span className="text-[10px] text-zinc-500 line-through ml-1.5 font-normal">
                          ₹{item.originalPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onCheckout(item);
                        onClose();
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold transition-colors"
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-800 bg-zinc-950 space-y-4">
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal Original:</span>
                  <span className="line-through">₹{totalOriginal}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Total Discount Savings:</span>
                  <span>- ₹{totalSavings}</span>
                </div>
                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-zinc-800">
                  <span>Grand Total:</span>
                  <span className="text-pink-400">₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (cart.length > 0) {
                    onCheckout(cart[0]);
                    onClose();
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-pink-500/25 cursor-pointer"
              >
                <span>Proceed to Buy</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                <button
                  onClick={clearCart}
                  className="text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  Clear all items
                </button>
                <div className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Instant Credentials Delivery</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
