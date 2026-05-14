import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '@/contexts/AuthContext';
import Colors from '@/constants/Colors';

export default function RequestScreen() {
  const { user } = useAuth();

  const pairingData = {
    userId: user?.uid,
    timestamp: new Date().toISOString(),
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Pair with Child's Device</Text>
        <Text style={styles.subtitle}>
          Ask the child to scan this QR code using their device
        </Text>
        
        <View style={styles.qrContainer}>
          <QRCode
            value={JSON.stringify(pairingData)}
            size={250}
            color={Colors.candy.blue}
            backgroundColor="white"
          />
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>Instructions:</Text>
          <Text style={styles.instructionText}>
            1. Open Pictalk on the child's device{'\n'}
            2. Tap "Scan Parent's QR Code"{'\n'}
            3. Point the camera at this QR code{'\n'}
            4. Wait for the pairing confirmation
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.candy.backgroundLight,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.candy.blue,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  qrContainer: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instructions: {
    marginTop: 40,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.candy.blue,
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
}); 