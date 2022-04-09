const data = {
  /* users: [
    {
      name: 'Hector',
      email: 'hector@one.com',
      password: bcrypt.hashSync('password'),
      isAdmin: true,
    },
    {
      name: 'Collin',
      email: 'collin@one.com',
      password: bcrypt.hashSync('password'),
      isAdmin: false,
    },
  ], */
  inventory: [
    {
      //_id: '1',
      title: 'Oliver Twist',
      author: 'Mark Hamill',
      reference: 'dune-by-frank-herbert',
      genre: 'Fiction',
      image: '/book-covers/book1.jpg',
      price: 8,
      stock: 0,
      description: 'A sci fi novel',
    },
    {
      // _id: '2',
      title: 'Harry Potter',
      author: 'JK Rowling',
      reference: 'harry-potter-by-jk-rowling',
      genre: 'Fantasy',
      image: '/book-covers/book2.jpg',
      price: 12,
      stock: 3,
      description: 'A sci fi novel',
    },
    {
      // _id: '3',
      title: 'Game of Thrones',
      author: 'George RR Martin',
      reference: 'game-of-thrones-george-rr-martin',
      genre: 'Fantasy',
      image: '/book-covers/book3.jpg',
      price: 20,
      stock: 2,
      description: 'A violent novel',
    },
    {
      //_id: '4',
      title: 'Lord of the Rings',
      author: 'JRR Tolkien',
      reference: 'lord-of-the-rings-tolkien',
      genre: 'Fantasy',
      image: '/book-covers/book4.jpg',
      price: 20,
      stock: 20,
      description: 'A classic novel',
    },
  ],
};

//7. Necessary to export above mentioned objects
export default data;
