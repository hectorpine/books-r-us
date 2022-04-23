const orderData = {
  orders: [
    {
      name: 'Aidan ',
      email: 'aidan@mail.com',
      date: '4/22/2022',
      total: 68,

      items: [
        { itemId: 123, title: 'book sold', quantity: 30, price: 4 },
        { itemId: 456, title: 'other', quantity: 29, price: 9 },
      ],
    },
  ],
};

//7. Necessary to export above mentioned objects
export default orderData;
