export const ViewEvents = {
  BasketOpen: 'basket:open',
  CardSelect: 'card:select',
  CardAction: 'card:action',
  BasketItemRemove: 'basket:item-remove',
  OrderOpen: 'order:open',
  OrderPaymentSelect: 'order:payment-select',
  FormChange: 'form:change',
  OrderSubmit: 'order:submit',
  ContactsSubmit: 'contacts:submit',
  SuccessClose: 'success:close',
  ModalClose: 'modal:close',
} as const;

export type ViewEventName = (typeof ViewEvents)[keyof typeof ViewEvents];