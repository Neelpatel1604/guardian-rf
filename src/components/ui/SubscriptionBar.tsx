'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import { X,  Info } from 'lucide-react';
import { Button } from './button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

interface SubscriptionInfo {
  planType: 'community' | 'professional' | 'proplus' | 'PayAsYouGo';
  expiryDate: string | null;
  daysRemaining: number | null;
  isExpired: boolean;
}

export const SubscriptionBar = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptionInfo = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Get the current auth session
        const { fetchAuthSession } = await import('aws-amplify/auth');
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        
        if (!idToken) {
          setLoading(false);
          return;
        }
        
        // Fetch subscription data from the pricing API
        const response = await fetch('/api/pricing', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + idToken
          }
        });
        
        if (!response.ok) {
          console.error('Failed to fetch subscription info:', response.statusText);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        
        // Extract plan information
        const planType = data.plan?.name || data.credits?.current_plan || 'community';
        const expiryDate = data.plan?.expiry_date || data.credits?.next_billing_date || null;
        
        // Calculate days remaining if expiry date exists
        let daysRemaining = null;
        let isExpired = false;
        
        if (expiryDate) {
          const now = new Date();
          const expiry = new Date(expiryDate);
          const diffTime = expiry.getTime() - now.getTime();
          daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          isExpired = daysRemaining < 0;
        }
        
        setSubscriptionInfo({
          planType: planType as 'community' | 'professional' | 'proplus' | 'PayAsYouGo',
          expiryDate,
          daysRemaining,
          isExpired
        });
      } catch (error) {
        console.error('Error fetching subscription info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionInfo();
  }, [user]);

  // Don't show anything while loading or if dismissed
  if (loading || dismissed) {
    return null;
  }

  // Don't show for professional or proplus plans 
  if (
    !subscriptionInfo || 
    (subscriptionInfo.planType === 'professional' || subscriptionInfo.planType === 'proplus') && 
    (!subscriptionInfo.daysRemaining || subscriptionInfo.daysRemaining > 7) &&
    !subscriptionInfo.isExpired
  ) {
    return null;
  }

  // Show for community plan with less than 7 days remaining
  const showWarning = subscriptionInfo.planType === 'community' && 
    subscriptionInfo.daysRemaining !== null && 
    subscriptionInfo.daysRemaining <= 7 && 
    subscriptionInfo.daysRemaining > 0;

  // Show for expired plans
  const showExpired = subscriptionInfo.isExpired;

  if (!showWarning && !showExpired) {
    return null;
  }

  return (
    <div className={`w-full py-2 px-4 ${showExpired ? 'bg-gradient-to-r from-red-100 to-red-200 border-l-4 border-red-400' : 'bg-gradient-to-r from-amber-100 to-yellow-200 border-l-4 border-amber-400'} text-gray-800`}>
      <div className="container mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
        <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className={`h-4 w-4 cursor-pointer flex-shrink-0 ${showExpired ? 'text-red-600' : 'text-amber-600'}`} />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>You can still use namespace and playground features, but API Call will be restricted until you upgrade your subscription.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className={`text-xs sm:text-sm font-medium ${showExpired ? 'text-red-800' : 'text-amber-800'} truncate`}>
            {showExpired 
              ? `Your ${subscriptionInfo.planType} plan has expired. Please renew your subscription.` 
              : `Your ${subscriptionInfo.planType} plan will expire in ${subscriptionInfo.daysRemaining} days.`
            }
          </span>

        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button 
            variant="default" 
            size="sm" 
            className={`cursor-pointer h-7 px-2 py-0 text-white w-full sm:w-auto ${showExpired 
              ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
              : 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700'
            }`}
            onClick={() => router.push('/pricing')}
          >
            {showExpired ? 'Upgrade' : 'Renew Now'}
          </Button>
          <button 
            onClick={() => setDismissed(true)}
            className={`hover:opacity-70 cursor-pointer flex-shrink-0 ${showExpired ? 'text-red-600' : 'text-amber-600'}`}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};