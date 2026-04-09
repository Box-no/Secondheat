import { Message } from '@/lib/types'
import { mockMessages } from '@/lib/mock/messages'

let supabase: any = null

try {
  const client = require('@/lib/supabase/client')
  supabase = client.supabase
} catch (error) {
  console.log('Supabase client not available, using mock data')
}

export async function getMessageThread(orderId: string): Promise<Message[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Supabase error:', error)
      return mockMessages[orderId] || []
    }
  }
  return mockMessages[orderId] || []
}

export async function sendMessage(
  orderId: string,
  senderId: string,
  senderName: string,
  content: string
): Promise<Message> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{ order_id: orderId, sender_id: senderId, content }])
        .select()
        .single()

      if (error) throw error
      return {
        id: data.id,
        orderId: data.order_id,
        senderId: data.sender_id,
        senderName,
        content: data.content,
        createdAt: new Date(data.created_at),
      }
    } catch (error) {
      console.error('Supabase error:', error)
    }
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    orderId,
    senderId,
    senderName,
    content,
    createdAt: new Date(),
  }

  if (!mockMessages[orderId]) {
    mockMessages[orderId] = []
  }
  mockMessages[orderId].push(newMessage)
  return newMessage
}
