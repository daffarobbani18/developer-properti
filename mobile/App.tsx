import * as Sentry from '@sentry/react-native';
import { AppRoot } from "./src/AppRoot";

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN || "https://dummy@o0.ingest.sentry.io/0",
  tracesSampleRate: 1.0,
});

function App() {
  return <AppRoot />;
}

export default Sentry.wrap(App);
