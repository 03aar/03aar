# Followw Assets

This directory contains app icons and sound files.

## Icons

Replace the placeholder files with actual icons:

- `icon.png` - Main app icon (512x512 PNG)
- `tray-icon.png` - System tray icon (16x16 or 32x32 PNG)

### Icon Requirements

**icon.png** (Main App Icon):
- Size: 512x512 pixels minimum
- Format: PNG with transparency
- Design: Simple, recognizable at small sizes
- Style: Matches Followw's minimalist aesthetic

**tray-icon.png** (Tray Icon):
- Size: 16x16 or 32x32 pixels (will be scaled)
- Format: PNG with transparency
- Design: Simple symbol or monogram
- Style: Works in both light and dark system trays

### Generating Icons

electron-builder will automatically generate platform-specific icons from `icon.png`:

- **Windows**: .ico file with multiple sizes
- **macOS**: .icns file with retina variants
- **Linux**: Various PNG sizes

## Sound Files

Create these WAV files for audio feedback:

### sounds/complete.wav
- **Purpose**: Task completion sound
- **Duration**: 200-300ms
- **Type**: Soft analog click
- **Volume**: -16 LUFS (quiet, non-intrusive)

### sounds/timer.wav
- **Purpose**: Timer stop sound
- **Duration**: 400-600ms
- **Type**: Low-pitch sonar pulse
- **Volume**: -16 LUFS

### sounds/reflection.wav
- **Purpose**: End of day reflection
- **Duration**: 1-2 seconds
- **Type**: Single piano note (G3)
- **Volume**: -16 LUFS

## Creating Your Own

### Icons

**Tools**:
- Figma (web-based, free)
- Sketch (macOS, paid)
- Inkscape (cross-platform, free)
- Adobe Illustrator (paid)

**Design Tips**:
1. Keep it simple - icons should be recognizable at 16x16
2. Use Followw's color palette (Mist White, Graphite, Accent Blue)
3. Maintain consistent stroke width
4. Test at multiple sizes
5. Ensure good contrast in both light/dark modes

**Followw Logo Concept**:
- Two parallel flowing lines curving forward
- Symbolizes motion and balance
- Minimal, geometric, modern

### Sounds

**Tools**:
- Audacity (free)
- GarageBand (macOS, free)
- Ableton Live (paid)

**Tips**:
1. Keep sounds short and subtle
2. Use lower frequencies (easier on ears)
3. Normalize to -16 LUFS
4. Export as WAV for quality
5. Test at system volume levels

**Example Workflow** (Audacity):
1. Generate → Tone (or record instrument)
2. Apply envelope for fade in/out
3. Effect → Normalize to -3dB
4. Export as WAV, 44.1kHz, 16-bit

## Licensing

Ensure any icons or sounds you use are:
- Created by you, or
- Licensed for commercial use, or
- Public domain

Include attribution if required.

## Contributing

If you create beautiful assets for Followw:
1. Submit them via Pull Request
2. Include source files (SVG, Figma, etc.)
3. License them under MIT
4. Get credited in the app!

---

**Need help?** Open an issue or contact the maintainers.
