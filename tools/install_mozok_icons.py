# [PT-BR]: Script de geração e instalação de ícones multiplataforma do MOZOK (ICO, PNGs, PWA e GitHub).
# [EN-GB]: Multi-platform icon generator and installation script for MOZOK (ICO, PNGs, PWA, and GitHub).
# [AI-CTX]: @llm-context: Generates official high-resolution branding assets (ICO, 192px, 512px, apple-touch-icon, repo-icon, social-preview).
#           @llm-invariant: Prioritizes official Gemini artwork, exports exact sizes for Windows native desktop, PWA, and GitHub previews.
#           @llm-neuroscience: Features dual cerebral hemispheres, neural connectome, and deep cortical micro-architecture.

import os
import sys
from PIL import Image, ImageDraw

PRIMARY_ICON_SOURCE = r"E:\OneDrive\Downloads\Gemini_Generated_Image_bdp3mcbdp3mcbdp3.jpeg"

def create_procedural_brain_icon(size=512):
    """
    [PT-BR]: Gerador procedural de emergência caso nenhuma imagem base esteja presente.
    [EN-GB]: Emergency procedural generator in case no base image is present.
    """
    img = Image.new("RGBA", (size, size), (2, 6, 23, 255))
    draw = ImageDraw.Draw(img)

    pad = int(size * 0.04)
    r = int(size * 0.18)
    draw.rounded_rectangle(
        [pad, pad, size - pad, size - pad],
        radius=r,
        outline=(0, 242, 254, 180),
        width=int(size * 0.015)
    )

    cx, cy = size // 2, size // 2
    hemi_w = int(size * 0.34)
    hemi_h = int(size * 0.38)

    draw.ellipse(
        [cx - hemi_w - int(size * 0.02), cy - hemi_h // 2, cx - int(size * 0.02), cy + hemi_h // 2],
        outline=(0, 242, 254, 220),
        width=int(size * 0.02)
    )

    draw.ellipse(
        [cx + int(size * 0.02), cy - hemi_h // 2, cx + hemi_w + int(size * 0.02), cy + hemi_h // 2],
        outline=(56, 189, 248, 220),
        width=int(size * 0.02)
    )

    draw.line(
        [(cx, cy - int(size * 0.18)), (cx, cy + int(size * 0.18))],
        fill=(248, 250, 252, 200),
        width=int(size * 0.018)
    )

    nodes = [
        (cx - int(size * 0.18), cy - int(size * 0.10), (0, 242, 254), int(size * 0.035)),
        (cx + int(size * 0.18), cy - int(size * 0.10), (56, 189, 248), int(size * 0.035)),
        (cx - int(size * 0.12), cy + int(size * 0.12), (245, 158, 11), int(size * 0.032)),
        (cx + int(size * 0.12), cy + int(size * 0.12), (251, 191, 36), int(size * 0.032)),
        (cx, cy - int(size * 0.04), (16, 185, 129), int(size * 0.040)),
        (cx, cy + int(size * 0.28), (56, 189, 248), int(size * 0.028)),
    ]

    connections = [
        (0, 1), (0, 2), (1, 3), (2, 3), (0, 4), (1, 4), (2, 4), (3, 4), (2, 5), (3, 5)
    ]
    for i1, i2 in connections:
        p1 = (nodes[i1][0], nodes[i1][1])
        p2 = (nodes[i2][0], nodes[i2][1])
        draw.line([p1, p2], fill=(148, 163, 184, 140), width=int(size * 0.012))

    for nx, ny, color, rad in nodes:
        draw.ellipse([nx - rad * 1.5, ny - rad * 1.5, nx + rad * 1.5, ny + rad * 1.5], fill=(*color, 60))
        draw.ellipse([nx - rad, ny - rad, nx + rad, ny + rad], fill=(*color, 255))
        draw.ellipse([nx - rad * 0.35, ny - rad * 0.35, nx + rad * 0.35, ny + rad * 0.35], fill=(255, 255, 255, 220))

    return img

def create_social_preview(base_img, width=1280, height=640):
    """
    [PT-BR]: Gera cartão social preview 1280x640 para GitHub com fundo escuro neuroanatômico e logotipo centrado.
    [EN-GB]: Generates 1280x640 social preview card for GitHub with dark neuroanatomical background and centered logo.
    """
    canvas = Image.new("RGBA", (width, height), (2, 6, 23, 255))
    draw = ImageDraw.Draw(canvas)

    # Gradiente sutil radial simulado ao fundo
    cx, cy = width // 2, height // 2
    for r in range(400, 0, -40):
        alpha = int(25 * (1.0 - r / 400.0))
        draw.ellipse([cx - r * 1.5, cy - r, cx + r * 1.5, cy + r], fill=(0, 242, 254, alpha))

    # Redimensiona o logotipo para altura de 580px
    logo_size = 580
    logo = base_img.resize((logo_size, logo_size), Image.Resampling.LANCZOS)
    pos_x = (width - logo_size) // 2
    pos_y = (height - logo_size) // 2
    canvas.paste(logo, (pos_x, pos_y), logo if logo.mode == "RGBA" else None)

    return canvas

def load_master_image(repo_root):
    """
    [PT-BR]: Carrega imagem mestre priorizando o arquivo de alta resolução fornecido.
    [EN-GB]: Loads master image prioritizing the provided high-resolution file.
    """
    # 1. Prioridade máxima: imagem gerada oficial
    if os.path.exists(PRIMARY_ICON_SOURCE):
        print(f"[OK] Carregando imagem mestre prioritária: {PRIMARY_ICON_SOURCE}")
        try:
            img = Image.open(PRIMARY_ICON_SOURCE).convert("RGBA")
            # Garante formato quadrado
            w, h = img.size
            if w != h:
                min_dim = min(w, h)
                left = (w - min_dim) // 2
                top = (h - min_dim) // 2
                img = img.crop((left, top, left + min_dim, top + min_dim))
            return img
        except Exception as e:
            print(f"[AVISO] Falha ao abrir {PRIMARY_ICON_SOURCE}: {e}")

    # 2. Segunda prioridade: assets/icon.png existente
    assets_icon = os.path.join(repo_root, "assets", "icon.png")
    if os.path.exists(assets_icon):
        print(f"[OK] Carregando ícone existente de assets: {assets_icon}")
        try:
            return Image.open(assets_icon).convert("RGBA")
        except Exception as e:
            print(f"[AVISO] Falha ao abrir {assets_icon}: {e}")

    # 3. Fallback procedural
    print("[INFO] Gerando ícone procedural biológico...")
    return create_procedural_brain_icon(512)

def main():
    repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    assets_dir = os.path.join(repo_root, "assets")
    web_dir = os.path.join(repo_root, "web")
    web_assets_dir = os.path.join(web_dir, "assets")
    github_dir = os.path.join(repo_root, ".github")

    os.makedirs(assets_dir, exist_ok=True)
    os.makedirs(web_dir, exist_ok=True)
    os.makedirs(web_assets_dir, exist_ok=True)
    os.makedirs(github_dir, exist_ok=True)

    master_img = load_master_image(repo_root)

    # 1. assets/icon.png (512x512)
    icon_512 = master_img.resize((512, 512), Image.Resampling.LANCZOS)
    icon_png_path = os.path.join(assets_dir, "icon.png")
    icon_512.save(icon_png_path, "PNG")
    print(f"[OK] Gravado {icon_png_path} (512x512)")

    # 2. assets/icon.ico (256, 128, 64, 48, 32, 16)
    icon_ico_path = os.path.join(assets_dir, "icon.ico")
    icon_512.save(
        icon_ico_path,
        format="ICO",
        sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
    )
    print(f"[OK] Gravado {icon_ico_path} (Multi-resolução ICO)")

    # 3. web/favicon.ico (64, 32, 16)
    favicon_path = os.path.join(web_dir, "favicon.ico")
    icon_512.save(favicon_path, format="ICO", sizes=[(64, 64), (32, 32), (16, 16)])
    print(f"[OK] Gravado {favicon_path} (64, 32, 16)")

    # 4. web/assets/icon.png (512x512)
    web_icon_path = os.path.join(web_assets_dir, "icon.png")
    icon_512.save(web_icon_path, "PNG")
    print(f"[OK] Gravado {web_icon_path} (512x512)")

    # 5. web/assets/icon-192.png (192x192)
    icon192_path = os.path.join(web_assets_dir, "icon-192.png")
    master_img.resize((192, 192), Image.Resampling.LANCZOS).save(icon192_path, "PNG")
    print(f"[OK] Gravado {icon192_path} (192x192)")

    # 6. web/assets/icon-512.png (512x512)
    icon512_path = os.path.join(web_assets_dir, "icon-512.png")
    icon_512.save(icon512_path, "PNG")
    print(f"[OK] Gravado {icon512_path} (512x512)")

    # 7. web/assets/apple-touch-icon.png (180x180)
    apple_path = os.path.join(web_assets_dir, "apple-touch-icon.png")
    master_img.resize((180, 180), Image.Resampling.LANCZOS).save(apple_path, "PNG")
    print(f"[OK] Gravado {apple_path} (180x180)")

    # 8. .github/repo-icon.png (512x512)
    repo_icon_path = os.path.join(github_dir, "repo-icon.png")
    icon_512.save(repo_icon_path, "PNG")
    print(f"[OK] Gravado {repo_icon_path} (512x512)")

    # 9. .github/social-preview.png (1280x640)
    social_preview_path = os.path.join(github_dir, "social-preview.png")
    social_img = create_social_preview(master_img, 1280, 640)
    social_img.save(social_preview_path, "PNG")
    print(f"[OK] Gravado {social_preview_path} (1280x640)")

    # 10. Atualiza project.godot se existir
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
            print("[OK] Configurado config/windows_native_icon no project.godot")

    print("\n[SUCESSO] Todos os ícones e cards visuais do MOZOK foram gerados com perfeição.")

if __name__ == "__main__":
    main()
