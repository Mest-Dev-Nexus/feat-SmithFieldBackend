export const orderAmountCalc = (cartItems, deliveryRate, discount) => () => {
  const subTotal = cartItems.reduce((total, item) => {
    const itemPrice = item.product.price * item.quantity;
    return total + itemPrice;
  }, 0);
  
 
 deliveryRate = typeof deliveryRate === 'number' ? deliveryRate : 10; 
  
  let amountAfterDiscount = subTotal;
  let discountAmount = 0;
  let discountApplied = false;
  
  if (discount && discount.isActive && new Date() < new Date(discount.expiryDate)) {
    discountApplied = true;
    
    if (discount.type === 'percentage') {
     
      discountAmount = (subTotal * discount.value) / 100;
      amountAfterDiscount = subTotal - discountAmount;
    } else if (discount.type === 'fixed') {
      
      discountAmount = discount.value;
      amountAfterDiscount = subTotal - discountAmount;
      
      if (amountAfterDiscount < 0) {
        amountAfterDiscount = 0;
        discountAmount = subTotal; 
      }
    }
  }
  
  const grandTotal = amountAfterDiscount + deliveryRate;
  
  return {
    grandTotal,
    subTotal,
    deliveryCost: deliveryRate,
    amountAfterDiscount,
    discountAmount,
    discountApplied
  };
};