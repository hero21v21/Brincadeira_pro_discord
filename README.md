# 🎉 Festa de Aniversário — Windows 98

> Um site ilustrativo e estático que simula um **sistema operacional Windows 98/XP**, criado para celebrar uma festa de aniversário fictícia. Totalmente navegável como se fosse um desktop com janelas, aplicativos e barra de tarefas.

![Status](https://img.shields.io/badge/status-funcionando-green) ![GitHub Pages](https://img.shields.io/badge/hosting-GitHub%20Pages-blue) ![Licença](https://img.shields.io/badge/license-MIT-yellow)

---

## ✨ Funcionalidades

- 🖥️ **Desktop estilo Windows 98** com ícones de aplicativos clicáveis.
- 🪟 **Janelas arrastáveis**, com botões de fechar (`X`) e minimizar (`_`).
- 📋 **Barra de tarefas** com botão `Iniciar`, relógio em tempo real (horário do Brasil) e botões das janelas abertas.
- 🎵 **Player de música retrô** com capas de álbum e links diretos para o Spotify.
- 🎨 **MS Paint da festa**: desenhe, escolha cores e envie o desenho por e-mail.
- ✉️ **Mensagens anônimas** enviadas para o e-mail do organizador via FormSubmit.
- 👥 **Lista de convidados** com campo de pesquisa em tempo real.
- 🎬 **Vídeos**: intro de boot estilo Windows XP + vídeo especial do "Administrador".
- 🖱️ **Som de clique do mouse** ao interagir com o site.

---

## 🚀 Como rodar

### Abrir localmente

Basta abrir o arquivo `index.html` no navegador:

```bash
# Alternativa: subir um servidor local
python -m http.server
# Depois acesse http://localhost:8000
```

> ⚠️ **Importante:** o envio de e-mails (FormSubmit) e alguns recursos só funcionam quando a página é servida via **http/https** (ex.: GitHub Pages), não ao abrir como arquivo local (`file://`).

---

## 🌐 Publicação no GitHub Pages

O projeto publica automaticamente no **GitHub Pages** a cada `push` na branch `main`, usando o GitHub Actions (`.github/workflows/pages.yml`).

1. Faça o commit e push:
   ```bash
   git add .
   git commit -m "nova atualização"
   git push origin main
   ```
2. O workflow publica o site automaticamente.
3. Acesse: `https://SEU_USUARIO.github.io/Brincadeira_pro_discord/`

> Para ativar: repositório → *Settings → Pages → Source: GitHub Actions*.

---

## 📁 Estrutura do projeto

```
Brincadeira_pro_discord/
├── index.html             → página principal (o "desktop")
├── style.css              → todo o estilo Windows 98
├── script.js              → lógica: janelas, player, paint, e-mail, som
├── favicon.ico            → ícone do "Portfólio.exe"
├── boot.mp4               → vídeo de intro (boot do Windows XP)
├── administrador.mp4      → vídeo do "Administrador"
├── mouse-click.mp3        → som de clique do mouse
├── imagens/               → fundos (ex.: fundo-mobile.jpg)
├── musicas/               → faixas MP3 usadas no player
├── .github/workflows/     → deploy automático (GitHub Pages)
└── README.md
```

---

## 🎵 Músicas disponíveis

| Artista       | Música             | Arquivo local       |
| ------------- | ------------------ | ------------------- |
| The Long Faces| Jane!              | `musicas/jane.mp3`  |
| Laufey        | From the Start     | `musicas/from-the-start.mp3` |
| Laufey        | Promise            | `musicas/promise.mp3` |
| Jão           | Idiota             | `musicas/idiota.mp3` |
| Jão           | Aurora             | `musicas/aurora.mp3` |
| 2ZDinizz      | Pensando em Mim    | `musicas/pensando-em-mim.mp3` |
| Cafuné        | Tek It             | `musicas/tek-it.mp3` |

Clicar na capa de cada música abre direto no **Spotify**.

---

## ✉️ Envio de e-mails (FormSubmit)

- **Mensagens anônimas** e **desenhos** são enviados para `victorfassini21@gmail.com` usando o [FormSubmit](https://formsubmit.co/).
- No primeiro uso, é necessário **confirmar a ativação** no link enviado para esse e-mail.
- Os desenhos chegam como **anexo `.png`** real.

---

## 🖥️ Controles do "desktop"

- **Clique nos ícones** → abre a janela correspondente.
- **Segure a barra de título** → arraste a janela.
- **`_`** → minimiza · **`X`** → fecha.
- **Botões da barra de tarefas** → minimizar/restaurar janela.
- **Botão Iniciar** → menu com acesso a todos os apps.

---

## ⚙️ Tecnologias

- HTML5, CSS3, JavaScript (vanilla)
- GitHub Actions + GitHub Pages
- FormSubmit (envio de e-mail)
- Fontes: Vampire Wars, MS Sans Serif/Tahoma

---

## 📝 Licença

Projeto **meramente ilustrativo** — nomes, pessoas, datas e endereços são fictícios. Conteúdos de áudio, vídeo e imagem pertencem aos seus respectivos autores e são usados apenas para fins de demonstração/estudo.

---

Feito com 💜 por **Vickthor1**.