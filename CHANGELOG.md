# Changelog

All notable changes to the Toast n8n Workflows will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2026-06-08] - GitHub Actions CI/CD Deployment

### Added - Automated Deployment
- **`.github/workflows/deploy-n8n.yml`**: GitHub Actions workflow for automated deployment
  - Deploy all workflows with one click
  - Deploy by integration (toast, google, yelp, opentable, resy, instagram, facebook)
  - Deploy single workflow file
  - Auto-deployment on push to main branch
  - Smart update detection (creates new or updates existing workflows)
  - Comprehensive error handling and reporting
  - Deployment summary with success/failure counts
  - Support for manual trigger from GitHub Actions UI

### Added - Deployment Documentation
- **`docs/guides/GITHUB-ACTIONS-DEPLOYMENT.md`**: Complete CI/CD deployment guide
  - Prerequisites and setup instructions
  - GitHub Secrets configuration
  - Usage examples for all deployment types
  - Deployment monitoring and troubleshooting
  - Security best practices
  - Advanced usage patterns
  - API rate limits and considerations

### Updated - Documentation References
- **`README.md`**: Added CI/CD deployment section
  - Quick setup instructions
  - Feature highlights
  - Link to full deployment guide
- **`docs/README.md`**: Added GitHub Actions deployment link
  - Updated guides section
  - Updated documentation structure

### Deployment Options
1. **Deploy All** - Deploy all 16 workflows across 7 integrations
2. **Deploy by Integration** - Deploy specific provider workflows
3. **Deploy Single** - Deploy one specific workflow file
4. **Auto-deploy** - Automatic deployment on git push

### Security Features
- GitHub Secrets for API credentials
- Minimal workflow permissions
- Branch protection support
- Audit trail via GitHub Actions logs

---

## [2026-06-08] - Yelp Reply Workflow

### Added - Yelp Integration
- **`yelp/put-yelp-review-reply-workflow.json`**: Reply to Yelp business reviews
  - POST endpoint at `/yelp/reviews/reply`
  - Yelp Partner API integration (`https://partner-api.yelp.com/reviews/v1/{reviewId}`)
  - Requires Yelp Partnership contract (Partner API access)
  - Public comment responses only
  - Rate limit: 20 responses per location per day
  - UTF-8 text only (no emoji support)
  - Authentication: Bearer token (business owner OAuth)
  - Request validation: Authorization header, reviewId, response_text
  - Comprehensive error handling (401, 400, 403, 429)

### Updated - Documentation
- **`yelp/README.md`**: Complete documentation for reply workflow
  - Added "Reply to Yelp Business Review" section
  - Partner API requirements and limitations
  - Authentication details and security features
  - Setup instructions and testing examples
  - API reference and error handling
  - Troubleshooting guide for common issues
  - Updated workflow count from 1 to 2
- **`README.md`**: Updated main documentation
  - Yelp integration description to include Partner API
  - Workflow table updated with reply endpoint
  - Added reply features and rate limits
  - Updated workflow count: Yelp from 1 to 2
  - Updated total workflows: 12 → 16
  - Updated integration status to Production-Ready
  - Added Yelp Partner API reference link

### Integration Summary
- **Yelp Workflows:** 2 (Get Reviews, Reply to Review)
- **Total Workflows:** 16 across 7 integrations
- **Status:** Production-Ready (requires Partner API access)

---

## Development Standards & Testing

### [2026-06-08]

#### Added - Cursor Rules
- **`.cursor/rules/n8n-workflows.md`**: Development guidelines for first iteration
  - Early development status - no migration docs needed
  - JavaScript/Node.js for all scripts (language consistency)
  - Mock-based testing approach
  - Simple, iterate-fast philosophy
  - File organization standards
  - Code style guidelines

#### Added - Test Scripts
- **`tests/test-workflows.js`**: Comprehensive test runner in JavaScript
  - Tests all 12 workflows across 7 providers
  - Mock mode (default) and real n8n mode
  - Provider-specific test filtering
  - Configurable via environment variables
  - Detailed output with status and response
  - Per-provider test results
- **`tests/mock-server.js`**: Mock n8n server for testing
  - Simulates all workflow webhook endpoints
  - Authentication validation
  - Realistic mock responses
  - Error handling (401, 400, 404)
  - CORS support
  - Request logging
- **`tests/README.md`**: Complete testing documentation
  - Quick start guide
  - Test script usage
  - Mock server setup
  - Manual testing examples
  - CI/CD integration examples

