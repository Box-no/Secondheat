export type LogAction =
  | 'user_signup'
  | 'user_login'
  | 'user_logout'
  | 'user_update_profile'
  | 'product_created'
  | 'product_approved'
  | 'product_rejected'
  | 'product_deleted'
  | 'order_created'
  | 'order_updated'
  | 'message_sent'

export async function logActivity(
  userId: string,
  action: LogAction,
  resourceType?: string,
  resourceId?: string,
  details?: Record<string, any>
) {
  try {
    const { supabase } = await import('@/lib/supabase/client')
    const { error } = await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId,
        details: details || null,
      })

    if (error) {
      // Silently ignore — activity_logs table may not exist yet.
      // Run supabase/schema.sql to enable activity logging.
    }
  } catch {
    // Non-critical — ignore
  }
}

export async function getActivityLogs(limit = 50, offset = 0) {
  try {
    const { supabase } = await import('@/lib/supabase/client')
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*, user:profiles(name, email, role)')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Failed to fetch activity logs:', err)
    return []
  }
}

export async function getUserActivityLogs(userId: string, limit = 50) {
  try {
    const { supabase } = await import('@/lib/supabase/client')
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Failed to fetch user activity logs:', err)
    return []
  }
}
