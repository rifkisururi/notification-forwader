package com.pedagangpulsa.notifforwader

import android.content.Context
import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import io.flutter.embedding.engine.FlutterEngineCache
import io.flutter.plugin.common.MethodChannel
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone

class NotifListenerService : NotificationListenerService() {
    private val TAG = "NotifListenerService"
    private val CHANNEL = "com.pedagangpulsa.notifforwader/notifications"

    companion object {
        // Queue to store notifications when the Flutter engine is not available
        val pendingNotifications = ArrayList<String>()
        private var isFlushing = false

        fun flushQueue(context: Context) {
            val engine = FlutterEngineCache.getInstance().get("main_engine") ?: return
            if (isFlushing) return
            isFlushing = true
            
            val messenger = engine.dartExecutor.binaryMessenger
            val channel = MethodChannel(messenger, "com.pedagangpulsa.notifforwader/notifications")
            
            val mainHandler = android.os.Handler(context.mainLooper)
            mainHandler.post {
                synchronized(pendingNotifications) {
                    val iterator = pendingNotifications.iterator()
                    while (iterator.hasNext()) {
                        val payload = iterator.next()
                        channel.invokeMethod("onNotification", payload)
                        iterator.remove()
                    }
                }
                isFlushing = false
            }
        }
    }

    override fun onNotificationPosted(sbn: StatusBarNotification?) {
        super.onNotificationPosted(sbn)
        if (sbn == null) return

        val packageName = sbn.packageName
        
        // Retrieve monitored packages from SharedPreferences
        val sharedPref = getSharedPreferences("notif_prefs", Context.MODE_PRIVATE)
        val monitoredPackages = sharedPref.getStringSet("monitored_packages", emptySet()) ?: emptySet()

        if (!monitoredPackages.contains(packageName)) {
            Log.d(TAG, "Notification from $packageName is not monitored")
            return
        }

        val extras = sbn.notification.extras
        val title = extras.getCharSequence("android.title")?.toString() ?: ""
        val text = extras.getCharSequence("android.text")?.toString() ?: ""
        val bigText = extras.getCharSequence("android.bigText")?.toString() ?: ""
        val postTime = sbn.postTime
        val notifId = sbn.id

        // Format received_at as ISO 8601 string
        val df = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'", Locale.US)
        df.timeZone = TimeZone.getTimeZone("UTC")
        val receivedAt = df.format(Date(postTime))

        // Get app label
        var appLabel = packageName
        try {
            val pm = packageManager
            val ai = pm.getApplicationInfo(packageName, 0)
            appLabel = pm.getApplicationLabel(ai).toString()
        } catch (e: Exception) {
            Log.e(TAG, "Failed to get app label", e)
        }

        val json = JSONObject()
        json.put("source_app", packageName)
        json.put("source_app_label", appLabel)
        json.put("title", title)
        json.put("text", text)
        json.put("big_text", bigText)
        json.put("received_at", receivedAt)
        json.put("notif_id", notifId)

        val payloadString = json.toString()
        Log.d(TAG, "Captured notification: $payloadString")

        val engine = FlutterEngineCache.getInstance().get("main_engine")
        if (engine != null) {
            // Send directly to Flutter on the main thread
            val mainHandler = android.os.Handler(mainLooper)
            mainHandler.post {
                MethodChannel(engine.dartExecutor.binaryMessenger, CHANNEL)
                    .invokeMethod("onNotification", payloadString)
            }
        } else {
            // Queue it
            synchronized(pendingNotifications) {
                pendingNotifications.add(payloadString)
            }
            Log.d(TAG, "No Flutter engine. Notification queued. Queue size: ${pendingNotifications.size}")
        }
    }
}
