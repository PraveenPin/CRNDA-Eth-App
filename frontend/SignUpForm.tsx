import * as React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  Alert,
  ScrollView,
} from 'react-native';
import { useForm } from 'react-hook-form';

// You can import from local files
import Input from './components/Input';
import Form from './components/Form';
import validation from './utils/validation';
import { FormData } from './DataTypes';

export default function SignUpForm ({ web3, contract, createUser }): JSX.Element {
    const { handleSubmit, register, setValue, errors } = useForm<FormData>();
  
    const onSubmit = (data: FormData) => {
      console.log('data', JSON.stringify(data));
      createUser(data.name);
    };
  
    return (
        <View style={styles.formContainer}>
          <Form {...{ register, setValue, validation, errors }}>
            <Input name="name" label="Name " />
            <Button title="Submit" onPress={handleSubmit(onSubmit)} />
          </Form>
        </View>
    );
};
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#181e34',
    },
    formContainer: {
      padding: 8,
      flex: 1,
    },
    button: {
      backgroundColor: 'red',
    }
  });