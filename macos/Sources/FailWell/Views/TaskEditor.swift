import SwiftUI

struct TaskEditor: View {
    @Environment(AppStore.self) private var store
    @Environment(Router.self) private var router

    let taskId: String?

    @State private var title: String = ""
    @State private var stepsText: String = ""
    @State private var link: String = ""
    @FocusState private var focusedField: Field?

    enum Field { case title, steps, link }

    var body: some View {
        VStack(spacing: 0) {
            header
            Divider()
            form
            Divider()
            footer
        }
        .onAppear(perform: load)
        .onKeyPress(.escape) {
            // Save & exit if anything entered, else just exit.
            saveAndExit()
            return .handled
        }
        .onKeyPress(.init("s"), phases: .down) { event in
            if event.modifiers.contains(.command) {
                saveAndExit()
                return .handled
            }
            return .ignored
        }
    }

    private var header: some View {
        HStack(spacing: 8) {
            Button { router.pop() } label: { Image(systemName: "chevron.left").foregroundStyle(Theme.dim) }
                .buttonStyle(.plain)
            Text(taskId == nil ? "new task" : "edit task").monoTitle()
            Spacer()
            Text("\(totalEstimation)m").monoSmall().foregroundStyle(Theme.dim)
            Button("save") { saveAndExit() }
                .keyboardShortcut(.return, modifiers: .command)
                .buttonStyle(.borderedProminent)
                .controlSize(.small)
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 8)
    }

    private var form: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 12) {
                LabeledField(label: "title") {
                    TextField("", text: $title, prompt: Text("e.g. refactor parser"))
                        .textFieldStyle(.roundedBorder)
                        .font(Theme.mono)
                        .focused($focusedField, equals: .title)
                }
                LabeledField(label: "steps") {
                    TextEditor(text: $stepsText)
                        .font(Theme.mono)
                        .frame(minHeight: 220)
                        .scrollContentBackground(.hidden)
                        .padding(6)
                        .background(Color(nsColor: .textBackgroundColor))
                        .overlay(RoundedRectangle(cornerRadius: 4).stroke(Color(nsColor: .separatorColor)))
                        .focused($focusedField, equals: .steps)
                }
                Text("format: `- step | minutes`. indent with spaces or tab to group children under a parent.")
                    .monoSmall().foregroundStyle(Theme.dim)

                LabeledField(label: "link") {
                    TextField("", text: $link, prompt: Text("optional"))
                        .textFieldStyle(.roundedBorder)
                        .font(Theme.mono)
                        .focused($focusedField, equals: .link)
                }
            }
            .padding(12)
        }
        .onAppear { focusedField = .title }
    }

    private var footer: some View {
        HStack(spacing: 12) {
            Text("⌘↵ or ⌘S save").monoSmall().foregroundStyle(Theme.dim)
            Text("esc save & back").monoSmall().foregroundStyle(Theme.dim)
            Spacer()
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 6)
    }

    private var totalEstimation: Int {
        StepParser.adaptTextareaToSteps(stepsText).reduce(0) { $0 + $1.estimation }
    }

    private func load() {
        guard let taskId, let task = store.task(id: taskId) else { return }
        title = task.title
        stepsText = StepParser.adaptStepsToTextarea(task.steps)
        link = task.link ?? ""
    }

    private func saveAndExit() {
        let trimmedTitle = title.trimmingCharacters(in: .whitespaces)
        let steps = StepParser.adaptTextareaToSteps(stepsText)
        guard !trimmedTitle.isEmpty, !steps.isEmpty else {
            router.pop()
            return
        }
        let id = taskId ?? UUID().uuidString
        let existing = taskId.flatMap { store.task(id: $0) }
        let stepHistory = (existing?.stepHistory ?? []) + [steps]
        let task = TaskPlan(
            id: id,
            title: trimmedTitle,
            date: existing?.date ?? Date(),
            link: link.isEmpty ? nil : link,
            stepHistory: stepHistory
        )
        store.upsertTask(task)
        router.replace(with: .detail(taskId: id))
    }
}

private struct LabeledField<Content: View>: View {
    let label: String
    @ViewBuilder let content: () -> Content

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(label).monoSmall().foregroundStyle(Theme.dim)
            content()
        }
    }
}
