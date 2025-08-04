import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "../../../lib/supabaseClient";

export const CTASection = (): JSX.Element => {
  const [city, setCity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage("");

    try {
      // Get user's IP address (simplified for demo)
      const ipResponse = await fetch('https://api.ipify.org?format=json').catch(() => null);
      const ipData = ipResponse ? await ipResponse.json().catch(() => null) : null;
      const ipAddress = ipData?.ip || 'unknown';

      // Check for existing request from same IP for same city in last 24 hours
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: existingRequest } = await supabase
        .from('city_expansion_requests')
        .select('id')
        .eq('city_name', city.trim())
        .eq('ip_address', ipAddress)
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .single();

      if (existingRequest) {
        setSubmitStatus('error');
        setErrorMessage(`You've already requested ${city} today. We'll keep you updated!`);
        return;
      }

      const { error } = await supabase
        .from('city_expansion_requests')
        .insert([
          {
            city_name: city.trim(),
            ip_address: ipAddress
          }
        ]);

      if (error) {
        throw error;
      } else {
        setSubmitStatus('success');
        setCity("");
      }
    } catch (error: any) {
      console.error('Error submitting city request:', error);
      setSubmitStatus('error');
      setErrorMessage('Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-[#1a1a8a] to-[#000080] text-white">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Where should Rentiva expand next?
          </h2>
          <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto">
            Let us know which city you'd like to see Rentiva in! Enter your city below and we'll notify you if we launch there.
          </p>
          
          <div className="max-w-md mx-auto space-y-4">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter your city"
                className="h-12 bg-white text-gray-900 border-0 flex-1"
                required
                disabled={isSubmitting}
              />
              <Button 
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 h-12 font-semibold whitespace-nowrap"
                disabled={isSubmitting || !city.trim()}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Notify Me"
                )}
              </Button>
            </form>

            {/* Success Message */}
            {submitStatus === 'success' && (
              <div className="bg-green-100 text-green-800 p-4 rounded-lg flex items-center gap-3">
                <CheckCircle className="w-5 h-5" />
                <p>Thank you! We'll notify you when we expand to your city.</p>
              </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
              <div className="bg-red-100 text-red-800 p-4 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5" />
                <p>{errorMessage}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};