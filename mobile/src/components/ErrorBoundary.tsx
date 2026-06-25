import React, { Component, ErrorInfo, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import * as Sentry from "@sentry/react-native";

import { SecondaryButton } from "./ui";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    Sentry.captureException(error, { extra: errorInfo as any });
  }

  handleRestart = (): void => {
    this.setState({ hasError: false, error: null });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Terjadi Kesalahan</Text>
            <Text style={styles.message}>
              Aplikasi mengalami masalah yang tidak terduga. Silakan coba lagi atau restart aplikasi.
            </Text>
            {this.state.error && __DEV__ ? (
              <Text style={styles.errorDetail}>{this.state.error.message}</Text>
            ) : null}
            <SecondaryButton label="Coba Lagi" onPress={this.handleRestart} />
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f7f8",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  content: {
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#102f38",
  },
  message: {
    fontSize: 14,
    color: "#4a6a73",
    textAlign: "center",
  },
  errorDetail: {
    fontSize: 12,
    color: "#c14953",
    backgroundColor: "#ffe2dd",
    padding: 8,
    borderRadius: 8,
  },
});