import React from 'react';
import PersonForm from '../components/PersonForm';
import CarForm from '../components/CarForm';
import PersonCard from '../components/PersonCard';
import { useQuery, gql } from '@apollo/client';

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

const Home = () => {
  const { loading, error, data } = useQuery(GET_PEOPLE);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <PersonForm />
      {data.people.length > 0 && <CarForm people={data.people} />}
      {data.people.map(person => (
        <PersonCard key={person.id} person={person} />
      ))}
    </div>
  );
};

export default Home;
