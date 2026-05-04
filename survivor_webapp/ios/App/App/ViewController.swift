import UIKit
import Capacitor

class ViewController: CAPBridgeViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        // Abilita il gesto di swipe-back (bordo sinistro → destra) su iOS
        webView?.allowsBackForwardNavigationGestures = true
    }
}
