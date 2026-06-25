import * as SplashScreen from 'expo-splash-screen';
import * as Sentry from '@sentry/react-native';
import { AppRoot } from "./src/AppRoot";

// Prevent native splash from auto-hiding before auth bootstrap completes.
// SplashScreen.hideAsync() is called in AppNavigator after isBootstrapping = false.
SplashScreen.preventAutoHideAsync();

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "https://dummy@o0.ingest.sentry.io/0",
  tracesSampleRate: 1.0,
});

function App() {
  return <AppRoot />;
}

export default Sentry.wrap(App);
