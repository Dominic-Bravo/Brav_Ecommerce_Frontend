"use client"

import { useState } from "react"
import { useOrder } from "@/hooks/orders/useOrders" 
import { OrderStatusEnum } from "@/api/generated/models/orders/orderStatusEnum"
import { PaymentStatusEnum } from "@/api/generated/models/orders/paymentStatusEnum"
import { Order } from "@/api/generated/models/orders/order"
import Image from "next/image"
import { OrderDetailDrawer } from "./OrderDetailDrawer"
import { Search, ChevronDown, Package, CreditCard, Calendar } from "lucide-react"

export function OrderManagement() {
  const {
    orders,
    totalCount,
    page,
    setPage,
    hasNextPage,
    hasPreviousPage,
    searchQuery,
    setSearchQuery,
    isLoading,
    isFetching,
  } = useOrder()

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({})

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const getStatusBadge = (status: OrderStatusEnum) => {
    const styles: Record<OrderStatusEnum, string> = {
      pending: "bg-amber-50 text-amber-700 border-amber-200/80",
      processing: "bg-blue-50 text-blue-700 border-blue-200/80",
      shipped: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
      delivered: "bg-success/10 text-success border-success/20",
      cancelled: "bg-rose-50 text-rose-700 border-rose-200/80",
    }
    return styles[status] || "bg-brav-surface text-brav-charcoal border-brav-border"
  }

  const getPaymentBadge = (status: PaymentStatusEnum) => {
    const styles: Record<PaymentStatusEnum, string> = {
      pending: "bg-amber-100/70 text-amber-800 border border-amber-200",
      paid: "bg-success/10 text-success border border-success/20",
      refunded: "bg-purple-100/70 text-purple-800 border border-purple-200",
    }
    return styles[status] || "bg-brav-surface text-brav-charcoal border border-brav-border"
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 font-sans selection:bg-brav-gold/20 space-y-8">
      
      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-brav-border pb-6">
        <div className="space-y-1">
          <span className="text-xs font-sans font-semibold uppercase tracking-[0.2em] text-brav-gold">
            Administrative Suite
          </span>
          <h1 className="font-display text-3xl font-medium tracking-tight text-brav-charcoal">
            Order Management
          </h1>
          <p className="text-xs sm:text-sm text-brav-muted">
            Total Orders: <span className="font-semibold text-brav-charcoal">{totalCount}</span>
          </p>
        </div>

        <div className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number..."
            className="w-full pl-10 pr-4 py-3 bg-brav-surface border border-brav-border rounded-xl text-xs sm:text-sm text-brav-charcoal placeholder:text-brav-muted focus:outline-none focus:border-brav-gold focus:bg-brav-white focus:ring-4 focus:ring-brav-gold/10 transition-all duration-200 shadow-xs"
          />
          <Search className="w-4 h-4 text-brav-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Loading & Content States */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-brav-white border border-brav-border rounded-2xl p-6 shadow-xs animate-pulse space-y-3">
              <div className="h-4 bg-brav-surface rounded w-1/4"></div>
              <div className="h-6 bg-brav-surface rounded w-1/2"></div>
              <div className="h-4 bg-brav-surface rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-brav-surface border border-dashed border-brav-border rounded-2xl p-6 space-y-2">
          <Package className="w-8 h-8 text-brav-muted mx-auto stroke-[1.5]" />
          <p className="text-brav-charcoal font-medium text-sm">No orders found.</p>
          <p className="text-xs text-brav-muted">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="space-y-4 relative">
          {isFetching && (
            <div className="absolute inset-0 bg-brav-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center transition-all">
              <div className="w-6 h-6 border-2 border-brav-gold border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {orders.map((order: Order) => {
            const isExpanded = expandedOrders[order.id] || false

            return (
              <div
                key={order.id}
                className="bg-brav-white border border-brav-border rounded-2xl shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  
                  {/* Order Number & Date */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-display font-medium text-brav-charcoal text-lg">
                        #{order.order_number}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-3 py-1 rounded-full border uppercase tracking-wider ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-brav-muted flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-brav-muted" />
                      Placed on {new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Financials & Controls */}
                  <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-brav-muted">Payment</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-brav-charcoal uppercase">
                          {order.payment_method}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${getPaymentBadge(
                            order.payment_status
                          )}`}
                        >
                          {order.payment_status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-brav-muted">Total Amount</p>
                      <p className="text-base font-semibold text-brav-charcoal mt-0.5">
                        ${Number(order.total_amount).toFixed(2)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedOrderId(order.id)}
                        className="px-3.5 py-2 bg-brav-surface hover:bg-brav-white text-brav-charcoal text-xs font-semibold rounded-xl border border-brav-border transition-all"
                      >
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleExpand(order.id)}
                        className="px-4 py-2 bg-brav-charcoal hover:bg-brav-dark text-brav-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5"
                      >
                        <span>{isExpanded ? "Hide Items" : `Items (${order.items?.length || 0})`}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Items Accordion */}
                {isExpanded && (
                  <div className="bg-brav-surface border-t border-brav-border p-6 space-y-4">
                    <div className="text-[11px] font-semibold text-brav-muted uppercase tracking-wider">
                      Order Breakdown ({order.items?.length || 0} items)
                    </div>

                    <div className="grid gap-3">
                      {order.items?.map((item) => {
                        const product = item.product_details
                        const primaryImage = product?.images?.find((img) => img.is_primary)?.image_url || product?.image_url;

                        return (
                          <div
                            key={item.id}
                            className="bg-brav-white border border-brav-border p-4 rounded-xl flex items-center justify-between gap-4 shadow-xs"
                          >
                            <div className="flex items-center gap-3.5">
                              <div className="relative w-12 h-12 rounded-lg bg-brav-surface border border-brav-border overflow-hidden shrink-0 flex items-center justify-center">
                                {primaryImage ? (
                                  <Image
                                    src={primaryImage}
                                    alt={product?.name || "Product image"}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                    unoptimized
                                  />
                                ) : (
                                  <span className="text-[9px] text-brav-muted font-semibold uppercase">No Img</span>
                                )}
                              </div>
                              <div className="space-y-0.5">
                                <h4 className="text-xs sm:text-sm font-semibold text-brav-charcoal">
                                  {product?.name || "Product"}
                                </h4>
                                <p className="text-xs text-brav-muted">
                                  SKU: <span className="font-medium text-brav-charcoal">{product?.sku || "N/A"}</span> | Qty: <span className="font-medium text-brav-charcoal">{item.quantity}</span> × ${Number(item.unit_price).toFixed(2)}
                                </p>
                              </div>
                            </div>

                            <div className="text-right">
                              <p className="text-[11px] text-brav-muted uppercase tracking-wider">Subtotal</p>
                              <p className="text-xs sm:text-sm font-semibold text-brav-charcoal">
                                ${Number(item.subtotal).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    <div className="pt-2 text-xs text-brav-muted font-medium border-t border-brav-border/60">
                      <span className="font-semibold text-brav-charcoal">Shipping Address:</span> {order.shipping_address || "Not specified"}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalCount > 0 && (
        <div className="flex items-center justify-between pt-6 border-t border-brav-border font-sans">
          <p className="text-xs sm:text-sm text-brav-muted">
            Page <span className="font-semibold text-brav-charcoal">{page}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage(page - 1)}
              disabled={!hasPreviousPage || isFetching}
              className="px-4 py-2 bg-brav-surface border border-brav-border rounded-xl text-xs sm:text-sm font-semibold text-brav-charcoal disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brav-white hover:border-brav-gold/40 transition-all duration-200"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage(page + 1)}
              disabled={!hasNextPage || isFetching}
              className="px-4 py-2 bg-brav-surface border border-brav-border rounded-xl text-xs sm:text-sm font-semibold text-brav-charcoal disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brav-white hover:border-brav-gold/40 transition-all duration-200"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Slide-over / Modal Drawer Overlay */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-brav-charcoal/60 backdrop-blur-xs flex justify-end font-sans">
          <div className="w-full max-w-md bg-brav-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200 z-10 border-l border-brav-border">
            
            {/* Header with Close handler */}
            <div className="flex items-center justify-between pb-4 border-b border-brav-border mb-6">
              <h2 className="font-display text-xl font-medium text-brav-charcoal">Order Details</h2>
              <button
                type="button"
                onClick={() => setSelectedOrderId(null)}
                className="text-brav-muted hover:text-brav-charcoal p-1.5 text-xs font-semibold rounded-lg hover:bg-brav-surface transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Render the Drawer Content Component */}
            <OrderDetailDrawer
              orderId={selectedOrderId}
              onClose={() => setSelectedOrderId(null)}
            />
          </div>
        </div>
      )}
      
    </div>
  )
}