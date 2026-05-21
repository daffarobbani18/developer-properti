import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type ImagePreviewProps = {
  uri: string;
  onRemove?: () => void;
};

export function ImagePreview({ uri, onRemove }: ImagePreviewProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      <Image source={{ uri }} style={styles.image} resizeMode="cover" />
      {onRemove ? (
        <Pressable onPress={onRemove} style={styles.removeBtn}>
          <View style={styles.removeIcon}>
            <Text style={styles.removeText}>×</Text>
          </View>
        </Pressable>
      ) : null}
    </View>
  );
}

type ImagePreviewGridProps = {
  uris: string[];
  onRemove?: (uri: string) => void;
};

export function ImagePreviewGrid({ uris, onRemove }: ImagePreviewGridProps): React.JSX.Element {
  if (uris.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Belum ada foto yang dipilih</Text>
      </View>
    );
  }

  const rows: string[][] = [];
  for (let i = 0; i < uris.length; i += 3) {
    rows.push(uris.slice(i, i + 3));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIndex) => (
        <View key={`row-${rowIndex}`} style={styles.row}>
          {row.map((uri, index) => (
            <ImagePreview
              key={`${uri}-${index}`}
              uri={uri}
              onRemove={onRemove ? () => onRemove(uri) : undefined}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  removeBtn: {
    position: "absolute",
    top: 6,
    right: 6,
  },
  removeIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  removeText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 20,
  },
  grid: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
    gap: 8,
  },
  emptyContainer: {
    borderWidth: 1,
    borderColor: "#cadee2",
    borderStyle: "dashed",
    borderRadius: 12,
    paddingVertical: 24,
    alignItems: "center",
    backgroundColor: "#f8fbfc",
  },
  emptyText: {
    color: "#55707a",
    fontSize: 13,
  },
});