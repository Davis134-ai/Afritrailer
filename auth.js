import { supabase } from './supabase.js'

// Register with phone + password
export async function register(phone, password, referralCode = null) {
  // Create email from phone
  const email = phone.replace(/[^0-9]/g, '') + '@gmail.com'
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (authError) throw authError;

  const user = authData.user;
  if (!user) throw new Error('Registration failed')

  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      phone,
      referral_code: 'AFRITRAILER-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      tier: 'free',
      daily_limit: 0,
      balance: 0,
    })
  if (profileError) throw profileError

  // Handle referral if provided
  if (referralCode) {
    const { data: referrer } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', referralCode)
      .single()
    if (referrer) {
      await supabase
        .from('profiles')
        .update({ referred_by: referrer.id })
        .eq('id', user.id)
    }
  }

  return user
}

// Login with phone + password
export async function login(phone, password) {
  const email = phone.replace(/[^0-9]/g, '') + '@gmail.com'
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data.user
}

// Logout
export function logout() {
  return supabase.auth.signOut()
}

// Get current user
export function getCurrentUser() {
  return supabase.auth.getUser()
}