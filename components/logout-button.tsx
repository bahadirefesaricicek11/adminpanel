"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { logActivity, logSessionEnd } from "@/lib/utils/activity-logger";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Log logout activity
        await logActivity({
          action: 'logout',
          resourceType: 'auth',
          resourceName: user.email,
        });

        // Log session end
        await logSessionEnd(user.id, Date.now());
      }

      // Sign out
      await supabase.auth.signOut();
      
      // Redirect to login
      router.push("/admin/login");
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logging fails
      router.push("/admin/login");
    }
  };

  return <Button onClick={logout}>Çıkış Yap</Button>;
}
