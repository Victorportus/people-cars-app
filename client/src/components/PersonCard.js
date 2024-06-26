import React from 'react';
import { useMutation, gql } from '@apollo/client';
import { Card, Button } from 'antd';
import CarCard from './CarCard';
import { Link } from 'react-router-dom';

const DELETE_PERSON = gql`
  mutation DeletePerson($id: ID!) {
    deletePerson(id: $id) {
      id
    }
  }
`;

const PersonCard = ({ person }) => {
  const [deletePerson] = useMutation(DELETE_PERSON, {
    update(cache, { data: { deletePerson } }) {
      cache.modify({
        fields: {
          people(existingPeople = [], { readField }) {
            return existingPeople.filter(
              personRef => readField('id', personRef) !== deletePerson.id
            );
          }
        }
      });
    }
  });

  const handleDelete = () => {
    deletePerson({ variables: { id: person.id } });
  };

  return (
    <Card title={`${person.firstName} ${person.lastName}`}>
      {person.cars.map(car => (
        <CarCard key={car.id} car={car} />
      ))}
      <Link to={`/people/${person.id}`}>LEARN MORE</Link>
      <Button onClick={handleDelete}>Delete Person</Button>
    </Card>
  );
};

export default PersonCard;
