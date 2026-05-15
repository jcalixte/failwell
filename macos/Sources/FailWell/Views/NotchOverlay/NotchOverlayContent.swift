import SwiftUI

struct NotchOverlayContent: View {
    @Environment(AppStore.self) private var store
    @Environment(Clock.self) private var clock

    let state: NotchOverlayState

    var body: some View {
        if let geometry = state.geometry,
           let active = store.activeRecord,
           let stepId = active.record.currentStepId,
           let step = active.task.step(id: stepId),
           let range = active.record.stepRecords[stepId]
        {
            island(active: active, step: step, range: range, geometry: geometry)
        } else {
            Color.clear
        }
    }

    private func island(
        active: (task: TaskPlan, record: TaskRecord),
        step: Step,
        range: TimeRange,
        geometry: NotchGeometry
    ) -> some View {
        let elapsed = clock.now.timeIntervalSince(range.start)
        let estimationSec = Double(step.estimation) * 60
        let remaining = max(0, estimationSec - elapsed)
        let overshoot = max(0, elapsed - estimationSec)
        let isPaused = active.record.isPaused
        let isExpanded = state.isExpanded
        let menuBarH = geometry.menuBarHeight
        let notchW = geometry.notchWidth

        return ZStack(alignment: .top) {
            NotchShape(notchWidth: notchW, menuBarHeight: menuBarH)
                .fill(Color.black, style: FillStyle(eoFill: true))
                .shadow(color: .black.opacity(isExpanded ? 0.35 : 0), radius: 12, x: 0, y: 6)

            wings(
                step: step,
                elapsed: elapsed,
                remaining: remaining,
                overshoot: overshoot,
                isPaused: isPaused,
                menuBarH: menuBarH,
                notchW: notchW
            )

            if isExpanded {
                expandedBody(
                    active: active,
                    step: step,
                    elapsed: elapsed,
                    remaining: remaining,
                    overshoot: overshoot,
                    isPaused: isPaused
                )
                .padding(.top, menuBarH)
                .transition(.opacity)
            }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .top)
        .animation(.spring(response: 0.32, dampingFraction: 0.82), value: isExpanded)
        .onHover { hover in
            state.isExpanded = hover
        }
        .onTapGesture(count: 2) {
            NSApp.activate(ignoringOtherApps: true)
        }
    }

    private func wings(
        step: Step,
        elapsed: TimeInterval,
        remaining: TimeInterval,
        overshoot: TimeInterval,
        isPaused: Bool,
        menuBarH: CGFloat,
        notchW: CGFloat
    ) -> some View {
        HStack(spacing: 0) {
            // Left wing: status indicator + step title
            HStack(spacing: 6) {
                Image(systemName: isPaused ? "pause.circle.fill" : "record.circle")
                    .foregroundStyle(isPaused ? Theme.flag : Theme.accent)
                    .font(.system(size: 11))
                Text(step.title)
                    .font(Theme.mono)
                    .foregroundStyle(.white)
                    .lineLimit(1)
                    .truncationMode(.tail)
            }
            .padding(.trailing, 10)
            .frame(maxWidth: .infinity, alignment: .trailing)

            Color.clear.frame(width: notchW)

            // Right wing: timer
            HStack(spacing: 4) {
                Text(TimeFormat.clock(elapsed))
                    .font(Theme.mono.monospacedDigit())
                    .foregroundStyle(.white)
                if step.estimation > 0 {
                    if overshoot > 0 {
                        Text("+\(TimeFormat.clock(overshoot))")
                            .font(Theme.monoSmall)
                            .foregroundStyle(Theme.flag)
                    } else {
                        Text("·\(TimeFormat.clock(remaining))")
                            .font(Theme.monoSmall)
                            .foregroundStyle(Theme.dim)
                    }
                }
            }
            .padding(.leading, 10)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
        .frame(height: menuBarH)
    }

    private func expandedBody(
        active: (task: TaskPlan, record: TaskRecord),
        step: Step,
        elapsed: TimeInterval,
        remaining: TimeInterval,
        overshoot: TimeInterval,
        isPaused: Bool
    ) -> some View {
        VStack(spacing: 10) {
            HStack(alignment: .firstTextBaseline) {
                Text(step.title)
                    .font(Theme.monoTitle)
                    .foregroundStyle(.white)
                    .lineLimit(2)
                    .multilineTextAlignment(.leading)
                Spacer(minLength: 8)
                if step.estimation > 0 {
                    Text("est \(step.estimation)m")
                        .font(Theme.monoSmall)
                        .foregroundStyle(Theme.dim)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color.white.opacity(0.10))
                        .clipShape(Capsule())
                }
            }

            HStack(alignment: .firstTextBaseline, spacing: 8) {
                Text(TimeFormat.clock(elapsed))
                    .font(Theme.monoTimer)
                    .foregroundStyle(.white)
                if step.estimation > 0 {
                    if overshoot > 0 {
                        Text("+\(TimeFormat.clock(overshoot))")
                            .font(Theme.mono)
                            .foregroundStyle(Theme.flag)
                    } else {
                        Text("/ \(TimeFormat.clock(remaining))")
                            .font(Theme.mono)
                            .foregroundStyle(Theme.dim)
                    }
                }
                Spacer()
            }

            HStack(spacing: 8) {
                pillButton(
                    title: isPaused ? "Resume" : "Pause",
                    systemImage: isPaused ? "play.fill" : "pause.fill"
                ) {
                    isPaused
                        ? store.resume(taskId: active.task.id)
                        : store.pause(taskId: active.task.id)
                }
                pillButton(title: "Next", systemImage: "forward.end.fill") {
                    store.nextStep(taskId: active.task.id)
                }
            }
        }
        .padding(.horizontal, 16)
        .padding(.top, 6)
        .padding(.bottom, 14)
        .frame(maxWidth: .infinity, alignment: .leading)
    }

