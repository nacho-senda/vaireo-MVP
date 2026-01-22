export interface HubSpotContact {
  properties: {
    firstname: string
    lastname: string
    company: string
    website?: string
    lifecyclestage: string
  }
}

export async function syncStartupToHubSpot(startup: {
  nombre: string
  descripcion: string
  website?: string
  region: string
  vertical: string
}) {
  const apiKey = process.env.HUBSPOT_API_KEY
  if (!apiKey) {
    console.warn("[v0] HubSpot API key not configured")
    return null
  }

  try {
    const [firstName, ...lastNameParts] = startup.nombre.split(" ")
    const lastName = lastNameParts.join(" ") || "Startup"

    const contact: HubSpotContact = {
      properties: {
        firstname: firstName || "Startup",
        lastname: lastName,
        company: startup.nombre,
        website: startup.website,
        lifecyclestage: "subscriber",
      },
    }

    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(contact),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] HubSpot sync error:", error)
      return null
    }

    return await response.json()
  } catch (error) {
    console.error("[v0] Error syncing to HubSpot:", error)
    return null
  }
}

export async function createDealInHubSpot(startup: {
  nombre: string
  vertical: string
  region: string
}) {
  const apiKey = process.env.HUBSPOT_API_KEY
  if (!apiKey) return null

  try {
    const deal = {
      properties: {
        dealname: `Startup: ${startup.nombre}`,
        dealstage: "negotiation",
        pipeline: "default",
        description: `${startup.vertical} - ${startup.region}`,
      },
    }

    const response = await fetch("https://api.hubapi.com/crm/v3/objects/deals", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deal),
    })

    return response.ok ? await response.json() : null
  } catch (error) {
    console.error("[v0] Error creating HubSpot deal:", error)
    return null
  }
}
