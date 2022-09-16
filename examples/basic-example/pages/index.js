import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePilot } from '../dist';

const Home = () => {
	const pilot = usePilot();

	return (
		<View style={styles.container}>
			<Text>Home.js</Text>
			<StatusBar style="auto" />
			<TouchableOpacity onPress={() => pilot.fly('/dashboard')}>
				<Text>Go to Dashboard</Text>
			</TouchableOpacity>
		</View>
	)
};
export default Home;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
