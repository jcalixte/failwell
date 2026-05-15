APP_NAME := FailWell
BUNDLE   := $(APP_NAME).app
CONFIG   := release
BIN_DIR  := .build/$(CONFIG)
BIN      := $(BIN_DIR)/$(APP_NAME)

.PHONY: build release app run debug test clean

build:
	swift build

release:
	swift build -c release

app: release
	@rm -rf $(BUNDLE)
	@mkdir -p $(BUNDLE)/Contents/MacOS $(BUNDLE)/Contents/Resources
	@cp $(BIN) $(BUNDLE)/Contents/MacOS/$(APP_NAME)
	@cp Info.plist $(BUNDLE)/Contents/Info.plist
	@codesign --force --deep --sign - $(BUNDLE) 2>/dev/null || true
	@echo "Built $(BUNDLE)"

run: app
	@open $(BUNDLE)

debug: build
	@rm -rf $(BUNDLE)
	@mkdir -p $(BUNDLE)/Contents/MacOS $(BUNDLE)/Contents/Resources
	@cp .build/debug/$(APP_NAME) $(BUNDLE)/Contents/MacOS/$(APP_NAME)
	@cp Info.plist $(BUNDLE)/Contents/Info.plist
	@codesign --force --deep --sign - $(BUNDLE) 2>/dev/null || true
	@open $(BUNDLE)

test:
	swift test

clean:
	@rm -rf .build $(BUNDLE)
