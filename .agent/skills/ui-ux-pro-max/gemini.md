# Encoding Rules

## ⚠️ Siempre usar `py -3.14` en Windows

En este sistema `python3` resuelve al MinGW Python que **no tiene el módulo `encodings`** y falla con:

```
Fatal Python error: Failed to import encodings module
ModuleNotFoundError: No module named 'encodings'
```

**Mal (se rompe):**
```bash
python3 search.py "query" --design-system
```

**Bien (funciona):**
```bash
py -3.14 search.py "query" --design-system
```

El Python que funciona está en:
```
C:\Users\franc\AppData\Local\Python\pythoncore-3.14-64\python.exe
```

## Reglas de Encoding

1. **Siempre** pasar `-3.14` al ejecutar con `py` → `py -3.14 search.py ...`
2. **Nunca** ejecutar scripts directamente con `python3`, `python`, ni `./search.py`
3. **Siempre** usar `encoding='utf-8'` en cualquier `open()` (los scripts ya lo tienen)
4. Si se corre desde otro script/proceso, usar `sys.executable` del Pythoncore 3.14, no el `python3` del PATH

## Para Skills/Agents

Si un skill invoca estos scripts, debe hacerlo con `py -3.14` explícito, no con `python3`:

```bash
cmd /c "py -3.14 skills/ui-ux-pro-max/scripts/search.py \"query\" --design-system"
```
