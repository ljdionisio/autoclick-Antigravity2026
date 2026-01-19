"""
╔═══════════════════════════════════════════════════════════════════╗
║                    ANTIGRAVITY AUTOCLICK V5.0                      ║
║         Clique Automático para Botões Accept/Continue              ║
╚═══════════════════════════════════════════════════════════════════╝

Este script detecta automaticamente botões de aceite na tela e clica neles.
Ideal para usar com Cursor IDE / Antigravity para aceitar sugestões automaticamente.

CONTROLES:
  F9  = Ativar/Desativar AutoClick
  F10 = Sair do programa
  
REQUISITOS:
  pip install pyautogui opencv-python keyboard pillow
"""

import pyautogui
import keyboard
import time
import os
import sys
from pathlib import Path

# ==================== CONFIGURAÇÕES ====================
SCAN_INTERVAL = 0.3  # Segundos entre cada scan (menor = mais rápido, mais CPU)
CONFIDENCE = 0.8     # Confiança mínima para match (0.0 a 1.0)
CLICK_DELAY = 0.1    # Delay após clicar antes de continuar
REGION = None        # None = tela inteira, ou (x, y, width, height) para região específica

# ==================== ESTADO GLOBAL ====================
autoclick_active = False
running = True

# ==================== CORES PARA TERMINAL ====================
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    END = '\033[0m'
    BOLD = '\033[1m'

def print_banner():
    os.system('cls' if os.name == 'nt' else 'clear')
    print(f"""{Colors.CYAN}
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║     █████╗ ██╗   ██╗████████╗ ██████╗  ██████╗██╗     ██╗ ██████╗██╗  ██╗ ║
║    ██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗██╔════╝██║     ██║██╔════╝██║ ██╔╝ ║
║    ███████║██║   ██║   ██║   ██║   ██║██║     ██║     ██║██║     █████╔╝  ║
║    ██╔══██║██║   ██║   ██║   ██║   ██║██║     ██║     ██║██║     ██╔═██╗  ║
║    ██║  ██║╚██████╔╝   ██║   ╚██████╔╝╚██████╗███████╗██║╚██████╗██║  ██╗ ║
║    ╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝  ╚═════╝╚══════╝╚═╝ ╚═════╝╚═╝  ╚═╝ ║
║                                                                   ║
║                    ANTIGRAVITY V5.0                               ║
║          Aceite Automático para Cursor/IDE                        ║
║                                                                   ║
╠═══════════════════════════════════════════════════════════════════╣
║  {Colors.GREEN}F9{Colors.CYAN}  = Ativar/Desativar AutoClick                              ║
║  {Colors.RED}F10{Colors.CYAN} = Sair do programa                                        ║
╚═══════════════════════════════════════════════════════════════════╝{Colors.END}
    """)

def get_button_images():
    """Retorna lista de imagens de botões para detectar"""
    script_dir = Path(__file__).parent
    buttons_dir = script_dir / "Botoes do Antigravity ACCEPT ALL"
    
    images = []
    if buttons_dir.exists():
        for img_file in buttons_dir.glob("*.png"):
            images.append({
                'path': str(img_file),
                'name': img_file.stem
            })
    
    # Se não encontrar a pasta, tentar no diretório atual
    if not images:
        current_dir = Path(".")
        for pattern in ["Accept*.png", "Confirm*.png", "Continue*.png", "OK*.png"]:
            for img_file in current_dir.glob(pattern):
                images.append({
                    'path': str(img_file),
                    'name': img_file.stem
                })
    
    return images

def toggle_autoclick():
    """Alterna estado do AutoClick"""
    global autoclick_active
    autoclick_active = not autoclick_active
    
    if autoclick_active:
        print(f"\n{Colors.GREEN}{Colors.BOLD}✓ AUTOCLICK ATIVADO!{Colors.END}")
        print(f"  {Colors.CYAN}Escaneando tela a cada {SCAN_INTERVAL}s...{Colors.END}")
    else:
        print(f"\n{Colors.YELLOW}{Colors.BOLD}⏸ AUTOCLICK PAUSADO{Colors.END}")

def exit_program():
    """Sai do programa"""
    global running
    running = False
    print(f"\n{Colors.RED}Saindo...{Colors.END}")

def find_and_click_button(image_info):
    """Tenta encontrar e clicar em um botão"""
    try:
        location = pyautogui.locateOnScreen(
            image_info['path'],
            confidence=CONFIDENCE,
            region=REGION,
            grayscale=True
        )
        
        if location:
            # Encontrar o centro do botão
            center = pyautogui.center(location)
            
            # Clicar no botão
            pyautogui.click(center)
            
            print(f"  {Colors.GREEN}✓ Clicado: {image_info['name']}{Colors.END} em ({center.x}, {center.y})")
            
            time.sleep(CLICK_DELAY)
            return True
            
    except Exception as e:
        # Silenciar erros de imagem não encontrada
        pass
    
    return False

def scan_and_click():
    """Loop principal de scan e clique"""
    button_images = get_button_images()
    
    if not button_images:
        print(f"\n{Colors.RED}ERRO: Nenhuma imagem de botão encontrada!{Colors.END}")
        print(f"  Certifique-se de que a pasta 'Botoes do Antigravity ACCEPT ALL' existe")
        print(f"  e contém as imagens dos botões (*.png)")
        return
    
    print(f"\n{Colors.CYAN}Botões carregados: {len(button_images)}{Colors.END}")
    for img in button_images:
        print(f"  • {img['name']}")
    
    print(f"\n{Colors.YELLOW}Pressione F9 para ativar o AutoClick...{Colors.END}")
    
    # Registrar hotkeys
    keyboard.add_hotkey('f9', toggle_autoclick)
    keyboard.add_hotkey('f10', exit_program)
    
    click_count = 0
    
    while running:
        if autoclick_active:
            for img in button_images:
                if find_and_click_button(img):
                    click_count += 1
                    print(f"  {Colors.BLUE}Total de cliques: {click_count}{Colors.END}")
        
        time.sleep(SCAN_INTERVAL)

def main():
    print_banner()
    
    # Verificar se pyautogui está instalado corretamente
    try:
        screen_size = pyautogui.size()
        print(f"{Colors.CYAN}Resolução da tela: {screen_size.width}x{screen_size.height}{Colors.END}")
    except Exception as e:
        print(f"{Colors.RED}Erro ao acessar tela: {e}{Colors.END}")
        return
    
    # Desabilitar failsafe do pyautogui (mover mouse para canto não para o script)
    pyautogui.FAILSAFE = False
    
    try:
        scan_and_click()
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}Interrompido pelo usuário{Colors.END}")
    finally:
        print(f"\n{Colors.CYAN}AutoClick encerrado.{Colors.END}")

if __name__ == "__main__":
    main()
