const people = [
  {
    id: '1',
    firstName: 'Bill',
    lastName: 'Gates'
  },
  {
    id: '2',
    firstName: 'Steve',
    lastName: 'Jobs'
  },
  {
    id: '3',
    firstName: 'Linux',
    lastName: 'Torvalds'
  }
]

const cars = [
  {
    id: '1',
    year: '2019',
    make: 'Toyota',
    model: 'Corolla',
    price: '40000',
    personId: '1'
  },
  {
    id: '2',
    year: '2018',
    make: 'Lexus',
    model: 'LX 600',
    price: '13000',
    personId: '1'
  },
  {
    id: '3',
    year: '2017',
    make: 'Honda',
    model: 'Civic',
    price: '20000',
    personId: '1'
  },
  {
    id: '4',
    year: '2019',
    make: 'Acura ',
    model: 'MDX',
    price: '60000',
    personId: '2'
  },
  {
    id: '5',
    year: '2018',
    make: 'Ford',
    model: 'Focus',
    price: '35000',
    personId: '2'
  },
  {
    id: '6',
    year: '2017',
    make: 'Honda',
    model: 'Pilot',
    price: '45000',
    personId: '2'
  },
  {
    id: '7',
    year: '2019',
    make: 'Volkswagen',
    model: 'Golf',
    price: '40000',
    personId: '3'
  },
  {
    id: '8',
    year: '2018',
    make: 'Kia',
    model: 'Sorento',
    price: '45000',
    personId: '3'
  },
  {
    id: '9',
    year: '2017',
    make: 'Volvo',
    model: 'XC40',
    price: '55000',
    personId: '3'
  }
]
  
  export const resolvers = {
    Query: {
      people: () => people,
      cars: () => cars,
      person: (_, { id }) => people.find(person => person.id === id),
      car: (_, { id }) => cars.find(car => car.id === id),
      personWithCars: (_, { id }) => {
        const person = people.find(person => person.id === id);
        if (person) {
          person.cars = cars.filter(car => car.personId === person.id);
        }
        return person;
      }
    },
    Mutation: {
      addPerson: (_, { firstName, lastName }) => {
        const newPerson = { id: `${people.length + 1}`, firstName, lastName, cars: [] };
        people.push(newPerson);
        return newPerson;
      },
      updatePerson: (_, { id, firstName, lastName }) => {
        const person = people.find(person => person.id === id);
        if (firstName) person.firstName = firstName;
        if (lastName) person.lastName = lastName;
        return person;
      },
      deletePerson: (_, { id }) => {
        const personIndex = people.findIndex(person => person.id === id);
        if (personIndex > -1) {
          const [person] = people.splice(personIndex, 1);
          cars = cars.filter(car => car.personId !== id);
          return person;
        }
        return null;
      },
      addCar: (_, { year, make, model, price, personId }) => {
        const newCar = { id: `${cars.length + 1}`, year, make, model, price, personId };
        cars.push(newCar);
        return newCar;
      },
      updateCar: (_, { id, year, make, model, price, personId }) => {
        const car = cars.find(car => car.id === id);
        if (year) car.year = year;
        if (make) car.make = make;
        if (model) car.model = model;
        if (price) car.price = price;
        if (personId) car.personId = personId;
        return car;
      },
      deleteCar: (_, { id }) => {
        const carIndex = cars.findIndex(car => car.id === id);
        if (carIndex > -1) {
          return cars.splice(carIndex, 1)[0];
        }
        return null;
      }
    },
    Person: {
      cars: (person) => cars.filter(car => car.personId === person.id)
    }
  };
  