    private func pillButton(title: String, systemImage: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Label(title, systemImage: systemImage)
                .font(Theme.mono)
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 6)
                .background(Color.white.opacity(0.14))
                .clipShape(RoundedRectangle(cornerRadius: 6))
        }
        .buttonStyle(.plain)
    }
}

struct NotchShape: Shape {
    let notchWidth: CGFloat
    let menuBarHeight: CGFloat

    func path(in rect: CGRect) -> Path {
        let outerR: CGFloat = 14
        let innerR: CGFloat = 8
        let halfNotch = notchWidth / 2
        let cx = rect.midX
        let notchLeft = cx - halfNotch
        let notchRight = cx + halfNotch
        let cutoutBottom = rect.minY + menuBarHeight
        let cutoutTop = rect.minY - 1
        let bottomIsRounded = rect.height > menuBarHeight + outerR

        var p = Path()

        // Outer boundary: top flat, bottom rounded (when expanded)
        p.move(to: CGPoint(x: rect.minX, y: rect.minY))
        p.addLine(to: CGPoint(x: rect.maxX, y: rect.minY))
        if bottomIsRounded {
            p.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY - outerR))
            p.addQuadCurve(
                to: CGPoint(x: rect.maxX - outerR, y: rect.maxY),
                control: CGPoint(x: rect.maxX, y: rect.maxY)
            )
            p.addLine(to: CGPoint(x: rect.minX + outerR, y: rect.maxY))
            p.addQuadCurve(
                to: CGPoint(x: rect.minX, y: rect.maxY - outerR),
                control: CGPoint(x: rect.minX, y: rect.maxY)
            )
        } else {
            p.addLine(to: CGPoint(x: rect.maxX, y: rect.maxY))
            p.addLine(to: CGPoint(x: rect.minX, y: rect.maxY))
        }
        p.closeSubpath()

        // Cutout: matches the hardware notch (rounded inner bottom corners)
        p.move(to: CGPoint(x: notchLeft, y: cutoutTop))
        p.addLine(to: CGPoint(x: notchLeft, y: cutoutBottom - innerR))
        p.addQuadCurve(
            to: CGPoint(x: notchLeft + innerR, y: cutoutBottom),
            control: CGPoint(x: notchLeft, y: cutoutBottom)
        )
        p.addLine(to: CGPoint(x: notchRight - innerR, y: cutoutBottom))
        p.addQuadCurve(
            to: CGPoint(x: notchRight, y: cutoutBottom - innerR),
            control: CGPoint(x: notchRight, y: cutoutBottom)
        )
        p.addLine(to: CGPoint(x: notchRight, y: cutoutTop))
        p.closeSubpath()

        return p
    }
}