#### Changed - Language Consistency
- **Standardized on JavaScript/Node.js** for all scripts
- Deprecated Python scripts in favor of JavaScript equivalents
- Created deprecation notice: `docs/scripts/DEPRECATION-NOTICE.md`
- Test-driven approach replaces validation scripts
- n8n workflow JSON files remain unchanged (required format)

#### Deprecated
- **`docs/scripts/update_workflows.py`** - Marked for deletion
- **`docs/scripts/verify-authentication.py`** - Marked for deletion
- **`docs/scripts/update_workflows.sh`** - Marked for deletion
- **`docs/reference/AUTHENTICATION-VERIFICATION-SUMMARY.md`** - Outdated

#### Updated
- **Main README.md**: Added automated testing section
- **Folder structure**: Added `tests/` directory
- Documentation references updated to reflect new testing approach

---

## Documentation Reorganization

### [2026-06-08]

#### Added
- **`docs/`** directory structure for organized documentation
  - **`docs/README.md`**: Complete documentation index and navigation
  - **`docs/QUICK-REFERENCE.md`**: Fast access to commands and examples
  - **`docs/guides/`**: Step-by-step guides
    - `MIGRATION-GUIDE.md` (moved)
    - `GOOGLE-TESTING-GUIDE.md` (moved from google/)
  - **`docs/reference/`**: Technical reference documentation
    - `ARCHITECTURE.md` (moved)
    - `AUTHENTICATION-GUIDE.md` (moved)
    - `AUTHENTICATION-VERIFICATION-SUMMARY.md` (moved)
    - `SUMMARY.md` (moved)
  - **`docs/scripts/`**: Automation and verification scripts
    - `verify-authentication.py` (moved)
    - `update_workflows.py` (moved)
    - `update_workflows.sh` (moved)

#### Changed
- Reorganized all documentation into logical folders
- Updated main README.md with documentation links
- Improved documentation discoverability and navigation
- Centralized scripts in one location

#### Improved
- Clear separation between guides, reference docs, and scripts
- Easy-to-navigate documentation structure
- Quick reference guide for common tasks
- Comprehensive documentation index

---

## Authentication Configuration Enhancement

### [2026-06-08]

#### Added
- **`AUTHENTICATION-GUIDE.md`**: Comprehensive authentication documentation for all providers
  - Exact authentication requirements per provider
  - Header configuration details
  - Token management and refresh procedures
  - Security best practices
  - Troubleshooting guide
- **`verify-authentication.py`**: Automated script to verify authentication configuration
  - Checks all workflows for proper auth setup
  - Validates required and recommended headers
  - Provides detailed verification reports

#### Updated
- **Resy Workflow**: Added recommended headers to prevent 302 redirects
  - `User-Agent: Mozilla/5.0...`
  - `Origin: https://resy.com`
  - `Referer: https://resy.com/`

#### Verified
All workflows now implement proper provider-specific authentication:
- ✅ Toast: Bearer token + Toast-Restaurant-External-ID header
- ✅ Google: OAuth 2.0 Bearer token
- ✅ Yelp: Bearer token (API key)
- ✅ OpenTable: OAuth 2.0 Bearer token
- ✅ Resy: Custom header format + recommended headers
- ✅ Instagram: OAuth 2.0 Bearer token (Facebook)
- ✅ Facebook: OAuth 2.0 Bearer token

---

## Google Business Profile - Reply to Reviews

### [2026-06-08]

#### Added
- **New Workflow**: `google/put-google-review-reply-workflow.json`
  - PUT endpoint: `/google/reviews/reply`
  - Create or update replies to Google Business Profile reviews
  - Validates accountId, locationId, reviewId, and comment
  - Calls Google My Business API: `PUT /v4/accounts/{accountId}/locations/{locationId}/reviews/{reviewId}/reply`
  - Maximum comment length: 4096 bytes
  - OAuth 2.0 authentication required

#### Updated
- **`google/README.md`**: Comprehensive documentation for both GET and PUT workflows
  - Setup OAuth 2.0 credentials
  - Example requests for reading and replying to reviews
  - Error handling guide
  - Use cases and best practices

---

## Architecture Migration - Direct Backend API Calls

### [2026-06-08]

#### Changed - BREAKING CHANGES
- **Complete architecture redesign**: All workflows now call backend APIs directly instead of Supabase Edge Functions
- **Old**: API Client → n8n → Supabase → Backend API
- **New**: API Client → n8n → Backend API
- Updated all 11 workflows across 7 integrations to call backend APIs directly
- All HTTP Request nodes renamed from "Forward to Backend" to "Forward to [Service] API"

