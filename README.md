# LIMS Site

Site institucional do **LIMS (Laboratory of Innovation on Multimedia Systems)**, laboratório do **IFPI (Instituto Federal do Piauí)**.

O projeto é uma página estática feita com HTML, CSS e JavaScript, sem backend, com o objetivo de apresentar o laboratório, seus pesquisadores, projetos, eventos e localizações.

## Páginas

- **Início** (`index.html`) — apresentação do LIMS
- **O Laboratório** (`paginas/laboratorio.html`)
- **Projetos** (`paginas/projetos.html`)
- **Eventos** (`paginas/eventos.html`)
- **Pesquisadores** (`paginas/pesquisadores.html`)
- **Localizações** (`paginas/localizacoes.html`)

## Tecnologias

- HTML5
- CSS3
- JavaScript (vanilla)

## Como visualizar

Basta abrir o arquivo `index.html` no navegador. Também é possível servir a pasta do projeto com qualquer servidor HTTP estático, por exemplo:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Estrutura

```text
LIMS/
├── index.html
├── paginas/          # Demais páginas do site
├── css/              # Estilos
├── js/               # Scripts (tema, menu, rolagem e projetos)
├── imagens/          # Logos e fotos
├── PDF/              # Materiais em PDF
└── docs/             # Documentação e planejamento
```

## Licença

Este projeto está sob a licença **MIT**. Qualquer pessoa pode usar, copiar, modificar e distribuir o código, desde que mantenha o aviso de direitos autorais e a licença original. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
