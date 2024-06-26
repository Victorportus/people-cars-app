import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { Input, Button } from 'antd';

const ADD_PERSON = gql`
  mutation AddPerson($firstName: String!, $lastName: String!) {
    addPerson(firstName: $firstName, lastName: $lastName) {
      id
      firstName
      lastName
    }
  }
`;

const PersonForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [addPerson] = useMutation(ADD_PERSON, {
    update(cache, { data: { addPerson } }) {
      cache.modify({
        fields: {
          people(existingPeople = []) {
            const newPersonRef = cache.writeFragment({
              data: addPerson,
              fragment: gql`
                fragment NewPerson on Person {
                  id
                  firstName
                  lastName
                }
              `
            });
            return [...existingPeople, newPersonRef];
          }
        }
      });
    }
  });

  const handleSubmit = () => {
    addPerson({ variables: { firstName, lastName } });
    setFirstName('');
    setLastName('');
  };

  return (
    <div>
      <Input
        value={firstName}
        onChange={e => setFirstName(e.target.value)}
        placeholder="First Name"
      />
      <Input
        value={lastName}
        onChange={e => setLastName(e.target.value)}
        placeholder="Last Name"
      />
      <Button onClick={handleSubmit}>Add Person</Button>
    </div>
  );
};

export default PersonForm;
