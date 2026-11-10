"use client";

import { useOrderRetrieve } from "@/hooks/orders/useOrders";
import { OrderItem } from "@/api/generated/models/orders/orderItem";
import Image from "next/image";
import { useState } from "react";
import { X, ZoomIn } from "lucide-react";

interface OrderDetailDrawerProps {
  orderId: string | null;
  onClose: () => void;
}

export function OrderDetailDrawer({ orderId, onClose }: OrderDetailDrawerProps) {
  const { order, isLoading, error } = useOrderRetrieve(orderId);
  
  // State for controlling image preview lightbox
  const [previewImage, setPreviewImage] = useState<{ url: string; alt: string } | null>(null);

  if (!orderId) return null;

  // Loading state inside drawer
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center font-sans py-12">
        <div className="flex items-center gap-3 bg-brav-surface px-5 py-3 rounded-xl border border-brav-border shadow-xs">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-brav-gold border-t-transparent" />
          <p className="text-xs font-medium text-brav-charcoal">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state inside drawer
  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3 font-sans">
        <p className="text-xs text-red-600 font-semibold">Failed to load order information.</p>
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-brav-charcoal text-brav-white text-xs font-semibold rounded-xl shadow-xs"
        >
          Close Drawer
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full font-sans relative">
      
      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-1">
        
        {/* Order Meta Header summary inside drawer */}
        <div className="bg-brav-surface p-4 rounded-xl border border-brav-border space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-brav-muted">Order Number</span>
            <span className="font-semibold text-brav-charcoal">#{order.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brav-muted">Shipping Address</span>
            <span className="font-medium text-brav-charcoal text-right max-w-[200px] truncate">{order.shipping_address || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-brav-muted">Total Amount</span>
            <span className="font-semibold text-brav-charcoal">${Number(order.total_amount).toFixed(2)}</span>
          </div>
        </div>

        {/* Order Items List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-brav-muted uppercase tracking-wider">
            Items in Order ({order.items?.length || 0})
          </h3>

          <div className="space-y-3">
            {order.items?.map((item: OrderItem) => {
              const product = item.product_details;
              const imageUrl = product?.images?.find((img) => img.is_primary)?.image_url || product?.image_url;

              return (
                <div
                  key={item.id}
                  className="bg-brav-surface/50 border border-brav-border p-3.5 rounded-xl flex items-center justify-between gap-3 group hover:border-brav-gold/40 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    
                    {/* Clickable Image Thumbnail Wrapper */}
                    <button
                      type="button"
                      onClick={() => {
                        if (imageUrl) {
                          setPreviewImage({
                            url: imageUrl,
                            alt: product?.name || "Product preview",
                          });
                        }
                      }}
                      disabled={!imageUrl}
                      className="relative w-12 h-12 rounded-lg bg-brav-surface border border-brav-border overflow-hidden shrink-0 flex items-center justify-center group/thumb focus:outline-none focus:ring-2 focus:ring-brav-gold/50 cursor-pointer disabled:cursor-default"
                    >
                      {imageUrl ? (
                        <>
                          <Image
                            src={imageUrl}
                            alt={product?.name || "Product image"}
                            fill
                            sizes="48px"
                            className="object-cover transition-transform duration-300 group-hover/thumb:scale-110"
                            unoptimized
                          />
                          {/* Hover Overlay Icon */}
                          <div className="absolute inset-0 bg-brav-charcoal/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <ZoomIn className="w-4 h-4 text-brav-white" />
                          </div>
                        </>
                      ) : (
                        <span className="text-[8px] font-sans font-semibold text-brav-muted uppercase">No Img</span>
                      )}
                    </button>

                    {/* Product Details */}
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-semibold text-brav-charcoal">
                        {product?.name ?? "Unknown Product"}
                      </h4>
                      <div className="flex items-center gap-2 text-xs font-sans text-brav-muted">
                        {product?.sku && (
                          <span className="bg-brav-white border border-brav-border px-1.5 py-0.5 rounded font-mono text-[10px] text-brav-charcoal">
                            SKU: {product.sku}
                          </span>
                        )}
                        <span>Qty: {item.quantity}</span>
                        <span>•</span>
                        <span>${Number(item.unit_price).toFixed(2)} each</span>
                      </div>
                    </div>

                  </div>

                  <div className="text-right">
                    <p className="text-[10px] text-brav-muted uppercase tracking-wider">Subtotal</p>
                    <p className="text-xs sm:text-sm font-semibold text-brav-charcoal">
                      ${Number(item.subtotal).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* High-Resolution Fullscreen Image Modal Overlay */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-brav-charcoal/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-brav-white rounded-2xl border border-brav-border shadow-2xl overflow-hidden p-4 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Expanded Image Area */}
            <div className="relative aspect-square w-full bg-brav-surface rounded-xl overflow-hidden border border-brav-border">
              <Image
                src={previewImage.url}
                alt={previewImage.alt}
                fill
                priority
                className="object-contain p-2"
                unoptimized
              />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-between items-center text-xs text-brav-muted">
              <span>Click outside to close</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}