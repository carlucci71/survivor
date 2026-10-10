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

        // Avvio "a freddo" da un link (schema survivor:// o Universal Link): con il modello a scene iOS
        // non chiama piu' AppDelegate.application(_:open:) ma consegna l'URL qui, in connectionOptions.
        // Va inoltrato a Capacitor, altrimenti App.getLaunchUrl() e appUrlOpen non ricevono mai il link
        // (magic link, inviti alle leghe) e l'app si apre sulla pagina di login.
        if let urlContext = connectionOptions.urlContexts.first {
            _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, open: urlContext.url, options: [:])
        }
        if let userActivity = connectionOptions.userActivities.first {
            _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
        }

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

    // App gia' aperta (anche in background) e link toccato: schema personalizzato survivor://...
    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        guard let url = URLContexts.first?.url else { return }
        _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, open: url, options: [:])
    }

    // App gia' aperta e Universal Link toccato (https://liberaleidee.it/survivor/...)
    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        _ = ApplicationDelegateProxy.shared.application(UIApplication.shared, continue: userActivity, restorationHandler: { _ in })
    }

    func sceneDidDisconnect(_ scene: UIScene) { }
    func sceneDidBecomeActive(_ scene: UIScene) { }
    func sceneWillResignActive(_ scene: UIScene) { }
    func sceneWillEnterForeground(_ scene: UIScene) { }
    func sceneDidEnterBackground(_ scene: UIScene) { }
}
