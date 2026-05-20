# 📏 Regras de Negócio — Sistema de Apostas

## Tickets
- Cada usuário começa com **1 ticket**
- 1 ticket é consumido ao fazer qualquer aposta
- O campo `tickets` é inteiro — preparado para múltiplos tickets futuramente
- Sem ticket → erro 400

## Apostas
- Apenas **1 aposta por partida por usuário** (UNIQUE constraint no banco)
- Aposta em placar de gols (inteiros >= 0)
- Não é possível apostar em partidas com `status = 'finished'`
- Não é possível apostar em partidas cuja `match_date` já passou

## Pontuação (implementada, aguarda Grupo 3 acionar)
| Cenário                          | Pontos |
|----------------------------------|--------|
| Placar exato correto             | 10 pts |
| Vencedor OU empate OU saldo certo| 7 pts  |
| Errou tudo                       | 0 pts  |

## Partidas
- 7 partidas fixas do Brasil na Copa 2026
- Datas geradas dinamicamente no seed (hoje + 30..60 dias) para testes
- Status: `upcoming` → `finished` após Grupo 3 registrar resultado
