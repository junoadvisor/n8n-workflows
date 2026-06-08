# 🔒 n8n Zero Credential Storage - Security Notice

**CRITICAL SECURITY PRINCIPLE**

## All n8n workflows in this repository implement ZERO CREDENTIAL STORAGE

### What This Means

✅ **n8n workflows receive credentials at runtime only** - via HTTP headers from Edge Functions  
✅ **No API keys are stored in n8n** - not in workflow JSON, not in credential manager  
✅ **No OAuth tokens are stored in n8n** - tokens exist in memory for < 5 seconds  
✅ **Tokens are immediately disposed** - after API call completes  
✅ **No credential persistence** - not in execution history, variables, or environment  

### How It Works

```
Database (Encrypted) → Edge Function → n8n (Runtime) → Backend API
                            ↓              ↓
                      Retrieves &    Receives token
                      refreshes      in header,
                      tokens         forwards to API,
                                    disposes immediately
```

### Verification

Every workflow JSON file:
- Uses `authentication: "none"` on HTTP Request nodes
- Receives credentials via `$json.headers.authorization`
- Never hardcodes API keys or tokens
- Only stores `N8N-WEBHOOK-KEY` (for webhook validation, not backend APIs)

### Documentation

See: [`docs/reference/N8N-ZERO-CREDENTIAL-STORAGE.md`](./docs/reference/N8N-ZERO-CREDENTIAL-STORAGE.md)

---

**This is a fundamental security requirement. Never commit workflows that violate this principle.**
