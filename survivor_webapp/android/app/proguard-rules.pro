# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Preserve line number information for debugging stack traces.
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile

# ─── Capacitor Core ───────────────────────────────────────────────────────────
# Keep the entire Capacitor bridge: classes are accessed via reflection
# from the JavaScript side and must not be renamed or removed.
-keep class com.getcapacitor.** { *; }
-dontwarn com.getcapacitor.**

# Keep all plugin classes annotated with @CapacitorPlugin
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }

# Keep all @PluginMethod methods on any Plugin subclass
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.annotation.PluginMethod public *;
}

# ─── App-specific classes ─────────────────────────────────────────────────────
# Keep MainActivity and any generated plugin-registration classes
-keep class com.survivor.app.** { *; }

# ─── Firebase / FCM ───────────────────────────────────────────────────────────
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.**
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

# ─── WebView JavaScript interface ─────────────────────────────────────────────
# Required when the WebView calls Java methods by name via @JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# ─── Serialization / Reflection ───────────────────────────────────────────────
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes Exceptions
