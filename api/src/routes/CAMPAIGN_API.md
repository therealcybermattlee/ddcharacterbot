# Campaign API Documentation

Complete campaign management system with membership, character association, and role-based access control.

## Table of Contents

- [Overview](#overview)
- [Campaign CRUD](#campaign-crud)
- [Membership Management](#membership-management)
- [Character Association](#character-association)
- [Authorization](#authorization)

---

## Overview

**Base URL:** `/api/campaigns`

**Authentication:** All endpoints require JWT Bearer token

**Roles:**
- **DM**: Can create/modify campaigns, manage members
- **Player**: Can view campaigns, add own characters
- **Observer**: Read-only access to public campaigns

---

## Campaign CRUD

### Get All Campaigns

`GET /api/campaigns`

Returns campaigns where user is DM or member.

**Response:**
```json
{
  "success": true,
  "data": {
    "campaigns": [
      {
        "id": "uuid",
        "name": "Lost Mine of Phandelver",
        "description": "A classic starter adventure",
        "dmUserId": "uuid",
        "isPublic": false,
        "settings": {},
        "userRole": "dm",
        "createdAt": "2025-10-26T12:00:00.000Z",
        "updatedAt": "2025-10-26T12:00:00.000Z"
      }
    ]
  }
}
```

### Get Public Campaigns

`GET /api/campaigns/public`

Discover public campaigns (limit 50).

### Get Campaign by ID

`GET /api/campaigns/:id`

Access control: DM, members, or public campaigns.

### Create Campaign

`POST /api/campaigns`

**DM only**. Creates new campaign.

**Request:**
```json
{
  "name": "Curse of Strahd",
  "description": "Gothic horror adventure",
  "isPublic": false,
  "settings": {
    "level": { "min": 1, "max": 10 },
    "houseRules": { "criticalHits": "max_damage_plus_roll" }
  }
}
```

**Validation:**
- `name`: 1-100 chars, required
- `description`: ≤2000 chars, optional
- `isPublic`: boolean, default false
- `settings`: JSON object, optional

### Update Campaign

`PUT /api/campaigns/:id`

**DM only**. Updates campaign details.

### Delete Campaign

`DELETE /api/campaigns/:id`

**DM only**. Deletes campaign and all memberships.

---

## Membership Management

### Get Members

`GET /api/campaigns/:id/members`

Returns DM and all campaign members.

**Response:**
```json
{
  "dm": {
    "userId": "uuid",
    "username": "DMName",
    "email": "dm@example.com",
    "role": "dm"
  },
  "members": [
    {
      "userId": "uuid",
      "username": "PlayerName",
      "email": "player@example.com",
      "role": "player",
      "joinedAt": "2025-10-26T12:00:00.000Z"
    }
  ]
}
```

### Add Member

`POST /api/campaigns/:id/members`

**DM only**. Adds user to campaign.

**Request:**
```json
{
  "userId": "uuid",
  "role": "player"
}
```

**Roles:** `player` or `observer`

### Update Member Role

`PUT /api/campaigns/:id/members/:userId`

**DM only**. Changes member role.

**Request:**
```json
{
  "role": "observer"
}
```

### Remove Member

`DELETE /api/campaigns/:id/members/:userId`

**DM or self**. Removes member from campaign.

Auto-removes member's characters from campaign.

---

## Character Association

### Get Campaign Characters

`GET /api/campaigns/:id/characters`

Returns all characters in campaign.

**Response:**
```json
{
  "characters": [
    {
      "id": "uuid",
      "name": "Thorin Ironforge",
      "race": "Dwarf",
      "characterClass": "Fighter",
      "level": 5,
      "userId": "uuid",
      "playerName": "PlayerName"
    }
  ]
}
```

### Add Character to Campaign

`POST /api/campaigns/:id/characters`

Adds user's character to campaign. User must be campaign member.

**Request:**
```json
{
  "characterId": "uuid"
}
```

**Validation:**
- Must own character
- Must be campaign member
- Character cannot be in another campaign

### Remove Character from Campaign

`DELETE /api/campaigns/:id/characters/:characterId`

**Character owner or DM**. Removes character from campaign.

---

## Authorization

### Access Control Matrix

| Action | DM | Player | Observer | Public |
|--------|----|----|----|----|
| View campaign | ✅ | ✅ Member | ✅ Member | ✅ If public |
| Create campaign | ✅ | ❌ | ❌ | ❌ |
| Update campaign | ✅ Own | ❌ | ❌ | ❌ |
| Delete campaign | ✅ Own | ❌ | ❌ | ❌ |
| Add member | ✅ Own | ❌ | ❌ | ❌ |
| Update member | ✅ Own | ❌ | ❌ | ❌ |
| Remove member | ✅ Own | ✅ Self | ✅ Self | ❌ |
| Add character | ✅ Own char | ✅ Own char | ❌ | ❌ |
| Remove character | ✅ | ✅ Own | ❌ | ❌ |

### Error Responses

**403 Forbidden:**
```json
{
  "success": false,
  "error": {
    "code": "CAMPAIGN_ACCESS_DENIED",
    "message": "Only the campaign DM can add members"
  }
}
```

**400 Bad Request:**
```json
{
  "success": false,
  "error": {
    "code": "CHARACTER_IN_CAMPAIGN",
    "message": "Character is already in another campaign"
  }
}
```

---

## Example Workflows

### Create Campaign and Add Members

```javascript
// 1. Create campaign (DM only)
const campaign = await fetch('/api/campaigns', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Waterdeep Dragon Heist',
    description: 'Urban adventure in the City of Splendors',
    isPublic: true
  })
});

const { data: { campaign: newCampaign } } = await campaign.json();

// 2. Add players
await fetch(`/api/campaigns/${newCampaign.id}/members`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    userId: 'player-1-uuid',
    role: 'player'
  })
});

// 3. Player adds their character
await fetch(`/api/campaigns/${newCampaign.id}/characters`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${playerToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    characterId: 'character-uuid'
  })
});
```

### Leave Campaign

```javascript
// Player leaves campaign
await fetch(`/api/campaigns/${campaignId}/members/${userId}`, {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
// Automatically removes player's characters from campaign
```

---

## Business Rules

1. **Campaign Ownership**: Only DMs can create campaigns
2. **One Campaign Per Character**: Characters can only be in one campaign at a time
3. **Membership Required**: Users must be members to add characters
4. **Self-Service**: Members can leave campaigns (removes their characters)
5. **Public Discovery**: Public campaigns visible to all users
6. **Cascade Deletion**: Deleting campaign removes all memberships and character associations

---

## Performance

- Campaign list query: ~15-25ms
- Single campaign fetch: ~10-15ms
- Add/remove member: ~20-30ms
- Character association: ~15-25ms

---

## Security

- XSS prevention via text sanitization
- UUID validation on all IDs
- Role-based authorization on all operations
- Ownership validation for modifications
- Field whitelisting for updates
