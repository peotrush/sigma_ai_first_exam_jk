# Architecture Decision Record: Why Not GitHub Pages?

**Date:** 2025-11-17
**Status:** ❌ **Rejected**
**Decision:** Use AWS for production deployment, not GitHub Pages
**Context:** Evaluation of GitHub Pages as cost-saving alternative to AWS

---

## Decision

**GitHub Pages is NOT viable** for Kash Budget deployment.

**Rationale:** GitHub Pages is a **static website hosting service** designed for simple HTML/CSS/JS sites. Kash Budget is a **full-stack mobile application** requiring backend APIs, databases, and server-side processing—none of which GitHub Pages supports.

---

## Context

During architecture planning, the team considered whether GitHub Pages could serve as a cost-effective alternative to AWS infrastructure ($0/month vs $50-70/month). This evaluation assessed GitHub Pages' capabilities against Kash Budget's technical requirements.

---

## Platform Capabilities Comparison

| Requirement | Kash Budget Needs | GitHub Pages | AWS | Compatible? |
|-------------|------------------|--------------|-----|-------------|
| **Mobile App Distribution** | iOS App Store + Google Play Store binaries | ❌ No mobile support | ✅ CI/CD + S3 artifacts | ❌ No |
| **Backend API** | NestJS REST API (40+ endpoints) | ❌ No server-side code | ✅ ECS/App Runner + Docker | ❌ No |
| **Database** | PostgreSQL 14+ with ACID compliance | ❌ No database | ✅ RDS PostgreSQL | ❌ No |
| **Caching Layer** | Redis for sessions & credit balances | ❌ No caching | ✅ ElastiCache Redis | ❌ No |
| **File Storage** | Receipt images (S3) | ❌ No blob storage | ✅ S3 with encryption | ❌ No |
| **Server-Side Logic** | QR parsing, ML training, push notifications | ❌ Static files only | ✅ Full compute | ❌ No |
| **Background Jobs** | Credit expiration, notification scheduling | ❌ No background processing | ✅ EventBridge + Lambda | ❌ No |
| **Authentication** | JWT tokens, OAuth 2.0, session management | ❌ No auth backend | ✅ Full control | ❌ No |

**Verdict:** **0 out of 8 critical requirements met by GitHub Pages.**

---

## What GitHub Pages Actually Supports

GitHub Pages is designed for:
- **Static documentation sites** (like project README pages)
- **Marketing landing pages** (HTML/CSS/JS)
- **Portfolio websites** (static content)
- **Client-side only apps** (e.g., pure frontend React apps calling external APIs)

**Technical Limitations:**
- No server-side execution (Node.js, Python, etc.)
- No database connectivity
- No environment variables for secrets
- No server-side routing (only client-side routing)
- No file uploads or blob storage
- No WebSocket support for real-time features

---

## Alternative Platforms Considered

If AWS cost/complexity is a concern, these alternatives support full-stack applications:

| Platform | Monthly Cost (MVP) | Complexity | Kash Budget Compatible? |
|----------|-------------------|------------|------------------------|
| **Railway** | $15 | Low | ✅ Yes (Docker support) |
| **Render** | $14 | Low | ✅ Yes (native Docker) |
| **DigitalOcean App Platform** | $27 | Low | ✅ Yes (full control) |
| **Fly.io** | ~$20 | Low | ✅ Yes (Docker-native) |
| **AWS (Current Plan)** | $50-70 | Moderate | ✅ Yes (maximum flexibility) |

---

## Decision Outcome

**Selected:** **AWS** for production infrastructure

**Reasoning:**
1. Comprehensive service ecosystem (RDS, ElastiCache, S3, CloudFront)
2. ACID-compliant PostgreSQL with automated backups (critical for financial data)
3. Proven scalability for mobile applications
4. Strong security and compliance features
5. Team familiarity with AWS services

**Cost Mitigation:**
- Start with smallest instance types (t3.micro/small)
- Implement auto-scaling to avoid over-provisioning
- Use Reserved Instances for predictable workloads (40% savings)
- Monitor with CloudWatch cost alerts

---

## Alternative Use Case for GitHub Pages

**What GitHub Pages CAN be used for in Kash Budget ecosystem:**

Create a **marketing/landing page** at `kash-budget.github.io`:
- Product overview and screenshots
- Download links to App Store and Google Play
- Privacy policy and terms of service
- Contact form (via Formspree or Netlify Forms)
- Blog/changelog for product updates

**This would be COMPLEMENTARY to the main application infrastructure, not a replacement.**

---

## Consequences

### Positive
- ✅ Full control over backend infrastructure
- ✅ ACID-compliant database for financial data
- ✅ Proven scalability path
- ✅ Complete security and compliance capabilities
- ✅ Rich ecosystem of managed services

### Negative
- ⚠️ Higher monthly costs ($50-70 vs $0)
- ⚠️ Infrastructure management complexity
- ⚠️ Steeper learning curve for team
- ⚠️ Requires DevOps knowledge

### Migration Options
If cost becomes prohibitive, migration paths exist:
- **Railway/Render:** Docker images can be deployed with minimal changes
- **Database Export:** PostgreSQL dump/restore is standard
- **Environment Variables:** Portable across platforms

---

## Architecture Comparison

**Current AWS Architecture:**
```
Mobile App (React Native)
    ↓
API Gateway / Load Balancer
    ↓
Backend API (NestJS on ECS/App Runner)
    ↓
PostgreSQL (RDS) + Redis (ElastiCache)
    ↓
S3 (Receipt Images) + CloudFront (CDN)
```

**What GitHub Pages Supports:**
```
Static HTML/CSS/JS Files
    ↓
GitHub CDN
    ↓
Browser
```

**Incompatibility:** The entire backend stack (API, database, cache, storage) is missing from GitHub Pages.

---

## References

- [Kash Budget Architecture Document](../architecture.md)
- [AWS Pricing Calculator Estimate](https://calculator.aws/)
- [GitHub Pages Documentation](https://pages.github.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Render Documentation](https://render.com/docs)

---

**ADR Status:** ✅ Decided - AWS selected
**Next Review:** After MVP launch (assess actual costs vs alternatives)
**Document Author:** Winston (System Architect)
