# Aplicativo de streaming de câmeras de segurança

Este projeto é uma aplicação de monitoramento de vídeo em tempo real que simula alertas e zonas restritas sobre câmeras de segurança.
---

### Como executar o projeto?
* 1.- Clone o repositório
* 2.- Acesse a pasta raiz do projeto: cd frontend
* 3.- Instale as dependências necessárias: npm install
* 4.- Montagem do servidor: npm start
* 5.- Accesar a http://localhost:3000/

O projeto é basicamente uma aplicação de streaming de câmeras de segurança.
As câmeras de segurança foram simuladas utilizando arquivos .m3u8 para o serviço de streaming. Foram utilizados streamings públicos abertos.
Assim que o usuário acessa a aplicação pela primeira vez, uma série de alertas e câmeras predefinidas são carregadas. Essas câmeras começam a receber sinal e se estabilizam por meio da biblioteca HLS.js. Quanto mais câmeras houver, mais tempo o sistema pode levar para estabilizá-las. No entanto, uma vez carregados, os streamings se mantêm estáveis.

## Funcionalidades
Canvas de zonas restritas:
Um canvas é sobreposto ao vídeo para simular áreas proibidas. Essas áreas podem ser desenhadas, editadas ou removidas diretamente pelo usuário.
Canvas de alertas:
Um segundo canvas é usado para gerar alertas de forma aleatória. Em intervalos aleatórios, essas áreas aparecem como simulação de detecção de invasões ou uso indevido de EPI.

## Exemplo de funcionamento
Streaming de câmeras usando arquivos .m3u8
Geração de alertas dinâmicos sobre o vídeo
Gráficos estatísticos de alertas por tipo e por período
Visualização no mapa das localizações das câmeras
