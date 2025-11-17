# DevContainer Configuration Changelog

## 2025-11-17 - Added Redis CLI Tools

**Change:** Added `redis-tools` package to Dockerfile

**Rationale:**
- Enables testing Redis connection with `redis-cli -h cache ping`
- Provides Redis debugging tools (`redis-cli MONITOR`, `redis-cli INFO`, etc.)
- Closes gap identified in DevContainer validation report

**Modified Files:**
- `.devcontainer/Dockerfile` - Added `redis-tools` to apt-get install

**Testing:**
After rebuilding the container, verify redis-cli is available:
```bash
redis-cli --version
# Expected: redis-cli 7.x.x or similar

redis-cli -h cache ping
# Expected: PONG
```

**How to Apply:**
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Select "Dev Containers: Rebuild Container"
3. Wait for rebuild (~2-3 minutes)
4. Verify with commands above

---

## 2025-11-17 - Initial DevContainer Setup

**Change:** Created VSCode DevContainer with Docker Compose

**Services:**
- `api` - Node.js 20 development environment
- `db` - PostgreSQL 15-alpine database
- `cache` - Redis 7-alpine cache

**Status:** ✅ Validated - All critical tests passed (see docs/experiments/2025-11-17-devcontainer-validation.md)
