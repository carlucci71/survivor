package com.survivor.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.firebase.FirebaseApp;

public class MainActivity extends BridgeActivity {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		// Ensure Firebase is initialized before any plugin (e.g., PushNotifications)
		try {
			FirebaseApp.initializeApp(this);
		} catch (Exception ignored) {
			// If initialization fails here, the FirebaseInitProvider should initialize it.
		}
	}
}
