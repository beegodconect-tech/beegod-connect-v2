# BeeGod Connect V2.2 — Firebase funcionando

Projeto HTML puro conectado ao Firebase/Firestore do projeto `beegod-connect`.

## Como testar
1. Abra `index.html` no navegador.
2. Clique em **Pedir música** e envie um teste.
3. No Firebase Console, confira a coleção `requests`.
4. Abra `index.html#dj` para ver o painel do DJ em tempo real.

## Coleções usadas
- `requests`: pedidos de música.
- `dedications`: dedicatórias.
- `support`: registros de apoio/Pix copiado.
- `users`: reservado para login/admin futuro.

## Observação
As regras do Firestore estão públicas apenas para desenvolvimento. Antes de usar oficialmente em evento, protegeremos com autenticação.

## Painel do DJ

Abra `admin.html` para acessar o painel do DJ.

Senha inicial: `beegod2026`

O painel lê em tempo real as coleções:
- `requests`
- `dedications`
- `support`

Ações disponíveis:
- Aceitar
- Tocada
- Recusar
