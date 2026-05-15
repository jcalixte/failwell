import KeyboardShortcuts
import SwiftUI

struct SettingsView: View {
    var body: some View {
        Form {
            Section("Global hotkey") {
                KeyboardShortcuts.Recorder("Toggle popover:", name: .togglePopover)
                Text("Three modifiers + a letter is recommended — single- and two-modifier combos collide with system shortcuts.")
                    .font(Theme.monoSmall)
                    .foregroundStyle(Theme.dim)
            }
        }
        .formStyle(.grouped)
        .frame(width: 420, height: 200)
    }
}
