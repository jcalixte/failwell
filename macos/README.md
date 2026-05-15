# Fail Well — macOS

Menu bar + notch companion to the [Fail Well PWA](../). See [`see-this-pwa-and-proud-porcupine.md`](../../.claude/plans/see-this-pwa-and-proud-porcupine.md) for the design plan.

## Requirements

- macOS 15 Sequoia or later
- Xcode 16 / Swift 6.0+ toolchain (`xcode-select --install` is enough — full Xcode not required)

## Build & run

```sh
make run      # release build, packaged into FailWell.app, opened
make debug    # debug build, packaged and opened
make test     # swift test
make clean    # remove .build and FailWell.app
```

The resulting `FailWell.app` lives next to the `Makefile`. It's an unsigned ad-hoc-signed bundle, fine for local use; for distribution you'd need a Developer ID.

## Layout

```
macos/
├── Package.swift
├── Info.plist                    bundle config (LSUIElement = true → no Dock icon)
├── Makefile                      build/run/test/package targets
└── Sources/FailWell/
    ├── FailWellApp.swift         @main + MenuBarExtra
    ├── Models/                   Codable Task / Step / TaskRecord / TimeRange
    ├── Services/                 Parser, BreakCalculator, Comparator, Clock, Storage, Clipboard
    └── Views/                    SwiftUI popover, command palette, notch overlay
```

## Data location

`~/Library/Application Support/FailWell/data.json` — versioned, atomic writes.
