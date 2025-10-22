import SwiftUI

struct FollowwTheme {
    // MARK: - Colors

    struct Colors {
        // Primary palette
        static let mistWhite = Color(hex: "#F9FAFB")!
        static let graphite = Color(hex: "#1C1C1E")!
        static let accentBlue = Color(hex: "#3A76F0")!

        // Neutrals
        static let gray50 = Color(hex: "#F9FAFB")!
        static let gray100 = Color(hex: "#F3F4F6")!
        static let gray200 = Color(hex: "#E5E7EB")!
        static let gray300 = Color(hex: "#D1D5DB")!
        static let gray400 = Color(hex: "#9CA3AF")!
        static let gray500 = Color(hex: "#6B7280")!
        static let gray600 = Color(hex: "#4B5563")!
        static let gray700 = Color(hex: "#374151")!
        static let gray800 = Color(hex: "#1F2937")!
        static let gray900 = Color(hex: "#111827")!

        // Semantic colors
        static let success = Color(hex: "#10B981")!
        static let warning = Color(hex: "#F59E0B")!
        static let error = Color(hex: "#EF4444")!

        // Theme-aware colors
        static func background(for colorScheme: ColorScheme) -> Color {
            colorScheme == .dark ? graphite : mistWhite
        }

        static func cardBackground(for colorScheme: ColorScheme) -> Color {
            colorScheme == .dark ? Color(hex: "#2C2C2E")! : .white
        }

        static func text(for colorScheme: ColorScheme) -> Color {
            colorScheme == .dark ? mistWhite : graphite
        }

        static func secondaryText(for colorScheme: ColorScheme) -> Color {
            colorScheme == .dark ? gray400 : gray600
        }
    }

    // MARK: - Typography

    struct Typography {
        static let largeTitle = Font.system(size: 34, weight: .bold, design: .default)
        static let title = Font.system(size: 28, weight: .semibold, design: .default)
        static let title2 = Font.system(size: 22, weight: .semibold, design: .default)
        static let title3 = Font.system(size: 20, weight: .semibold, design: .default)
        static let headline = Font.system(size: 17, weight: .semibold, design: .default)
        static let body = Font.system(size: 17, weight: .regular, design: .default)
        static let callout = Font.system(size: 16, weight: .regular, design: .default)
        static let subheadline = Font.system(size: 15, weight: .regular, design: .default)
        static let footnote = Font.system(size: 13, weight: .regular, design: .default)
        static let caption = Font.system(size: 12, weight: .regular, design: .default)
        static let caption2 = Font.system(size: 11, weight: .regular, design: .default)
    }

    // MARK: - Spacing

    struct Spacing {
        static let xs: CGFloat = 4
        static let sm: CGFloat = 8
        static let md: CGFloat = 16
        static let lg: CGFloat = 24
        static let xl: CGFloat = 32
        static let xxl: CGFloat = 48
    }

    // MARK: - Corner Radius

    struct CornerRadius {
        static let sm: CGFloat = 8
        static let md: CGFloat = 12
        static let lg: CGFloat = 16
        static let xl: CGFloat = 24
    }

    // MARK: - Shadows

    struct Shadow {
        static let sm: CGFloat = 2
        static let md: CGFloat = 4
        static let lg: CGFloat = 8
        static let xl: CGFloat = 16
    }

    // MARK: - Animation

    struct Animation {
        static let fast: SwiftUI.Animation = .easeInOut(duration: 0.18)
        static let normal: SwiftUI.Animation = .easeInOut(duration: 0.22)
        static let slow: SwiftUI.Animation = .easeInOut(duration: 0.3)
    }
}

// MARK: - View Modifiers

struct CardStyle: ViewModifier {
    @Environment(\.colorScheme) var colorScheme

    func body(content: Content) -> some View {
        content
            .background(FollowwTheme.Colors.cardBackground(for: colorScheme))
            .cornerRadius(FollowwTheme.CornerRadius.md)
            .shadow(color: Color.black.opacity(0.05), radius: FollowwTheme.Shadow.sm, x: 0, y: 2)
    }
}

struct PrimaryButtonStyle: ButtonStyle {
    @Environment(\.colorScheme) var colorScheme
    let isDestructive: Bool

    init(isDestructive: Bool = false) {
        self.isDestructive = isDestructive
    }

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(FollowwTheme.Typography.callout)
            .foregroundColor(.white)
            .padding(.horizontal, FollowwTheme.Spacing.md)
            .padding(.vertical, FollowwTheme.Spacing.sm)
            .background(isDestructive ? FollowwTheme.Colors.error : FollowwTheme.Colors.accentBlue)
            .cornerRadius(FollowwTheme.CornerRadius.sm)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(FollowwTheme.Animation.fast, value: configuration.isPressed)
    }
}

struct SecondaryButtonStyle: ButtonStyle {
    @Environment(\.colorScheme) var colorScheme

    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .font(FollowwTheme.Typography.callout)
            .foregroundColor(FollowwTheme.Colors.text(for: colorScheme))
            .padding(.horizontal, FollowwTheme.Spacing.md)
            .padding(.vertical, FollowwTheme.Spacing.sm)
            .background(FollowwTheme.Colors.gray200)
            .cornerRadius(FollowwTheme.CornerRadius.sm)
            .opacity(configuration.isPressed ? 0.8 : 1.0)
            .scaleEffect(configuration.isPressed ? 0.98 : 1.0)
            .animation(FollowwTheme.Animation.fast, value: configuration.isPressed)
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardStyle())
    }
}
