import os
import shutil
import subprocess
import zipfile

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
BUILD_DIR = "/tmp/majidtech_apk_workspace"
PUBLIC_DOWNLOADS = os.path.join(PROJECT_ROOT, "public", "downloads")

os.makedirs(BUILD_DIR, exist_ok=True)
os.makedirs(PUBLIC_DOWNLOADS, exist_ok=True)

# 1. Build Vite web app
print("--> Building Vite web application...")
subprocess.run(["npm", "run", "build"], check=True)

# 2. Setup Android project
print("--> Preparing Android project structure...")
shutil.rmtree(BUILD_DIR, ignore_errors=True)
os.makedirs(f"{BUILD_DIR}/src/com/majidtech/examgrading", exist_ok=True)
os.makedirs(f"{BUILD_DIR}/classes", exist_ok=True)
os.makedirs(f"{BUILD_DIR}/res/values", exist_ok=True)
os.makedirs(f"{BUILD_DIR}/res/values-ar", exist_ok=True)
for d in ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"]:
    os.makedirs(f"{BUILD_DIR}/res/mipmap-{d}", exist_ok=True)

# AndroidManifest.xml
manifest_content = """<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.majidtech.examgrading"
    android:versionCode="20"
    android:versionName="1.1.0">

    <uses-sdk
        android:minSdkVersion="24"
        android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />

    <application
        android:allowBackup="true"
        android:hardwareAccelerated="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:supportsRtl="true"
        android:usesCleartextTraffic="true"
        android:theme="@android:style/Theme.NoTitleBar">

        <activity
            android:name="com.majidtech.examgrading.MainActivity"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:exported="true"
            android:label="@string/app_name"
            android:screenOrientation="unspecified"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
"""
with open(f"{BUILD_DIR}/AndroidManifest.xml", "w", encoding="utf-8") as f:
    f.write(manifest_content)

# Strings
with open(f"{BUILD_DIR}/res/values/strings.xml", "w", encoding="utf-8") as f:
    f.write("""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">MajidTech Exam Grading</string>
</resources>
""")

with open(f"{BUILD_DIR}/res/values-ar/strings.xml", "w", encoding="utf-8") as f:
    f.write("""<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">ماجد تك لتصحيح الاختبارات</string>
</resources>
""")

# Icons
icon_src = "/tmp/sample_decoded/res/drawable-hdpi/app_sample_code.png"
if os.path.exists(icon_src):
    for d in ["mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi"]:
        shutil.copyfile(icon_src, f"{BUILD_DIR}/res/mipmap-{d}/ic_launcher.png")

# Java source code
java_code = """package com.majidtech.examgrading;

import android.app.Activity;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.Window;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView webView;
    private ValueCallback<Uri[]> filePathCallback;
    private static final int FILE_CHOOSER_REQUEST_CODE = 2001;
    private static final int CAMERA_PERMISSION_REQUEST_CODE = 2002;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        try {
            requestWindowFeature(Window.FEATURE_NO_TITLE);
        } catch (Throwable ignored) {}

        try {
            webView = new WebView(this);
            setContentView(webView);

            WebSettings settings = webView.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setAllowFileAccess(true);
            settings.setAllowContentAccess(true);
            settings.setAllowFileAccessFromFileURLs(true);
            settings.setAllowUniversalAccessFromFileURLs(true);
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setUseWideViewPort(true);
            settings.setLoadWithOverviewMode(true);
            settings.setSupportZoom(true);
            settings.setBuiltInZoomControls(false);

            webView.setWebChromeClient(new WebChromeClient() {
                @Override
                public void onPermissionRequest(final PermissionRequest request) {
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                        try {
                            request.grant(request.getResources());
                        } catch (Throwable t) {
                            t.printStackTrace();
                        }
                    }
                }

                @Override
                public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> filePathCallback, FileChooserParams fileChooserParams) {
                    MainActivity.this.filePathCallback = filePathCallback;
                    try {
                        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                        intent.addCategory(Intent.CATEGORY_OPENABLE);
                        intent.setType("image/*");
                        startActivityForResult(Intent.createChooser(intent, "Select Exam Sheet Image"), FILE_CHOOSER_REQUEST_CODE);
                        return true;
                    } catch (Throwable t) {
                        t.printStackTrace();
                        return false;
                    }
                }
            });

            webView.setWebViewClient(new WebViewClient() {
                @Override
                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                    return false;
                }
            });

            // Request runtime permissions for Camera and Storage
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (checkSelfPermission(android.Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                    requestPermissions(new String[]{
                        android.Manifest.permission.CAMERA,
                        android.Manifest.permission.READ_EXTERNAL_STORAGE,
                        android.Manifest.permission.WRITE_EXTERNAL_STORAGE
                    }, CAMERA_PERMISSION_REQUEST_CODE);
                }
            }

            // Load the bundled offline application
            webView.loadUrl("file:///android_asset/index.html");

        } catch (Throwable t) {
            t.printStackTrace();
            Toast.makeText(this, "MajidTech Exam Grading ready", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == FILE_CHOOSER_REQUEST_CODE) {
            if (filePathCallback != null) {
                Uri[] results = null;
                if (resultCode == Activity.RESULT_OK && data != null) {
                    String dataString = data.getDataString();
                    if (dataString != null) {
                        results = new Uri[]{Uri.parse(dataString)};
                    }
                }
                filePathCallback.onReceiveValue(results);
                filePathCallback = null;
            }
        }
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
"""

