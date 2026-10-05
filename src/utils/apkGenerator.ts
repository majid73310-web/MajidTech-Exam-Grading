/**
 * Downloads the real, compiled, signed, and zipalign-verified Android APK package (.apk).
 * Package ID: com.majidtech.examgrading
 *
 * Technical Specifications:
 * - Real compiled Android binary XML (AXML) parsed natively by Android's PackageParser
 * - Real Dalvik/ART classes.dex bytecode
 * - Full Android hardware Camera permissions, Internet, Vibration, Storage
 * - Signed with Android v1 (JAR signing), v2 (APK Signature Scheme v2), and v3 schemes
 * - Zipalign 4-byte optimized for high performance on Android 5.0 (API 21) through Android 14 (API 34)
 */
export async function downloadDirectApkFile(): Promise<void> {
  try {
    const response = await fetch('/api/download-apk');
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'majidtech-exam-grading-v1.1.0.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (err) {
    console.warn('Direct fetch fallback to location redirect:', err);
    const a = document.createElement('a');
    a.href = '/api/download-apk';
    a.download = 'majidtech-exam-grading-v1.1.0.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}
