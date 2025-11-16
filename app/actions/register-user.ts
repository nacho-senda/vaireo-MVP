'use server'

export async function registerUser(formData: {
  name: string
  company: string
  email: string
}) {
  console.log('[v0] Registering user:', formData)
  
  try {
    const webhookUrl = 'https://script.google.com/macros/s/AKfycbwId2YKy44B-GQWfuJ4GOChstvJwxJ5kXghrhkADwECN-zHXpmybGU58tRlEzXH-pM/exec'
    
    const payload = {
      nombre: formData.name,
      empresa: formData.company,
      email: formData.email
    }
    
    console.log('[v0] Sending POST to webhook:', payload)

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    })

    console.log('[v0] Response status:', response.status)

    const responseText = await response.text()
    console.log('[v0] Response body:', responseText)

    if (response.ok || response.status === 302) {
      return { success: true, message: 'Usuario registrado correctamente' }
    } else {
      throw new Error(`Error: ${response.status}`)
    }
  } catch (error) {
    console.error('[v0] Error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    }
  }
}