#### Added
- `ARCHITECTURE.md` - Comprehensive documentation of new architecture and API endpoints
- `MIGRATION-GUIDE.md` - Step-by-step guide for migrating to direct backend API calls
- `update_workflows.py` - Python script to update workflow URLs programmatically
- Environment variable support for dynamic API hostnames (`TOAST_API_HOSTNAME`, `GOOGLE_MY_BUSINESS_API_URL`)

#### Updated Workflows
All workflows now call backend APIs directly:
1. **Toast POS** (3 workflows): Now call Toast API at `{{ $env.TOAST_API_HOSTNAME }}/orders/v2/...` and `.../menus/v2/...`
2. **Google Business Profile** (1 workflow): Now call Google My Business API at `{{ $env.GOOGLE_MY_BUSINESS_API_URL }}/v4/accounts/.../reviews`
3. **Yelp Fusion** (1 workflow): Now call Yelp API at `https://api.yelp.com/v3/businesses/.../reviews`
4. **OpenTable** (1 workflow): Now call OpenTable Platform API at `https://platform.opentable.com/inhouse/v1/...`
5. **Resy** (1 workflow): Now call Resy API at `https://api.resy.com/3/user/reservations`
6. **Instagram** (2 workflows): Now call Facebook Graph API at `https://graph.facebook.com/v22.0/...`
7. **Facebook** (2 workflows): Now call Facebook Graph API at `https://graph.facebook.com/v22.0/...`

#### Removed
- All Supabase Edge Function URLs from workflows
- Dependency on Supabase as intermediary

---

## Repository Cleanup

### [2026-06-08]

#### Removed
- Removed duplicate workflow files from root directory (moved to integration folders)
  - `get-toast-menu-workflow.json` (now in `toast/`)
  - `get-toast-order-workflow.json` (now in `toast/`)
  - `post-toast-order-workflow.json` (now in `toast/`)
- Removed duplicate documentation files from root directory
  - `GET-ORDER-README.md` (now in `toast/`)
  - `GET-MENU-README.md` (now in `toast/`)
  - `WORKFLOW-COMPARISON.md` (now in `toast/`)
  - `DEPLOYMENT-GUIDE.md` (now in `toast/`)
  - `INTEGRATION-SUMMARY.md` (content consolidated into root `README.md`)

#### Changed
- Improved folder organization with all integration files contained in their respective folders
- Root directory now only contains main documentation (`README.md`, `CHANGELOG.md`) and integration folders

---

## Get Toast Menu Workflow

### [1.0.0] - 2026-06-08

#### Added
- Initial "Get Toast Menu Workflow" creation
- GET webhook trigger on `/toast/menus` endpoint
- Header validation IF node with TRUE/FALSE branches
- Validation for `Authorization` header (mandatory)
- Validation for `Toast-Restaurant-External-ID` header (mandatory)
- Error response node for missing required headers (returns 400)
- Request logging with timestamp, headers, query params, and webhook URL
- HTTP GET request to forward to Supabase backend
- Query parameter support for pagination (pageSize, page)
- Query parameter support for filtering (lastModified)
- Response webhook node to return menu data
- Three-layer security architecture (Header Auth + 2 required headers)
- Case-insensitive header validation
- Comprehensive documentation in GET-MENU-README.md
- Test scenarios for valid and invalid GET requests
- Troubleshooting section
- Configurable backend URL in Forward to Backend node

#### Features
- GET endpoint for retrieving Toast menu items
- Forward requests to Supabase: `https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/menus`
- Pass-through headers: Authorization, Toast-Restaurant-External-ID
- Optional query parameters for pagination and filtering
- Return menu data including items, groups, modifiers, and pricing
- Support for menu synchronization workflows

#### Security
- Implemented Header Auth credential requirement (SUPABASE-EDGE-API-KEY)
- Added validation for Authorization header presence
- Added validation for Toast-Restaurant-External-ID header presence
- Returns 400 Bad Request for missing required headers
- Returns 401 Unauthorized for invalid credentials
- Audit trail via request logging

