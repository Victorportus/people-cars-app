import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Input, Button, Select } from 'antd';

const ADD_CAR = gql`
  mutation AddCar($year: String!, $make: String!, $model: String!, $price: String!, $personId: ID!) {
    addCar(year: $year, make: $make, model: $model, price: $price, personId: $personId) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

const GET_PEOPLE = gql`
  query GetPeople {
    people {
      id
      firstName
      lastName
      cars {
        id
        year
        make
        model
        price
      }
    }
  }
`;

const CarForm = ({ people }) => {
  const [year, setYear] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [price, setPrice] = useState('');
  const [personId, setPersonId] = useState('');
  const [addCar, { error }] = useMutation(ADD_CAR, {
    optimisticResponse: {
      addCar: {
        __typename: "Car",
        id: Math.floor(Math.random() * 10000).toString(), // Temporary ID
        year: year, // Keep as string
        make,
        model,
        price: price, // Keep as string
        personId
      }
    },
    update(cache, { data: { addCar } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });
      const updatedPeople = people.map(person =>
        person.id === addCar.personId
          ? { ...person, cars: [...person.cars, addCar] }
          : person
      );
      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people: updatedPeople },
      });
    }
  });

  const handleSubmit = () => {
    addCar({ variables: { year, make, model, price, personId } })
      .then(() => {
        setYear('');
        setMake('');
        setModel('');
        setPrice('');
        setPersonId('');
      })
      .catch(err => {
        console.error('Error adding car:', err);
      });
  };

  return (
    <div>
      {error && <p>Error adding car: {error.message}</p>}
      <Input
        value={year}
        onChange={e => setYear(e.target.value)}
        placeholder="Year"
      />
      <Input
        value={make}
        onChange={e => setMake(e.target.value)}
        placeholder="Make"
      />
      <Input
        value={model}
        onChange={e => setModel(e.target.value)}
        placeholder="Model"
      />
      <Input
        value={price}
        onChange={e => setPrice(e.target.value)}
        placeholder="Price"
      />
      <Select
        value={personId}
        onChange={value => setPersonId(value)}
        placeholder="Select Person"
        style={{ width: 200 }}
      >
        {people.map(person => (
          <Select.Option key={person.id} value={person.id}>
            {person.firstName} {person.lastName}
          </Select.Option>
        ))}
      </Select>
      <Button onClick={handleSubmit}>Add Car</Button>
    </div>
  );
};

export default CarForm;
