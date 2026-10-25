# [PT-BR]: Script de geração e instalação de ícones multiplataforma do MOZOK (ICO, PNGs e PWA).
# [EN-GB]: Multi-platform icon generator and installation script for MOZOK (ICO, PNGs, and PWA).
# [AI-CTX]: @llm-context: Generates official high-resolution branding assets (ICO, 192px, 512px, apple-touch-icon).
#           @llm-invariant: Guarantees proper icon files exist for Godot 4, Web PWA manifest, and native desktop app.
#           @llm-neuroscience: Features dual cerebral hemispheres and bioluminescent synaptic connectome nodes.

import os
import sys
from PIL import Image, ImageDraw

def create_procedural_brain_icon(size=512):
    # Fundo azul-marinho profundo neurobiológico (#030914)
    img = Image.new("RGBA", (size, size), (3, 9, 20, 255))
    draw = ImageDraw.Draw(img)

    # Borda externa arredondada suave
    pad = int(size * 0.04)
    r = int(size * 0.18)
    draw.rounded_rectangle(
        [pad, pad, size - pad, size - pad],
        radius=r,
        outline=(0, 242, 254, 180),
        width=int(size * 0.015)
    )

    # Brilho sutil do hemisfério cerebral esquerdo e direito
    cx, cy = size // 2, size // 2
    hemi_w = int(size * 0.34)
    hemi_h = int(size * 0.38)

    # Hemisfério Esquerdo (Azul ciano #00f2fe)
    draw.ellipse(
        [cx - hemi_w - int(size * 0.02), cy - hemi_h // 2, cx - int(size * 0.02), cy + hemi_h // 2],
        outline=(0, 242, 254, 220),
        width=int(size * 0.02)
    )

    # Hemisfério Direito (Azul céu #38bdf8)
    draw.ellipse(
        [cx + int(size * 0.02), cy - hemi_h // 2, cx + hemi_w + int(size * 0.02), cy + hemi_h // 2],
        outline=(56, 189, 248, 220),
        width=int(size * 0.02)
    )

    # Corpo Caloso / Fenda Inter-hemisférica
    draw.line(
        [(cx, cy - int(size * 0.18)), (cx, cy + int(size * 0.18))],
        fill=(248, 250, 252, 200),
        width=int(size * 0.018)
    )

    # Nós e Conectoma Sináptico Bioluminescente
    nodes = [
        (cx - int(size * 0.18), cy - int(size * 0.10), (0, 242, 254), int(size * 0.035)),
        (cx + int(size * 0.18), cy - int(size * 0.10), (56, 189, 248), int(size * 0.035)),
        (cx - int(size * 0.12), cy + int(size * 0.12), (245, 158, 11), int(size * 0.032)),
        (cx + int(size * 0.12), cy + int(size * 0.12), (251, 191, 36), int(size * 0.032)),
        (cx, cy - int(size * 0.04), (16, 185, 129), int(size * 0.040)),
        (cx, cy + int(size * 0.28), (56, 189, 248), int(size * 0.028)), # Tronco / Medula
    ]

    # Linhas de sinapses
    connections = [
        (0, 1), (0, 2), (1, 3), (2, 3), (0, 4), (1, 4), (2, 4), (3, 4), (2, 5), (3, 5)
    ]
    for i1, i2 in connections:
        p1 = (nodes[i1][0], nodes[i1][1])
        p2 = (nodes[i2][0], nodes[i2][1])
        draw.line([p1, p2], fill=(148, 163, 184, 140), width=int(size * 0.012))

    # Desenha os nós bioluminescentes
    for nx, ny, color, rad in nodes:
        # Halo
        draw.ellipse([nx - rad * 1.5, ny - rad * 1.5, nx + rad * 1.5, ny + rad * 1.5], fill=(*color, 60))
        # Núcleo
        draw.ellipse([nx - rad, ny - rad, nx + rad, ny + rad], fill=(*color, 255))
        # Ponto de reflexo central
        draw.ellipse([nx - rad * 0.35, ny - rad * 0.35, nx + rad * 0.35, ny + rad * 0.35], fill=(255, 255, 255, 220))

    return img

def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets_dir = os.path.join(repo_root, "assets")
    web_dir = os.path.join(repo_root, "web")
    web_assets_dir = os.path.join(web_dir, "assets")

    os.makedirs(assets_dir, exist_ok=True)
    os.makedirs(web_assets_dir, exist_ok=True)

    icon_png_path = os.path.join(assets_dir, "icon.png")
    if os.path.exists(icon_png_path):
        try:
            base_img = Image.open(icon_png_path).convert("RGBA")
        except Exception:
            base_img = create_procedural_brain_icon(512)
            base_img.save(icon_png_path, "PNG")
    else:
        base_img = create_procedural_brain_icon(512)
        base_img.save(icon_png_path, "PNG")
        print(f"[OK] Gerado {icon_png_path} (512x512)")

    # 1. assets/icon.ico (256, 64, 32, 16)
    icon_ico_path = os.path.join(assets_dir, "icon.ico")
    base_img.save(icon_ico_path, format="ICO", sizes=[(256, 256), (64, 64), (32, 32), (16, 16)])
    print(f"[OK] Gerado {icon_ico_path}")

    # 2. web/favicon.ico (64, 32, 16)
    favicon_path = os.path.join(web_dir, "favicon.ico")
    base_img.save(favicon_path, format="ICO", sizes=[(64, 64), (32, 32), (16, 16)])
    print(f"[OK] Gerado {favicon_path}")

    # 3. web/assets/icon-192.png
    icon192_path = os.path.join(web_assets_dir, "icon-192.png")
    base_img.resize((192, 192), Image.Resampling.LANCZOS).save(icon192_path, "PNG")
    print(f"[OK] Gerado {icon192_path}")

    # 4. web/assets/icon-512.png
    icon512_path = os.path.join(web_assets_dir, "icon-512.png")
    base_img.resize((512, 512), Image.Resampling.LANCZOS).save(icon512_path, "PNG")
    print(f"[OK] Gerado {icon512_path}")

    # 5. web/assets/apple-touch-icon.png (180x180)
    apple_path = os.path.join(web_assets_dir, "apple-touch-icon.png")
    base_img.resize((180, 180), Image.Resampling.LANCZOS).save(apple_path, "PNG")
    print(f"[OK] Gerado {apple_path}")

    # 6. Atualiza project.godot com o ícone nativo do Windows
    godot_file = os.path.join(repo_root, "project.godot")
    if os.path.exists(godot_file):
        with open(godot_file, "r", encoding="utf-8") as f:
            content = f.read()
        if 'config/windows_native_icon=' not in content:
            content = content.replace(
                'config/icon="res://assets/icon.svg"',
                'config/icon="res://assets/icon.svg"\nconfig/windows_native_icon="res://assets/icon.ico"'
            )
            with open(godot_file, "w", encoding="utf-8") as f:
                f.write(content)
            print("[OK] Adicionado config/windows_native_icon ao project.godot")

if __name__ == "__main__":
    main()