with open(f"{BUILD_DIR}/src/com/majidtech/examgrading/MainActivity.java", "w", encoding="utf-8") as f:
    f.write(java_code)

# 3. Compile Java with ECJ
print("--> Compiling Java sources with ECJ...")
subprocess.run([
    "java", "-jar", "/opt/android/ecj.jar",
    "-7",
    "-cp", "/opt/android/android.jar",
    "-d", f"{BUILD_DIR}/classes",
    f"{BUILD_DIR}/src/com/majidtech/examgrading/MainActivity.java"
], check=True)

# 4. Compile .class to DEX with D8
print("--> Compiling bytecode to classes.dex with D8 (min-api 24)...")
classes = [f"{BUILD_DIR}/classes/com/majidtech/examgrading/{c}" for c in os.listdir(f"{BUILD_DIR}/classes/com/majidtech/examgrading") if c.endswith(".class")]
subprocess.run([
    "java", "-cp", "/opt/android/r8.jar", "com.android.tools.r8.D8",
    "--min-api", "24",
    "--lib", "/opt/android/android.jar",
    "--output", BUILD_DIR,
    *classes
], check=True)

# 5. Compile resources with aapt2
print("--> Compiling resources with aapt2...")
subprocess.run([
    "/tmp/android-tools/aapt2", "compile",
    "--dir", f"{BUILD_DIR}/res",
    "-o", f"{BUILD_DIR}/compiled_res.zip"
], check=True)

# 6. Link APK with aapt2
print("--> Linking APK with aapt2...")
subprocess.run([
    "/tmp/android-tools/aapt2", "link",
    "-I", "/opt/android/android.jar",
    "--manifest", f"{BUILD_DIR}/AndroidManifest.xml",
    "-o", f"{BUILD_DIR}/unaligned.apk",
    f"{BUILD_DIR}/compiled_res.zip"
], check=True)

# 7. Add classes.dex and bundled web app assets
print("--> Packaging classes.dex and assets/ into APK...")
with zipfile.ZipFile(f"{BUILD_DIR}/unaligned.apk", "a", compression=zipfile.ZIP_DEFLATED) as z:
    z.write(f"{BUILD_DIR}/classes.dex", "classes.dex")
    dist_dir = os.path.join(PROJECT_ROOT, "dist")
    for root, _, files in os.walk(dist_dir):
        for f in files:
            full_path = os.path.join(root, f)
            rel_path = os.path.relpath(full_path, dist_dir)
            arc_name = f"assets/{rel_path}".replace("\\", "/")
            z.write(full_path, arc_name)

# 8. Sign and align with uber-apk-signer
print("--> Signing and zipaligning with uber-apk-signer...")
out_dir = f"{BUILD_DIR}/signed"
os.makedirs(out_dir, exist_ok=True)
subprocess.run([
    "java", "-jar", "/opt/android/uber-apk-signer.jar",
    "--apks", f"{BUILD_DIR}/unaligned.apk",
    "--out", out_dir
], check=True)

signed_apk = [os.path.join(out_dir, f) for f in os.listdir(out_dir) if f.endswith(".apk") and "aligned" in f][0]

# 9. Copy to public downloads
target_apk = os.path.join(PUBLIC_DOWNLOADS, "majidtech-exam-grading-v1.1.0.apk")
shutil.copyfile(signed_apk, target_apk)
print(f"==> Successfully generated installable APK at: {target_apk}")

# 10. Verify badging
subprocess.run(["/tmp/android-tools/aapt2", "dump", "badging", target_apk], check=True)