#### Technical Details
- Node count: 7
- Workflow file: `get-toast-menu-workflow.json`
- Webhook path: `toast/menus`
- HTTP method: GET
- Response mode: `responseNode`
- Backend URL: Configurable in "Forward to Backend" node
- Reference: [Toast Menus API Documentation](https://doc.toasttab.com/openapi/menus/)

---

## Get Toast Order Workflow

### [1.0.0] - 2026-06-08

#### Added
- Initial "Get Toast Order Workflow" creation
- GET webhook trigger on `/toast/orders/:orderGuid` endpoint
- Path parameter support for order GUID
- Header validation IF node with TRUE/FALSE branches
- Validation for `orderGuid` path parameter
- Validation for `Authorization` header (mandatory)
- Validation for `Toast-Restaurant-External-ID` header (mandatory)
- Error response node for missing required headers/parameters (returns 400)
- Request logging with timestamp, headers, params, and webhook URL
- HTTP GET request to forward to Supabase backend with order GUID
- Response webhook node to return order details
- Three-layer security architecture (Header Auth + 2 required headers)
- Case-insensitive header validation
- Comprehensive documentation in GET-ORDER-README.md
- Test scenarios for valid and invalid GET requests
- Troubleshooting section
- Configurable backend URL in Forward to Backend node

#### Features
- GET endpoint for retrieving Toast order details by GUID
- Forward requests to Supabase: `https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/orders/{orderGuid}`
- Pass-through headers: Authorization, Toast-Restaurant-External-ID
- Dynamic URL construction with order GUID from path parameter
- Return order details from backend to caller
- Full order object response with customer, payment, and delivery info

#### Security
- Implemented Header Auth credential requirement (SUPABASE-EDGE-API-KEY)
- Added validation for Authorization header presence
- Added validation for Toast-Restaurant-External-ID header presence
- Added validation for orderGuid parameter presence
- Returns 400 Bad Request for missing required headers or parameters
- Returns 401 Unauthorized for invalid credentials
- Audit trail via request logging

#### Technical Details
- Node count: 7
- Workflow file: `get-toast-order-workflow.json`
- Webhook path: `toast/orders/:orderGuid`
- HTTP method: GET
- Response mode: `responseNode`
- Backend URL: Configurable in "Forward to Backend" node
- Reference: [Toast Orders API Documentation](https://doc.toasttab.com/doc/devguide/apiOrdersGetDetailedInfoAboutOneOrder.html)

---

## Post Toast Order Workflow

### [2.1.1] - 2026-06-05

### Changed
- Disabled SSL certificate configuration (paused for development)
- Removed `provideSslCertificates` parameter from Forward to Backend node
- Removed SSL certificate credential reference

### Notes
- SSL support paused for now, will be re-enabled when needed
- Standard HTTPS connections still work with system default certificates

---

## [2.1.0] - 2026-06-05

### Changed
- Renamed workflow JSON file from `toast-order-workflow-secured.json` to `post-toast-order-workflow.json`
- Workflow name in JSON updated to "Post Toast Order Workflow" (matching n8n workflow name)

### Added
- ~~SSL certificate support for HTTPS connections to Supabase backend~~ (Paused in v2.1.1)

### Removed
- **BREAKING:** Deleted unsecured TypeScript source file `toast-order-workflow.ts`
- Deleted old JSON exports: `toast-order-workflow.json` and `toast-order-workflow-secured.json`

### Files
- Current workflow file: `post-toast-order-workflow.json`
- All old workflow files removed for clarity

---

## [2.0.0] - 2026-06-05

### Changed
- **BREAKING:** Renamed workflow from "Toast Order Workflow" to "Post Toast Order Workflow"
- **BREAKING:** Added mandatory Header Authentication (credential: SUPABASE-EDGE-API-KEY)
- **BREAKING:** Added mandatory `Authorization` header validation
- **BREAKING:** Added mandatory `Toast-Restaurant-External-ID` header validation

### Added
- Header validation IF node with TRUE/FALSE branches
- Error response node for missing required headers (returns 400)
- Error webhook response node for validation failures
- Request logging with timestamp, headers, body, and webhook URL
- Three-layer security architecture (Header Auth + 2 required headers)
- Case-insensitive header validation
- Comprehensive error messages for debugging
- Development environment rules in `.cursor/rules/n8n-workflows.md`
- Consolidated documentation in README.md with detailed setup instructions
- Test scenarios for valid and invalid requests
- Troubleshooting section in documentation

### Security
- Implemented Header Auth credential requirement
- Added validation for Authorization header presence
- Added validation for Toast-Restaurant-External-ID header presence
- Returns 400 Bad Request for missing required headers
- Returns 401 Unauthorized for invalid credentials

### Fixed
- Improved error handling with detailed error responses
- Better request validation before processing

### Documentation
- Consolidated all documentation into single README.md
- Created CHANGELOG.md for version tracking
- Added comprehensive testing section with curl examples
- Added troubleshooting guide
- Added API reference documentation
- Removed duplicate documentation files

### Technical Details
- Increased node count from 4 to 7 nodes
- New workflow ID: nUpgw1CBXeIASLlT
- Workflow positions optimized for readability
- Added conditional branching for validation
- Preserved pass-through architecture for headers and body

---

## [1.0.0] - 2026-06-05

### Added
- Initial "Toast Order Workflow" creation
- Webhook trigger on `/toast/orders` endpoint
- Request logging node
- HTTP request node to forward to Supabase backend
- Response webhook node to return backend response
- Basic workflow structure with 4 nodes

### Features
- POST endpoint for Toast orders
- Forward requests to Supabase: `https://nxhigljstzuqfcdmgsxp.supabase.co/functions/v1/orders`
- Pass-through headers: Authorization, Toast-Restaurant-External-ID
- Pass-through request body unchanged
- Return backend response to caller

### Security
- No authentication (public endpoint)
- No header validation
- Anyone with URL could call the webhook

### Known Issues
- No authentication mechanism
- No validation of required headers
- Security vulnerability: publicly accessible

### Technical Details
- Workflow ID: GC9JvOa4sP8Jg6nQ
- Node count: 4
- Webhook path: `toast/orders`
- Response mode: `responseNode`

---

## Version Comparison

| Feature | v1.0.0 | v2.0.0 |
|---------|--------|--------|
| Workflow Name | Toast Order Workflow | Post Toast Order Workflow |
| Authentication | None ❌ | Header Auth ✅ |
| Authorization Header | Optional | **Mandatory** ✅ |
| Restaurant ID Header | Optional | **Mandatory** ✅ |
| Error Handling | Basic | Detailed 400/401 ✅ |
| Security Level | Public | Production-ready ✅ |
| Node Count | 4 | 7 |
| Validation | None | IF node with branches ✅ |
| Error Responses | Generic | Structured with messages ✅ |
| Documentation | Multiple files | Single README ✅ |
| Environment | Development | Development |

---

## Upgrade Guide: v1.0.0 → v2.0.0

### Breaking Changes

1. **Header Authentication Required**
   - Create `SUPABASE-EDGE-API-KEY` credential in n8n
   - Configure header name and secret value
   - All requests must include this header

2. **Authorization Header Mandatory**
   - All requests must include `Authorization: Bearer <token>`
   - Missing header returns 400 Bad Request

3. **Toast-Restaurant-External-ID Header Mandatory**
   - All requests must include `Toast-Restaurant-External-ID: <restaurant-id>`
   - Missing header returns 400 Bad Request

### Migration Steps

1. **Create New Credential**
   ```
   Type: Header Auth
   Name: SUPABASE-EDGE-API-KEY
   Header Name: X-N8N-API-Key (or your choice)
   Value: <generate-strong-random-key>
   ```

2. **Update Calling Systems**
   - Add header auth header to all requests
   - Verify `Authorization` header is present
   - Verify `Toast-Restaurant-External-ID` header is present

3. **Test New Workflow**
   - Test with all required headers (should succeed)
   - Test without Authorization (should fail with 400)
   - Test without Restaurant ID (should fail with 400)
   - Test with wrong credential (should fail with 401)

4. **Deploy**
   - Deactivate old workflow (v1.0.0)
   - Activate new workflow (v2.0.0)
   - Monitor logs for any issues

### Rollback Plan

If issues occur:
1. Deactivate v2.0.0 workflow
2. Reactivate v1.0.0 workflow (GC9JvOa4sP8Jg6nQ)
3. Investigate and fix issues
4. Retry upgrade

---

## Future Roadmap

### Planned for v2.1.0
- [ ] Add signature verification for Toast webhooks
- [ ] Implement rate limiting
- [ ] Add request size validation
- [ ] Add IP whitelisting support

### Planned for v2.2.0
- [ ] Add webhook retry logic
- [ ] Implement circuit breaker pattern
- [ ] Add metrics and monitoring
- [ ] Add request/response caching

### Planned for v3.0.0
- [ ] Support multiple restaurant configurations
- [ ] Add multi-tenant routing
- [ ] Implement async processing
- [ ] Add dead letter queue for failed requests

---

**Last Updated:** 2026-06-08  
**Current Version:** 2.0.0  
**Status:** Early Development - First Iteration
