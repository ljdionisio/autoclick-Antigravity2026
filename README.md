# 🖱️ AutoClick Antigravity V5.0

**Clique automático para botões Accept/Continue/Confirm no Cursor IDE e Antigravity.**

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 🚀 Como Usar

### Opção 1: Executar Diretamente (Recomendado)
```bash
# Duplo clique no arquivo:
START_AUTOCLICK.bat
```

### Opção 2: Linha de Comando
```bash
# Instalar dependências
pip install -r requirements.txt

# Executar
python autoclick.py
```

---

## ⌨️ Controles

| Tecla | Ação |
|-------|------|
| **F9** | Ativar/Desativar AutoClick |
| **F10** | Sair do programa |

---

## 📸 Botões Detectados

O AutoClick detecta automaticamente os seguintes botões na tela:

- ✅ `Accept All` - Aceitar todas as alterações
- ✅ `Accept Alt` - Aceitar alternativa
- ✅ `Accept Changes` - Aceitar mudanças
- ✅ `Confirm` - Confirmar ação

> As imagens estão na pasta `Botoes do Antigravity ACCEPT ALL/`

---

## ⚙️ Configurações

Edite o arquivo `autoclick.py` para ajustar:

```python
SCAN_INTERVAL = 0.3  # Segundos entre cada scan (menor = mais rápido)
CONFIDENCE = 0.8     # Confiança mínima para match (0.0 a 1.0)
CLICK_DELAY = 0.1    # Delay após clicar
```

---

## 📋 Requisitos

- Python 3.10 ou superior
- Windows 10/11
- Bibliotecas: pyautogui, opencv-python, keyboard, Pillow

---

## 🛠️ Estrutura do Projeto

```
PROJETO AUTO-CLICK ANTIGRAVITY/
├── autoclick.py              # Script principal
├── requirements.txt          # Dependências Python
├── START_AUTOCLICK.bat       # Inicializador Windows
├── Botoes do Antigravity ACCEPT ALL/
│   ├── Accept All.png
│   ├── Accept Alt.png
│   ├── Accept Changes Ctrl.png
│   └── Confirm.png
└── README.md
```

---

## ⚠️ Aviso

Este software automatiza cliques na tela. Use com responsabilidade.
O AutoClick só funciona enquanto estiver em execução no terminal.

---

## 📄 Licença

MIT License - Use livremente!
