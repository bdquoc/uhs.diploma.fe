import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Đăng ký font để hiển thị tiếng Việt (Bạn cần tải file font .ttf về public/fonts)
// Font.register({ family: 'Roboto', src: '/fonts/Roboto-Bold.ttf' });

const styles = StyleSheet.create({
    page: { padding: 40, backgroundColor: '#fff', border: '10pt solid #1E3A8A' },
    header: { textAlign: 'center', marginBottom: 20 },
    logo: { width: 60, height: 60, margin: '0 auto 10' },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1E3A8A', textAlign: 'center', marginBottom: 30 },
    content: { fontSize: 14, lineHeight: 1.6 },
    row: { flexDirection: 'row', marginBottom: 10 },
    label: { width: 150, fontWeight: 'bold' },
    footer: { marginTop: 50, flexDirection: 'row', justifyContent: 'space-between' },
    signature: { textAlign: 'center', width: 200 }
});

export const CertificatePDF = ({ data }: any) => (
    <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
            <View style={styles.header}>
                <Text style={{ fontSize: 12, color: '#64748b' }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</Text>
                <Text style={{ fontSize: 10, fontWeight: 'bold' }}>Độc lập - Tự do - Hạnh phúc</Text>
            </View>

            <Text style={styles.title}>BẰNG TỐT NGHIỆP</Text>

            <View style={styles.content}>
                <Text>Hiệu trưởng Trường Đại học Khoa học Sức khỏe (UHS) công nhận:</Text>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{data.name}</Text>
                    <Text>Sinh ngày: {data.dob}</Text>
                    <Text>Ngành học: {data.program}</Text>
                    <Text>Xếp loại: {data.classification}</Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View>
                    <Text style={{ fontSize: 10 }}>Số hiệu: {data.diploma_number}</Text>
                    <Text style={{ fontSize: 10 }}>Mã số: {data.student_id}</Text>
                </View>
                <View style={styles.signature}>
                    <Text>Hà Nội, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</Text>
                    <Text style={{ marginTop: 5, fontWeight: 'bold' }}>HIỆU TRƯỞNG</Text>
                    <Text style={{ marginTop: 40 }}>{data.signer || 'TS. Nguyễn Văn A'}</Text>
                </View>
            </View>
        </Page>
    </Document>
);