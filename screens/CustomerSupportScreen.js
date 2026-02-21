import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function CustomerSupportScreen() {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    // Placeholder for sending support message
    alert('Support request sent!');
    setMessage('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Support</Text>
      <Text style={styles.label}>Send us your questions or feedback:</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your message here..."
        value={message}
        onChangeText={setMessage}
        multiline
        numberOfLines={4}
      />
      <Button title="Send" onPress={handleSend} />
      <Text style={styles.info}>Or contact us at: support@diplomatslaundry.com</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  info: {
    marginTop: 20,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
});
