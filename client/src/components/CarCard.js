import React, { useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import { Card, Button, Select, Input } from 'antd';

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
        personId
      }
    }
  }
`;

const UPDATE_CAR = gql`
  mutation UpdateCar($id: ID!, $year: String!, $make: String!, $model: String!, $price: String!, $personId: ID!) {
    updateCar(id: $id, year: $year, make: $make, model: $model, price: $price, personId: $personId) {
      id
      year
      make
      model
      price
      personId
    }
  }
`;

const DELETE_CAR = gql`
  mutation DeleteCar($id: ID!) {
    deleteCar(id: $id) {
      id
    }
  }
`;

const CarCard = ({ car }) => {
  const [editMode, setEditMode] = useState(false);
  const [year, setYear] = useState(car.year);
  const [make, setMake] = useState(car.make);
  const [model, setModel] = useState(car.model);
  const [price, setPrice] = useState(car.price);
  const [personId, setPersonId] = useState(car.personId);

  const { loading, error, data } = useQuery(GET_PEOPLE);

  const [updateCar] = useMutation(UPDATE_CAR, {
    refetchQueries: [{ query: GET_PEOPLE }],
    awaitRefetchQueries: true,
    optimisticResponse: {
      updateCar: {
        __typename: 'Car',
        id: car.id,
        year: year,
        make: make,
        model: model,
        price: price,
        personId: personId,
      },
    },
    update(cache, { data: { updateCar } }) {
      const { people } = cache.readQuery({ query: GET_PEOPLE });

      const oldPerson = people.find(person => person.cars.some(c => c.id === updateCar.id));
      const newPerson = people.find(person => person.id === updateCar.personId);

      if (oldPerson && oldPerson.id !== updateCar.personId) {
        // Remove car from old person's cars list
        oldPerson.cars = oldPerson.cars.filter(c => c.id !== updateCar.id);
      }

      if (newPerson) {
        // Add car to new person's cars list
        newPerson.cars.push(updateCar);
      }

      cache.writeQuery({
        query: GET_PEOPLE,
        data: { people },
      });
    },
  });

  const [deleteCar] = useMutation(DELETE_CAR, {
    refetchQueries: [{ query: GET_PEOPLE }],
    awaitRefetchQueries: true,
    update(cache) {
      cache.modify({
        fields: {
          cars(existingCars = [], { readField }) {
            return existingCars.filter(
              carRef => readField('id', carRef) !== car.id
            );
          },
        },
      });
    },
    optimisticResponse: {
      deleteCar: {
        __typename: 'Car',
        id: car.id,
      },
    },
  });

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    updateCar({ variables: { id: car.id, year, make, model, price, personId } })
      .then(() => {
        setEditMode(false);
      })
      .catch(error => {
        console.error('Error updating car:', error);
      });
  };

  const handleCancel = () => {
    setYear(car.year);
    setMake(car.make);
    setModel(car.model);
    setPrice(car.price);
    setPersonId(car.personId);
    setEditMode(false);
  };

  const handleDelete = () => {
    deleteCar({ variables: { id: car.id } })
      .then(() => {
        console.log('Car deleted successfully');
      })
      .catch(error => {
        console.error('Error deleting car:', error);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <Card type="inner" title={`${year} ${make} ${model}`}>
      {editMode ? (
        <div>
          <label>Year:</label>
          <Input
            type="text"
            value={year}
            onChange={e => setYear(e.target.value)}
          />
          <br />
          <label>Make:</label>
          <Input
            type="text"
            value={make}
            onChange={e => setMake(e.target.value)}
          />
          <br />
          <label>Model:</label>
          <Input
            type="text"
            value={model}
            onChange={e => setModel(e.target.value)}
          />
          <br />
          <label>Price:</label>
          <Input
            type="text"
            value={price}
            onChange={e => setPrice(e.target.value)}
          />
          <br />
          <label>Person ID:</label>
          <Select
            value={personId}
            onChange={value => setPersonId(value)}
            style={{ width: 200 }}
          >
            {data.people.map(person => (
              <Select.Option key={person.id} value={person.id}>
                {person.firstName} {person.lastName}
              </Select.Option>
            ))}
          </Select>
          <br />
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={handleCancel}>Cancel</Button>
        </div>
      ) : (
        <div>
          <p>Price: ${price}</p>
          <Button onClick={handleEdit}>Edit Car</Button>
          <Button onClick={handleDelete}>Delete Car</Button>
        </div>
      )}
    </Card>
  );
};

export default CarCard;
