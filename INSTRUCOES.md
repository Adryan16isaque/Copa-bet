# 📂 Guia de Branches por Grupo

Cada grupo deve acessar e trabalhar **exclusivamente na sua branch**. Não faça commits na `main` diretamente.

---

## 🔀 Como trocar de branch

```bash
# Clone o repositório (apenas na primeira vez)
git clone <URL_DO_REPOSITÓRIO>
cd <nome-da-pasta>

# Troque para a branch do seu grupo
git checkout <nome-da-branch>

# Confirme em qual branch você está
git branch
```

---

## 👥 Grupos e suas Branches

### Grupo 1 — `cadastro-usuarios`
**Integrantes:** Guilherme, André, Lucas Palhano

```bash
git checkout cadastro-usuarios
```

---

### Grupo 2— `sistema-de-apostas``
**Integrantes:** Lorran, Ádryan, Vitor

```bash
git checkout sistema-de-apostas
```

---

### Grupo 3 — `pontuacao`
**Integrantes:** Tati, Bruna

```bash
git checkout pontuacao
```

---

### Grupo 4 — `rankings`
**Integrantes:** Adiel, Eduardo, Joel

```bash
git checkout rankings
```

---

### Grupo 5 — `dashboard-interface`
**Integrantes:** Lucas, Daniel, Ygor

```bash
git checkout dashboard-interface
```


---

## ✅ Boas práticas

- Sempre faça `git pull origin <sua-branch>` antes de começar a trabalhar para sincronizar mudanças do time.
- Faça commits com mensagens descritivas:
  ```bash
  git add .
  git commit -m "feat: descrição do que foi feito"
  git push origin <sua-branch>
  ```
- **Não altere** arquivos de outras branches.
- Em caso de dúvidas, consulte o professor ou o responsável pelo repositório.

---

> 💡 **Dica:** Se você clonou o repositório pela primeira vez, as branches remotas podem não aparecer com `git branch`. Use `git branch -a` para ver todas, incluindo as remotas.
