import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export interface Certification {
  id: string;
  user_id: string;
  certification_type: string;
  badge_title: string;
  badge_description: string;
  badge_image_url?: string;
  verification_hash: string;
  notified_at?: Date;
  issued_at: Date;
  badge_data: {
    modules_completed: number;
    total_modules: number;
    completion_date: Date;
    verification_hash: string;
  };
}

export interface BadgeAuditEntry {
  id: string;
  certification_id: string;
  user_id: string;
  trigger_source: string;
  modules_completed: number;
  total_modules: number;
  all_quizzes_passed: boolean;
  verification_data: Record<string, unknown>;
  awarded_at: Date;
}

export interface CertificationStatus {
  is_certified: boolean;
  modules_completed: number;
  total_modules: number;
  completion_percentage: number;
  certification?: Certification;
}

export const badgeService = {
  async getUserCertification(userId: string): Promise<Certification | null> {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('user_id', userId)
      .eq('certification_type', 'coach')
      .maybeSingle();

    if (error) {
      console.error('Error fetching certification:', error);
      return null;
    }

    return data;
  },

  async getCertificationStatus(userId: string): Promise<CertificationStatus | null> {
    const { data, error } = await supabase
      .rpc('get_user_certification_status', { p_user_id: userId });

    if (error) {
      console.error('Error fetching certification status:', error);
      return null;
    }

    return data;
  },

  async getBadgeAuditTrail(userId: string): Promise<BadgeAuditEntry[]> {
    const { data, error } = await supabase
      .from('badge_award_audit')
      .select('*')
      .eq('user_id', userId)
      .order('awarded_at', { ascending: false });

    if (error) {
      console.error('Error fetching audit trail:', error);
      return [];
    }

    return data || [];
  },

  async verifyBadge(verificationHash: string): Promise<{
    valid: boolean;
    certification?: Certification;
  }> {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .eq('verification_hash', verificationHash)
      .maybeSingle();

    if (error) {
      console.error('Error verifying badge:', error);
      return { valid: false };
    }

    return {
      valid: !!data,
      certification: data || undefined
    };
  },

  async markNotificationSent(certificationId: string): Promise<boolean> {
    const { error } = await supabase
      .from('certifications')
      .update({ notified_at: new Date().toISOString() })
      .eq('id', certificationId);

    if (error) {
      console.error('Error marking notification sent:', error);
      return false;
    }

    return true;
  },

  subscribeToNewBadges(
    userId: string,
    callback: (certification: Certification) => void
  ) {
    const subscription = supabase
      .channel('badge_awards')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'certifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Certification);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  async checkEligibilityForBadge(userId: string): Promise<{
    eligible: boolean;
    reason?: string;
    modulesCompleted: number;
    totalModules: number;
  }> {
    const { data: modules } = await supabase
      .from('training_modules')
      .select('id');

    const totalModules = modules?.length || 0;

    const { data: progress } = await supabase
      .from('user_module_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .eq('quiz_completed', true);

    const modulesCompleted = progress?.length || 0;

    if (modulesCompleted < totalModules) {
      return {
        eligible: false,
        reason: `Complete ${totalModules - modulesCompleted} more module(s)`,
        modulesCompleted,
        totalModules
      };
    }

    const { data: perfectScores } = await supabase
      .from('quiz_attempts')
      .select('module_id')
      .eq('user_id', userId)
      .eq('is_passed', true);

    const perfectScoreCount = new Set(perfectScores?.map((a) => a.module_id)).size;

    if (perfectScoreCount < totalModules) {
      return {
        eligible: false,
        reason: 'Not all quizzes passed with perfect score',
        modulesCompleted,
        totalModules
      };
    }

    const existingCert = await this.getUserCertification(userId);
    if (existingCert) {
      return {
        eligible: false,
        reason: 'Badge already awarded',
        modulesCompleted,
        totalModules
      };
    }

    return {
      eligible: true,
      modulesCompleted,
      totalModules
    };
  }
};
