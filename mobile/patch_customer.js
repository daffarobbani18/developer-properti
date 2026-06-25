const fs = require('fs');

const file = 'src/screens/customer/CustomerHomeScreen.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `<FadeInView delay={100} duration={500}>
              <Text style={styles.summaryText}>Notifikasi belum dibaca: {overview.unreadNotifications}</Text>
              {overview.nextInvoice ? (
                <>
                  <Text style={styles.summaryText}>Tagihan berikutnya: {overview.nextInvoice.name}</Text>
                  <Text style={styles.summaryText}>Nominal: {formatCurrency(overview.nextInvoice.amount)}</Text>
                  <Text style={styles.summaryText}>Jatuh tempo: {formatDate(overview.nextInvoice.dueDate)}</Text>
                </>
              ) : (
                <Text style={styles.summaryText}>Tidak ada tagihan berikutnya.</Text>
              )}
            </FadeInView>`;

const replacementStr = `<FadeInView delay={100} duration={500}>
              <View style={styles.summaryItem}>
                <View style={[styles.summaryIcon, { backgroundColor: c.info.bg }]}>
                  <Ionicons name="notifications" size={20} color={c.info.text} />
                </View>
                <View style={styles.summaryTextWrap}>
                  <Text style={styles.summaryLabel}>Notifikasi Baru</Text>
                  <Text style={styles.summaryValue}>{overview.unreadNotifications} Pesan</Text>
                </View>
              </View>

              {overview.nextInvoice ? (
                <View style={[styles.summaryItem, { borderTopWidth: 1, borderTopColor: c.neutral200, paddingTop: 16, marginTop: 4 }]}>
                  <View style={[styles.summaryIcon, { backgroundColor: c.danger.bg }]}>
                    <Ionicons name="alert-circle" size={20} color={c.danger.text} />
                  </View>
                  <View style={styles.summaryTextWrap}>
                    <Text style={styles.summaryLabel}>Tagihan Berikutnya</Text>
                    <Text style={[styles.summaryValue, { color: c.danger.text }]}>{formatCurrency(overview.nextInvoice.amount)}</Text>
                    <Text style={styles.summaryHint}>Jatuh tempo: {formatDate(overview.nextInvoice.dueDate)}</Text>
                  </View>
                </View>
              ) : (
                <View style={[styles.summaryItem, { borderTopWidth: 1, borderTopColor: c.neutral200, paddingTop: 16, marginTop: 4 }]}>
                  <View style={[styles.summaryIcon, { backgroundColor: c.success.bg }]}>
                    <Ionicons name="checkmark-circle" size={20} color={c.success.text} />
                  </View>
                  <View style={styles.summaryTextWrap}>
                    <Text style={styles.summaryLabel}>Status Tagihan</Text>
                    <Text style={[styles.summaryValue, { color: c.success.text }]}>Lunas</Text>
                    <Text style={styles.summaryHint}>Tidak ada tagihan tertunda</Text>
                  </View>
                </View>
              )}
            </FadeInView>`;

// Try exact replacement
if (content.includes(targetStr)) {
    content = content.replace(targetStr, replacementStr);
    console.log("Exact replacement worked.");
} else {
    // If spaces/newlines are messed up, just replace between <FadeInView delay={100} duration={500}> and </FadeInView>
    const re = /<FadeInView delay=\{100\} duration=\{500\}>[\s\S]*?<\/FadeInView>/;
    if (re.test(content)) {
        content = content.replace(re, replacementStr);
        console.log("Regex replacement worked.");
    } else {
        console.error("Could not find Ringkasan Akun block.");
    }
}

fs.writeFileSync(file, content);
console.log('CustomerHomeScreen patched.');
