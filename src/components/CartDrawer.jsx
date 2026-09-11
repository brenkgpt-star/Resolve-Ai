import { useState } from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Check, Truck, Tag, Sparkles } from 'lucide-react'

export default function CartDrawer({ isOpen, onClose, cartItems, onUpdateQty, onRemove, onClearCart, onOpenMarketplace }) {
  const [coupon, setCoupon] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)
  const [checkoutDone, setCheckoutDone] = useState(false)

  if (!isOpen) return null

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.qty, 0)
  const discountRate = couponApplied ? 0.10 : 0
  const discountValue = subtotal * discountRate
  const freeShippingThreshold = 99
  const isFreeShipping = subtotal >= freeShippingThreshold || cartItems.some(i => i.product.freeShipping)
  const shippingCost = subtotal === 0 ? 0 : (isFreeShipping ? 0 : 14.90)
  const total = Math.max(0, subtotal - discountValue + shippingCost)

  function handleApplyCoupon(e) {
    e.preventDefault()
    if (coupon.trim().toUpperCase() === 'RESOLVE10') {
      setCouponApplied(true)
    } else {
      alert('Cupom inválido. Experimente usar RESOLVE10 para 10% de desconto!')
    }
  }

  function handleCheckout() {
    setCheckoutDone(true)
  }

  function handleResetCheckout() {
    setCheckoutDone(false)
    onClearCart()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/70 backdrop-blur-xs flex justify-end">
      {/* Drawer panel */}
      <div 
        className="w-full max-w-md bg-stone-100 border-l-2 border-stone-900 h-full flex flex-col shadow-2xl relative animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-stone-900 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-amber-400" />
            <h2 className="font-black text-base uppercase tracking-tight">Meu Kit de Reparo</h2>
            <span className="bg-amber-400 text-stone-900 font-bold text-xs px-2 py-0.5 rounded-xs">
              {cartItems.reduce((acc, i) => acc + i.qty, 0)} itens
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 hover:bg-stone-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {checkoutDone ? (
          /* Order Complete Simulation View */
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-white">
            <div className="w-16 h-16 bg-emerald-100 border-2 border-emerald-600 rounded-full flex items-center justify-center text-emerald-600 mb-4 shadow-neo-sm">
              <Check size={32} />
            </div>
            <h3 className="text-2xl font-black text-stone-900 mb-2">
              Pedido Simulado com Sucesso!
            </h3>
            <p className="text-sm text-stone-600 max-w-xs mb-6 leading-relaxed">
              No Resolve Aí, você teria recebido esse kit completo em menos de 24h para fazer o reparo sem pagar visita técnica!
            </p>
            <div className="border-2 border-stone-900 bg-amber-50 p-4 text-left w-full text-xs space-y-1.5 mb-6">
              <div className="font-bold text-stone-900 text-sm mb-1">Resumo Simulado:</div>
              <div className="flex justify-between">
                <span>Total economizado em visita técnica:</span>
                <span className="font-bold text-emerald-700">~R$ 180,00</span>
              </div>
              <div className="flex justify-between">
                <span>Total dos materiais e ferramentas:</span>
                <span className="font-bold">R$ {total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleResetCheckout}
              className="w-full py-3 bg-stone-900 hover:bg-orange-700 text-white font-bold text-sm border-2 border-stone-900 shadow-neo neo-btn"
            >
              Voltar ao Início
            </button>
          </div>
        ) : cartItems.length === 0 ? (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 border-2 border-stone-900 bg-white flex items-center justify-center text-stone-400 mb-4 shadow-neo-sm">
              <ShoppingBag size={28} />
            </div>
            <h3 className="font-black text-lg text-stone-900 mb-1">Seu kit está vazio</h3>
            <p className="text-sm text-stone-500 mb-6 max-w-xs">
              Adicione ferramentas ou peças pelo Diagnóstico Inteligente ou explore o Marketplace.
            </p>
            <button
              onClick={() => {
                onClose()
                if (onOpenMarketplace) onOpenMarketplace()
              }}
              className="py-2.5 px-5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-bold text-sm border-2 border-stone-900 shadow-neo neo-btn flex items-center gap-2"
            >
              <span>Explorar Marketplace</span>
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          /* Cart with Items */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Free shipping alert */}
            <div className="bg-amber-100 border-b-2 border-stone-900 px-4 py-2.5 text-xs font-semibold text-stone-800 flex items-center gap-2">
              <Truck size={16} className="text-stone-900 shrink-0" />
              {subtotal >= freeShippingThreshold ? (
                <span>🎉 <strong>Frete Grátis ativado!</strong> Você atingiu mais de R$ 99.</span>
              ) : (
                <span>Faltam <strong>R$ {(freeShippingThreshold - subtotal).toFixed(2)}</strong> para garantir Frete Grátis!</span>
              )}
            </div>

            {/* Items list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cartItems.map(({ product, qty }) => (
                <div 
                  key={product.id}
                  className="bg-white border-2 border-stone-900 p-3 flex gap-3 shadow-neo-sm"
                >
                  <div className="w-16 h-16 bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0">
                    <span className="font-bold text-xs text-stone-600 uppercase">
                      {product.category?.slice(0, 3)}
                    </span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-stone-900 truncate mb-1">
                      {product.name}
                    </h4>
                    <div className="text-xs font-black text-stone-900 mb-2">
                      R$ {(product.price * qty).toFixed(2)}
                      {qty > 1 && (
                        <span className="text-[10px] text-stone-400 font-normal ml-1">
                          (R$ {product.price.toFixed(2)} un)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Qty controls */}
                      <div className="flex items-center border border-stone-900 bg-white">
                        <button 
                          onClick={() => onUpdateQty(product.id, qty - 1)}
                          className="px-2 py-0.5 hover:bg-stone-200 text-stone-800"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-bold">{qty}</span>
                        <button 
                          onClick={() => onUpdateQty(product.id, qty + 1)}
                          className="px-2 py-0.5 hover:bg-stone-200 text-stone-800"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* Remove */}
                      <button 
                        onClick={() => onRemove(product.id)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                        title="Remover item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon and Summary footer */}
            <div className="border-t-2 border-stone-900 bg-white p-4 space-y-3 shrink-0">
              {/* Coupon form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={13} className="absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Cupom: RESOLVE10"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    disabled={couponApplied}
                    className="w-full pl-8 pr-3 py-2 text-xs border-2 border-stone-900 uppercase font-mono tracking-wide focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={couponApplied || !coupon.trim()}
                  className={`px-3 py-2 text-xs font-bold border-2 border-stone-900 uppercase transition-colors ${
                    couponApplied
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-600'
                      : 'bg-stone-100 hover:bg-amber-400 text-stone-900'
                  }`}
                >
                  {couponApplied ? 'Aplicado ✓' : 'Aplicar'}
                </button>
              </form>

              {/* Price rows */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-stone-900">R$ {subtotal.toFixed(2)}</span>
                </div>
                {couponApplied && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Desconto (10% cupom):</span>
                    <span className="font-bold">- R$ {discountValue.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Frete:</span>
                  <span className="font-semibold text-stone-900">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase">Grátis</span>
                    ) : (
                      `R$ ${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="border-t border-stone-200 pt-2 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-stone-900">Total do Kit:</span>
                  <span className="text-xl font-black text-stone-900">
                    R$ {total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-stone-900 hover:bg-orange-700 text-white font-bold text-sm border-2 border-stone-900 shadow-neo neo-btn flex items-center justify-center gap-2"
              >
                <span>Finalizar Pedido Simulado</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
