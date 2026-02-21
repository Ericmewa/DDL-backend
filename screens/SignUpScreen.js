export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agree, setAgree] = useState(false);

  const handleSignUp = () => {
    if (!agree) {
      alert('You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }
    // Placeholder for sign up logic
    alert('Account created!');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Logo and App Name */}
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
}
        <Text style={styles.appName}>DIPLOMATS{"\n"}DRYCLEANERS</Text>
      </View>
      <Text style={styles.header}>Create an Account</Text>
      {/* Input Fields */}
      <View style={styles.inputRow}>
        <Ionicons name="person-outline" size={20} color="#888" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      </View>
      <View style={styles.inputRow}>
        <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Email Address" value={email} onChangeText={setEmail} keyboardType="email-address" />
      </View>
      <View style={styles.inputRow}>
        <Ionicons name="call-outline" size={20} color="#888" style={styles.icon} />
        <Text style={styles.prefix}>+254</Text>
        <TextInput style={[styles.input, { flex: 1 }]} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      </View>
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      </View>
      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
        <TextInput style={styles.input} placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
      </View>
      {/* Checkbox */}
      <View style={styles.checkboxRow}>
        <TouchableOpacity onPress={() => setAgree(!agree)} style={styles.checkbox}>
          {agree && <Ionicons name="checkmark" size={18} color="#007bff" />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>I agree to the <Text style={styles.link}>Terms & Conditions</Text> and <Text style={styles.link}>Privacy Policy</Text></Text>
      </View>
      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>
      {/* Login Link */}
      <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink} onPress={() => navigation.navigate('Login')}>Log In</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  appName: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 1,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#222',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9',
  },
  icon: {
    marginRight: 8,
  },
  prefix: {
    color: '#888',
    marginRight: 4,
    fontSize: 16,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    backgroundColor: 'transparent',
    borderWidth: 0,
    paddingVertical: 0,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: '#007bff',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  checkboxText: {
    fontSize: 14,
    color: '#333',
  },
  link: {
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  signupButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  signupButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  loginLink: {
    color: '#007bff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
