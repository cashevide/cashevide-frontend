import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

type DashboardCurrencyTabsProps = {
  currencies: string[];
  selectedCurrency: string | null;
  onSelect: (currency: string) => void;
};

export default function DashboardCurrencyTabs({
  currencies,
  selectedCurrency,
  onSelect,
}: DashboardCurrencyTabsProps) {
  if (currencies.length === 0) {
    return null;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {currencies.map((currency) => (
        <TouchableOpacity
          key={currency}
          style={[
            styles.tab,
            selectedCurrency === currency && styles.tabActive,
          ]}
          onPress={() => onSelect(currency)}
        >
          <Text
            style={
              selectedCurrency === currency
                ? styles.tabTextActive
                : styles.tabText
            }
          >
            {currency}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tabActive: {
    backgroundColor: "#3399ff",
    borderColor: "#3399ff",
  },
  tabText: {
    color: "#333",
    fontWeight: "bold",
  },
  tabTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },
});
