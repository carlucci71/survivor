import Foundation
import Capacitor

@objc(PersistentDeviceIdPlugin)
public class PersistentDeviceIdPlugin: CAPPlugin {
    private let keychainKey = "com.survivor.app.persistentDeviceId"
    
    @objc func getId(_ call: CAPPluginCall) {
        let deviceId = getOrCreatePersistentId()
        call.resolve(["identifier": deviceId])
    }
    
    private func getOrCreatePersistentId() -> String {
        // Try to read from Keychain
        if let existingId = readFromKeychain() {
            return existingId
        }
        
        // Generate new UUID and save to Keychain
        let newId = UUID().uuidString
        saveToKeychain(newId)
        return newId
    }
    
    private func readFromKeychain() -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: keychainKey,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        
        guard status == errSecSuccess,
              let data = result as? Data,
              let id = String(data: data, encoding: .utf8) else {
            return nil
        }
        
        return id
    }
    
    private func saveToKeychain(_ id: String) {
        guard let data = id.data(using: .utf8) else { return }
        
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: keychainKey,
            kSecValueData as String: data
        ]
        
        // Delete any existing item first
        SecItemDelete(query as CFDictionary)
        
        // Add new item
        SecItemAdd(query as CFDictionary, nil)
    }
}
