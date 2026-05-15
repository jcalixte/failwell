// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "FailWell",
    platforms: [.macOS(.v15)],
    dependencies: [
        .package(url: "https://github.com/sindresorhus/KeyboardShortcuts", from: "2.3.0")
    ],
    targets: [
        .executableTarget(
            name: "FailWell",
            dependencies: [
                .product(name: "KeyboardShortcuts", package: "KeyboardShortcuts")
            ],
            path: "Sources/FailWell"
        ),
        .testTarget(
            name: "FailWellTests",
            dependencies: ["FailWell"],
            path: "Tests/FailWellTests"
        )
    ]
)
