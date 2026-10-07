import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let window = UIWindow(windowScene: windowScene)
        let bridgeVC = CAPBridgeViewController()
        window.rootViewController = bridgeVC
        self.window = window
        window.makeKeyAndVisible()

        // Try to sync tokens into localStorage shortly after the web view is ready
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            guard let webView = bridgeVC.webView else { return }
            let deviceId = UserDefaults.standard.string(forKey: "PersistentDeviceId") ?? ""
            let fcmToken = UserDefaults.standard.string(forKey: "FCMToken") ?? ""
            var js = """
            try {
                if ('\(deviceId)' !== '') {
                    localStorage.setItem('PersistentDeviceId', '\(deviceId)');
                    console.log('📱 Persistent Device ID synced to localStorage:', '\(deviceId)');
                }
                if ('\(fcmToken)' !== '') {
                    localStorage.setItem('FCMToken', '\(fcmToken)');
                    console.log('FCM token saved to localStorage');
                }
            } catch(e) { console.error('Error syncing tokens:', e); }
            """
            webView.evaluateJavaScript(js, completionHandler: nil)
        }
    }

    func sceneDidDisconnect(_ scene: UIScene) { }
    func sceneDidBecomeActive(_ scene: UIScene) { }
    func sceneWillResignActive(_ scene: UIScene) { }
    func sceneWillEnterForeground(_ scene: UIScene) { }
    func sceneDidEnterBackground(_ scene: UIScene) { }
}
